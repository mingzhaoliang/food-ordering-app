import "server-only";

import { cloudinaryIdentifier } from "@/lib/utils/cloudinary";
import { Dish } from "@/schemas/mongoose/store/dish.model";
import { Restaurant, RestaurantDoc, TRestaurant } from "@/schemas/mongoose/store/restaurant.model";
import { CategorySchema, RestaurantSchema } from "@/schemas/zod/store/restaurant.schema";
import { deleteImage, restoreImages, uploadImage } from "@/services/api/cloudinary";
import { startSession } from "mongoose";
import slugify from "slugify";
import { validateRole } from "../guard";
import dbConnect from "../mongoose";

interface RestaurantDTO extends RestaurantDoc {}

const createRestaurantDTO = (restaurant: TRestaurant) => {
  const restaurantDTO: RestaurantDTO = { ...restaurant.toObject() };

  return JSON.parse(JSON.stringify(restaurantDTO));
};

const getRestaurant = async (): Promise<RestaurantDTO> => {
  try {
    await dbConnect();
    const restaurant = await Restaurant.findOne().exec();

    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    return createRestaurantDTO(restaurant);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch restaurant.");
  }
};

const updateRestaurant = async (data: RestaurantSchema): Promise<void> => {
  await dbConnect();
  const session = await startSession();
  session.startTransaction();

  try {
    await validateRole(["admin", "superadmin"]);

    const restaurant = await Restaurant.findOne().exec();

    if (!restaurant) {
      throw new Error("Restaurant not found.");
    }

    // Create sets for existing and new items
    const courseSet = new Set(data.courses.map((course) => slugify(course.name, { lower: true })));
    const specialDietSet = new Set(data.specialDiets.map((specialDiet) => slugify(specialDiet.name, { lower: true })));

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
    const updatedCourses = await manageCourseAndSpecialDiet("/food-ordering-app/restaurant/courses", data.courses);
    const updatedSpecialDiets = await manageCourseAndSpecialDiet(
      "/food-ordering-app/restaurant/specialDiets",
      data.specialDiets
    );

    const dbReadyData = {
      ...data,
      courses: updatedCourses,
      specialDiets: updatedSpecialDiets,
    };

    // Update the restaurant with the new data
    await Restaurant.updateOne({ name: restaurant.name }, dbReadyData).exec();

    // Commit the transaction
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    throw new Error("Failed to update restaurant.");
  } finally {
    session.endSession();
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

export { getRestaurant, updateRestaurant, type RestaurantDTO };
