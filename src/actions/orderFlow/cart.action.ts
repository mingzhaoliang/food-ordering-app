"use server";

import { validateRequest } from "@/lib/lucia/auth";
import { cartItemSchema, CartItemSchema } from "@/schemas/zod/orderFlow/cart-item.schema";
import { addCartItem, deleteCartItem, updateCartItem } from "@/services/mongoose/orderFlow/cart.dal";
import { ActionState } from "@/types/ActionState";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";

const addCartItemAction = async (dishId: string, prevState: ActionState<CartItemSchema>, formData: FormData) => {
  const { user } = await validateRequest();
  let userId = user?.id || cookies().get("guestSessionId")?.value;

  if (!userId) {
    userId = generateIdFromEntropySize(10);
    cookies().set("guestSessionId", userId, {
      httpOnly: true,
      maxAge: 60 * 60 * 2,
    });
  }

  const data = Object.fromEntries(formData);
  data.addOns = JSON.parse((data.addOns || "[]") as string);

  const validatedFields = cartItemSchema.safeParse(data);

  if (!validatedFields.success) {
    console.error(validatedFields.error.flatten().fieldErrors);
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  try {
    await addCartItem(dishId, validatedFields.data);

    return { message: "success" };
  } catch (error) {
    console.error(error);
    return { message: "An error occurred. Please try again later." };
  }
};

const updateCartItemAction = async (cartItemId: string, quantity: number) => {
  if (quantity < 1) {
    return { message: "Invalid quantity." };
  }

  try {
    await updateCartItem(cartItemId, quantity);

    return { message: "success" };
  } catch (error) {
    console.error(error);
    return { message: "An error occurred. Please try again later." };
  }
};

const deleteCartItemAction = async (cartItemId: string) => {
  try {
    await deleteCartItem(cartItemId);
    return { message: "success" };
  } catch (error) {
    console.error(error);
    return { message: "An error occurred. Please try again later." };
  }
};

export { addCartItemAction, deleteCartItemAction, updateCartItemAction };
