import { cloudinaryIdentifier } from "@/lib/utils/cloudinary";
import { Dish, DishDoc, TDish } from "@/schemas/mongoose/store/dish.model";
import { MenuSchema } from "@/schemas/zod/store/menu.schema";
import { deleteImage, uploadImage } from "@/services/api/cloudinary";
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

const getDishes = unstable_cache(
  async ({ course, featured, popular, page = 1, limit = PAGE_LIMIT }: GetDishesArg): Promise<GetDishesResponse> => {
    try {
      await dbConnect();

      // Build the filter
      const filter: Record<string, any> = {};
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
  ["dishes"],
  { tags: ["dishes"], revalidate: 60 * 60 }
);

const getDish = unstable_cache(
  async ({ id }: { id: string }): Promise<DishDTO> => {
    try {
      await dbConnect();
      const dish = await Dish.findById(id).exec();

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
  ["dish"],
  { tags: ["dish"], revalidate: 60 * 60 * 24 }
);

const updateDish = async ({ id, data }: { id: string | undefined; data: MenuSchema }): Promise<string> => {
  try {
    await validateRole(["admin", "superadmin"]);

    if (data.imageFile.size) {
      const uploadResult = await uploadImage(data.imageFile, {
        folder: `/food-ordering-app/restaurant/menu/${data.course}`,
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
      ? await Dish.findOneAndUpdate({ _id: id }, dbReadyData, { new: true }).exec()
      : await Dish.create(dbReadyData);

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
    await validateRole(["admin", "superadmin"]);

    await dbConnect();
    const dish = await Dish.findOneAndDelete({ _id: id }).exec();

    if (!dish) {
      throw new Error("Dish not found.");
    }

    await deleteImage(dish.image.publicId);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete dish.");
  }
};

export { deleteDish, getDish, getDishes, updateDish, type DishDTO };
