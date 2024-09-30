import "server-only";

import { validateRequest } from "@/lib/lucia/auth";
import { cloudinaryIdentifier } from "@/lib/utils/cloudinary";
import { Dish } from "@/schemas/mongoose/store/dish.model";
import {
  CourseDoc,
  Restaurant,
  RestaurantDoc,
  SpecialDietDoc,
  TRestaurant,
} from "@/schemas/mongoose/store/restaurant.model";
import { CategorySchema, RestaurantSchema } from "@/schemas/zod/store/restaurant.schema";
import { deleteImage, restoreImages, uploadImage } from "@/services/api/cloudinary";
import { startSession, Types } from "mongoose";
import { revalidateTag, unstable_cache } from "next/cache";
import slugify from "slugify";
import { validateRole } from "../guard";
import dbConnect from "../mongoose";

const initliaseRestaurant = async () => {
  try {
    await dbConnect();
    const restaurant = {
      name: "Restaurant",
      contactNumber: "+61423456789",
      email: "demo@example.com",
      street: "123 Fake Street",
      city: "Fake City",
      state: "Fake State",
      postcode: "1234",
      deliveryFee: 5,
      freeDeliveryThreshold: 50,
      estimatedDeliveryTime: 30,
    };

    const newRestaurant = await Restaurant.create(restaurant);

    return newRestaurant;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to initialise restaurant.");
  }
};

interface CourseDTO extends Omit<CourseDoc, "image"> {
  imageUrl: string;
}
interface SpecialDietDTO extends Omit<SpecialDietDoc, "image"> {
  imageUrl: string;
}

const createCourseDTO = (course: TRestaurant["courses"][number]): CourseDTO => {
  const courseDTO = {
    name: course.name,
    slug: course.slug,
    imageUrl: course.image.imageUrl,
  };

  return JSON.parse(JSON.stringify(courseDTO));
};

const createSpecialDietDTO = (specialDiet: TRestaurant["specialDiets"][number]): SpecialDietDTO => {
  const specialDietDTO = {
    name: specialDiet.name,
    slug: specialDiet.slug,
    imageUrl: specialDiet.image.imageUrl,
  };

  return JSON.parse(JSON.stringify(specialDietDTO));
};

const getCourses = async (skip?: boolean) => {
  let userId = undefined;

  if (!skip) {
    const { user } = await validateRequest();
    userId = user?.role === "demo" ? user.id : undefined;
  }

  return unstable_cache(
    async () => {
      try {
        await dbConnect();
        let restaurant = await Restaurant.findOne({ userId }, { courses: 1 }).exec();

        if (!restaurant) {
          restaurant = await initliaseRestaurant();
        }

        const { courses } = restaurant;

        return courses.map(createCourseDTO);
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch restaurant.");
      }
    },
    ["courses", userId || ""],
    { tags: ["restaurant", "courses"] }
  )();
};

const getSpecialDiets = async () => {
  const { user } = await validateRequest();
  const userId = user?.role === "demo" ? user.id : undefined;

  return unstable_cache(
    async () => {
      try {
        await dbConnect();
        let restaurant = await Restaurant.findOne({ userId }, { specialDiets: 1 }).exec();

        if (!restaurant) {
          restaurant = await initliaseRestaurant();
        }

        const { specialDiets } = restaurant;

        return specialDiets.map(createSpecialDietDTO);
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch restaurant.");
      }
    },
    ["specialDiets", userId || ""],
    { tags: ["restaurant", "specialDiets"] }
  )();
};

const getCoursesAndSpecialDiets = async () => {
  const { user } = await validateRequest();
  const userId = user?.role === "demo" ? user.id : undefined;

  return unstable_cache(
    async () => {
      try {
        await dbConnect();
        let restaurant = await Restaurant.findOne({ userId }, { courses: 1, specialDiets: 1 }).exec();

        if (!restaurant) {
          restaurant = await initliaseRestaurant();
        }

        const { courses, specialDiets } = restaurant;

        return {
          courses: courses.map(createCourseDTO),
          specialDiets: specialDiets.map(createSpecialDietDTO),
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch courses and special diets.");
      }
    },
    ["courses", "specialDiets", userId || ""],
    { tags: ["restaurant", "courses", "specialDiets"] }
  )();
};

interface RestaurantDTO extends RestaurantDoc {}

const createRestaurantDTO = (restaurant: TRestaurant) => {
  const restaurantDTO: RestaurantDTO = { ...restaurant.toObject() };

  return JSON.parse(JSON.stringify(restaurantDTO));
};

const getRestaurant = async (skip?: boolean) => {
  let userId = undefined;

  if (!skip) {
    const { user } = await validateRequest();
    userId = user?.role === "demo" ? user.id : undefined;
  }

  return unstable_cache(
    async (): Promise<RestaurantDTO> => {
      try {
        await dbConnect();
        let restaurant = await Restaurant.findOne({ userId }).exec();

        if (!restaurant) {
          restaurant = await initliaseRestaurant();
        }

        return createRestaurantDTO(restaurant);
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch restaurant.");
      }
    },
    ["restaurant", userId || ""],
    { tags: ["restaurant"] }
  )();
};

const createDemoRestaurant = async (userId: string): Promise<void> => {
  try {
    await dbConnect();

    const restaurant = await Restaurant.findOne({ userId: undefined }).exec();
    if (!restaurant) throw new Error("Restaurant seed not found.");

    const restaurantObj = restaurant.toObject();
    const demoRestaurant = {
      ...restaurantObj,
      _id: new Types.ObjectId(),
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
      courses: await uploadImages(restaurantObj.courses, "/food-ordering-app/restaurant-demo/courses"),
      specialDiets: await uploadImages(restaurantObj.specialDiets, "/food-ordering-app/restaurant-demo/specialDiets"),
    };

    await Restaurant.create(demoRestaurant);
    revalidateTag("restaurant");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create demo restaurant.");
  }
};

const uploadImages = async (items: any[], folder: string) => {
  return Promise.all(
    items.map(async ({ name, slug, image }) => {
      const uploadResult = await uploadImage(image.imageUrl, { folder });
      return { name, slug, image: cloudinaryIdentifier(uploadResult) };
    })
  );
};

const updateRestaurant = async (data: RestaurantSchema): Promise<void> => {
  try {
    await dbConnect();
    const session = await startSession();
    session.startTransaction();

    try {
      const { user } = await validateRole(["admin", "superadmin", "demo"]);
      const isDemo = user.role === "demo";
      const userId = isDemo ? user.id : undefined;

      const restaurant = await Restaurant.findOne({ userId }).exec();

      if (!restaurant) {
        throw new Error("Restaurant not found.");
      }

      // Create sets for existing and new items
      const courseSet = new Set(data.courses.map((course) => slugify(course.name, { lower: true })));
      const specialDietSet = new Set(
        data.specialDiets.map((specialDiet) => slugify(specialDiet.name, { lower: true }))
      );

      const { courses: existingCourses, specialDiets: existingSpecialDiets } = restaurant;

      // Process courses and special diets
      if (existingCourses) {
        await deleteRemovedItems(existingCourses, courseSet, async (slug) => {
          await Dish.deleteMany({ courses: slug }, { session }).exec();
        });
      }

      if (existingSpecialDiets) {
        await deleteRemovedItems(existingSpecialDiets, specialDietSet, async (slug) => {
          await Dish.updateMany({ specialDiets: slug }, { $pull: { specialDiets: slug } }, { session }).exec();
        });
      }

      // Upload new images and update the data
      const updatedCourses = await manageCourseAndSpecialDiet(
        `/food-ordering-app/restaurant${isDemo ? "-demo" : ""}/courses`,
        data.courses
      );
      const updatedSpecialDiets = await manageCourseAndSpecialDiet(
        `/food-ordering-app/restaurant${isDemo ? "-demo" : ""}/specialDiets`,
        data.specialDiets
      );

      const dbReadyData = {
        ...data,
        courses: updatedCourses,
        specialDiets: updatedSpecialDiets,
      };

      // Update the restaurant with the new data
      await Restaurant.updateOne({ userId, name: restaurant.name }, dbReadyData).exec();

      // Commit the transaction
      await session.commitTransaction();

      revalidateTag("restaurant");
    } catch (error: any) {
      await session.abortTransaction();
      throw new Error(error.message);
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update restaurant.");
  }
};

const manageCourseAndSpecialDiet = async (folder: string, categories: CategorySchema[]) => {
  // Filter unchanged items
  const updatedCategories = categories.map(async ({ name, image, imageFile }) => {
    let updatedCategory;
    if (imageFile.size === 0) {
      updatedCategory = {
        name,
        slug: slugify(name, { lower: true }),
        image,
      };
    } else {
      const uploadResult = await uploadImage(imageFile, { folder, publicId: image.publicId || undefined });

      updatedCategory = {
        name,
        slug: slugify(name, { lower: true }),
        image: cloudinaryIdentifier(uploadResult),
      };
    }

    return updatedCategory;
  });

  return await Promise.all(updatedCategories);
};

const deleteRemovedItems = async (
  existingItems: Array<{ slug: string; image: { publicId: string } }>,
  validatedItemsSet: Set<string>,
  deleteCallback: (itemSlug: string) => Promise<void>
) => {
  let deletedImages: string[] = [];

  for (const item of existingItems) {
    if (!validatedItemsSet.has(item.slug)) {
      try {
        // Delete image
        await deleteImage(item.image.publicId);
        deletedImages.push(item.image.publicId);
        // Perform the deletion of related items
        await deleteCallback(item.slug);
      } catch (error) {
        // Rollback the deletion of images
        if (deletedImages.length) {
          await restoreImages(deletedImages);
        }
        console.error(`Failed to process deletion for slug: ${item.slug}`, error);
        throw new Error("Failed to update dishes related to the removed items.");
      }
    }
  }
};

export {
  createDemoRestaurant,
  getCourses,
  getCoursesAndSpecialDiets,
  getRestaurant,
  getSpecialDiets,
  updateRestaurant,
  type RestaurantDTO,
  type SpecialDietDTO,
};
