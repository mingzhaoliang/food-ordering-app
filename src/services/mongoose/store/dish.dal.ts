import { validateRequest } from "@/lib/lucia/auth";
import { cloudinaryIdentifier } from "@/lib/utils/cloudinary";
import { Dish, DishDoc, TDish } from "@/schemas/mongoose/store/dish.model";
import { MenuSchema } from "@/schemas/zod/store/menu.schema";
import { deleteImage, uploadImage } from "@/services/api/cloudinary";
import { Types } from "mongoose";
import { revalidateTag, unstable_cache } from "next/cache";
import slugify from "slugify";
import { validateRole } from "../guard";
import dbConnect from "../mongoose";
import { getSpecialDiets, SpecialDietDTO } from "./restaurant.dal";

const PAGE_LIMIT = 10;

interface DishDTO extends Omit<DishDoc, "specialDiets"> {
  specialDiets: {
    name: string;
    slug: string;
    imageUrl: string;
  }[];
}

const createDishDTO = (dish: TDish, existingSpecialDiets: SpecialDietDTO[]) => {
  const dishDTO: DishDTO = {
    ...dish.toObject(),
    specialDiets: existingSpecialDiets.filter(({ slug }) => dish.specialDiets.includes(slug)),
  };

  return JSON.parse(JSON.stringify(dishDTO));
};

// GET
interface GetDishesArg {
  course?: string;
  featured?: boolean;
  popular?: boolean;
  page?: number;
  limit?: number;
}

interface GetDishesResponse {
  dishes: DishDTO[];
  totalPages: number;
  currentPage: number;
}

const getDishes = async ({
  course,
  featured,
  popular,
  page = 1,
  limit = PAGE_LIMIT,
}: GetDishesArg): Promise<GetDishesResponse> => {
  const { user } = await validateRequest();
  const userId = user?.role === "demo" ? user.id : undefined;

  return unstable_cache(
    async () => {
      try {
        await dbConnect();

        // Build the filter
        const filter: Record<string, any> = { userId };
        if (course) filter.course = course;
        if (featured !== undefined) filter.featured = featured;
        if (popular !== undefined) filter.popular = popular;

        // Pagination options
        const options = { limit, skip: (page - 1) * limit, sort: "-createdAt" };

        // Get total number of documents for pagination
        const totalDishes = await Dish.countDocuments(filter).exec();
        const totalPages = Math.ceil(totalDishes / limit);

        // Handle the case where the requested page is greater than the total number of pages
        if (page > totalPages) {
          return {
            dishes: [],
            totalPages,
            currentPage: totalPages,
          };
        }

        // Fetch the dishes for the current page
        const dishes = await Dish.find(filter, {}, options).exec();

        // Fetch special diets for the restaurant
        const existingSpecialDiets = await getSpecialDiets();

        // Create DishDTO
        const dishesDTO = dishes.map((dish) => createDishDTO(dish, existingSpecialDiets));

        return { dishes: dishesDTO, totalPages, currentPage: page };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch dishes.");
      }
    },
    [
      "dishes",
      course ?? "",
      featured?.toString() ?? "",
      popular?.toString() ?? "",
      page.toString(),
      limit.toString(),
      userId ?? "",
    ],
    { tags: ["dishes"], revalidate: 60 * 60 }
  )();
};

const getDish = async ({ id, slug }: { id?: string; slug?: string }): Promise<DishDTO> => {
  const { user } = await validateRequest();
  const userId = user?.role === "demo" ? user.id : undefined;

  return unstable_cache(
    async () => {
      try {
        await dbConnect();
        const dish = await Dish.findOne({ userId, $or: [{ _id: id }, { slug }] }).exec();

        if (!dish) {
          throw new Error("Dish not found.");
        }

        // Fetch special dietary options for the restaurant
        const existingSpecialDiets = await getSpecialDiets();

        const dishDTO = createDishDTO(dish, existingSpecialDiets);

        return dishDTO;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch dish.");
      }
    },
    ["dish", id ?? slug ?? "", userId ?? ""],
    { tags: ["dish"], revalidate: 60 * 60 * 24 }
  )();
};

const createDemoDishes = async (userId: string) => {
  try {
    await dbConnect();

    const dishes = await Dish.find({ userId: undefined }).exec();

    const dishesDemo = await Promise.all(
      dishes.map(async (dish) => {
        const imageUrl = dish.image.imageUrl;
        const uploadResult = await uploadImage(imageUrl, {
          folder: `/food-ordering-app/restaurant-demo/menu/${dish.course}`,
        });

        const dishDemo = {
          ...dish.toObject(),
          _id: new Types.ObjectId(),
          image: cloudinaryIdentifier(uploadResult) as any,
          userId,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
        };

        return dishDemo;
      })
    );

    await Dish.insertMany(dishesDemo);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create demo dishes.");
  }
};

const updateDish = async ({ id, data }: { id: string | undefined; data: MenuSchema }): Promise<string> => {
  try {
    const { user } = await validateRole(["admin", "superadmin", "demo"]);
    const isDemo = user.role === "demo";

    if (data.imageFile.size) {
      const uploadResult = await uploadImage(data.imageFile, {
        folder: `/food-ordering-app/restaurant${isDemo ? "-demo" : ""}/menu/${data.course}`,
        publicId: data.image.publicId || undefined,
      });

      data.image = cloudinaryIdentifier(uploadResult);
    }

    const dbReadyData = {
      ...Object.fromEntries(Object.entries(data).filter(([key]) => key !== "imageFile")),
      slug: slugify(data.name, { lower: true }),
    };

    await dbConnect();

    const dish = id
      ? await Dish.findOneAndUpdate({ _id: id, userId: isDemo ? user.id : undefined }, dbReadyData, {
          new: true,
        }).exec()
      : await Dish.create({
          ...dbReadyData,
          ...(isDemo ? { userId: user.id, expiresAt: new Date(Date.now() + 1000 * 60 * 60) } : {}),
        });

    if (!dish) {
      throw new Error("Update failed. Dish not found.");
    }

    const { _id } = dish;

    ["dishes", "dish"].forEach((key) => {
      revalidateTag(key);
    });

    return _id.toString();
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message ?? "Failed to update dish.");
  }
};

const deleteDish = async ({ id }: { id: string }): Promise<void> => {
  try {
    const { user } = await validateRole(["admin", "superadmin", "demo"]);
    const isDemo = user.role === "demo";

    await dbConnect();
    const dish = await Dish.findOneAndDelete({ _id: id, userId: isDemo ? user.id : undefined }).exec();

    if (!dish) {
      throw new Error("Dish not found.");
    }

    await deleteImage(dish.image.publicId);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete dish.");
  }
};

export { createDemoDishes, deleteDish, getDish, getDishes, updateDish, type DishDTO };
