"use server";

import { validateRequest } from "@/lib/lucia/auth";
import { menuSchema, MenuSchema } from "@/schemas/zod/store/menu.schema";
import { deleteDish, updateDish } from "@/services/mongoose/store/dish.dal";
import { ActionState } from "@/types/ActionState";
import { redirect } from "next/navigation";

const updateMenuItemAction = async (id: string | undefined, prevState: ActionState<MenuSchema>, formData: FormData) => {
  const { user } = await validateRequest();

  if (!user) redirect("/auth");

  if (!["admin", "superadmin"].includes(user.role)) return { message: "Unauthorised!" };

  const data = Object.fromEntries(formData);
  data.customisation = JSON.parse(data.customisation as string);
  data.image = JSON.parse(data.image as string);
  data.specialDiets = JSON.parse(data.specialDiets as string);
  const validatedFields = menuSchema.safeParse(data);

  if (!validatedFields.success) {
    console.log("validatedFields.error", validatedFields.error.flatten().fieldErrors);
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  try {
    const dishId = await updateDish({ id, data: validatedFields.data });

    return { message: "success", payload: dishId };
  } catch (error) {
    console.error(error);
    return { message: "An error occurred. Please try again later." };
  }
};

const deleteMenuItemAction = async (id: string | undefined, successUrl: string) => {
  const { user } = await validateRequest();

  if (!user) redirect("/auth");

  if (!["admin", "superadmin"].includes(user.role)) return { message: "Unauthorised!" };

  if (id === undefined) {
    return null;
  }

  try {
    await deleteDish({ id });
  } catch (error) {
    console.error(error);
    return { message: "An error occurred. Please try again later." };
  }

  redirect(successUrl);
};

export { deleteMenuItemAction, updateMenuItemAction };
