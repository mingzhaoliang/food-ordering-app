"use server";

import { validateRequest } from "@/lib/lucia/auth";
import { transformErrors, transformFromFormData } from "@/lib/utils/categoryArrayDataProcess";
import { RestaurantSchema, restaurantSchema } from "@/schemas/zod/store/restaurant.schema";
import { updateRestaurant } from "@/services/mongoose/store/restaurant.dal";
import { ActionState } from "@/types/ActionState";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

const updateRestaurantAction = async (prevState: ActionState<RestaurantSchema>, formData: FormData) => {
  const { user } = await validateRequest();

  if (!user) redirect("/auth");
  if (!["admin", "superadmin", "demo"].includes(user.role)) return { message: "Unauthorised!" };

  const data = Object.fromEntries(formData) as Record<string, string | File | object>;

  transformFromFormData(data, "courses");
  transformFromFormData(data, "specialDiets");

  const validatedFields = restaurantSchema.safeParse(data);

  if (!validatedFields.success) {
    const errors = {
      ...validatedFields.error.flatten().fieldErrors,
      courses: transformErrors(validatedFields.error.errors, "courses"),
      specialDiets: transformErrors(validatedFields.error.errors, "specialDiets"),
    };

    console.log("validatedFields error", errors);
    console.log("validatedFields error courses", errors.courses);
    console.log("validatedFields error specialDiets", errors.specialDiets);
    return { errors };
  }

  try {
    await updateRestaurant(validatedFields.data);
  } catch (error) {
    console.error(error);
    return { message: "An error occurred. Please try again later." };
  }

  revalidateTag("restaurant");
  return { message: "success" };
};

export { updateRestaurantAction };
