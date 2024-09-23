"use server";

import { CheckoutDetailsSchema, checkoutDetailsSchema } from "@/schemas/zod/orderFlow/checkout-details.schema";
import { ActionState } from "@/types/ActionState";
import { redirect } from "next/navigation";
import createCheckoutSession from "./createCheckoutSession";

const manageCheckout = async (
  prevState: ActionState<CheckoutDetailsSchema>,
  formData: FormData
): Promise<ActionState<CheckoutDetailsSchema>> => {
  const data = Object.fromEntries(formData);
  const validatedFields = checkoutDetailsSchema.safeParse(data);

  if (!validatedFields.success) {
    console.log("validatedFields.error", validatedFields.error.flatten().fieldErrors);
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  let url = "";

  try {
    const response = await createCheckoutSession({ deliveryDetails: validatedFields.data });

    url = response.url;
  } catch (error) {
    console.error("Failed to checkout", error);
    return { message: "Failed to checkout. Please try again later." };
  }

  if (!url) {
    return { message: "Failed to checkout. Please try again later." };
  }

  redirect(url);
};

export default manageCheckout;
