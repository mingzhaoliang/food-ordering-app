"use server";

import { createAuthSession } from "@/lib/lucia/auth";
import { SigninSchema, signinSchema } from "@/schemas/zod/auth/signin.schema";
import { getUser } from "@/services/mongoose/auth/user.dal";
import { ActionState } from "@/types/ActionState";
import { hash, verify } from "@node-rs/argon2";
import { redirect } from "next/navigation";

export const signIn = async (
  callbackUrl: string,
  prevState: ActionState<SigninSchema>,
  formData: FormData
): Promise<ActionState<SigninSchema>> => {
  const data = Object.fromEntries(formData);
  const validatedFields = signinSchema.safeParse(data);

  // Check if the fields are valid
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  try {
    const existingUser = await getUser({ email: validatedFields.data.email });

    const validPassword = existingUser?.passwordHash
      ? await verify(existingUser.passwordHash, validatedFields.data.password, {
          memoryCost: 19456,
          timeCost: 2,
          outputLen: 32,
          parallelism: 1,
        })
      : await hash(validatedFields.data.password, {
          memoryCost: 19456,
          timeCost: 2,
          outputLen: 32,
          parallelism: 1,
        });

    // Check if the user exists and the password is valid
    if (!existingUser || !validPassword) {
      return {
        errors: {
          email: ["Invalid email or password."],
          password: ["Invalid email or password."],
        },
      };
    }

    await createAuthSession(existingUser._id);
  } catch (error) {
    console.error("Error signing in: ", error);
    return {
      errors: {
        email: ["Invalid email or password."],
        password: ["Invalid email or password."],
      },
    };
  }

  redirect(callbackUrl);
};
