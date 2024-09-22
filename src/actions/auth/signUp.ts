"use server";

import { createAuthSession } from "@/lib/lucia/auth";
import { sendEvc } from "@/lib/utils/sendEvc";
import { SignupSchema, signupSchema } from "@/schemas/zod/auth/signup.schema";
import { createUser } from "@/services/mongoose/auth/user.dal";
import { ActionState } from "@/types/ActionState";
import { redirect } from "next/navigation";

export const signUp = async (
  prevState: ActionState<SignupSchema>,
  formData: FormData
): Promise<ActionState<SignupSchema>> => {
  const data = Object.fromEntries(formData);
  const validatedFields = signupSchema.safeParse(data);

  // Check if the fields are valid
  if (!validatedFields.success) {
    console.log("errors", { errors: validatedFields.error.flatten().fieldErrors });
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  try {
    const userId = await createUser({ user: validatedFields.data });

    await sendEvc(userId, validatedFields.data.firstName, validatedFields.data.email);

    await createAuthSession(userId);
  } catch (error) {
    console.error(error);
    return {
      message: "An error occurred while signing up. Please try again later.",
    };
  }

  redirect("/auth/email-verification");
};
