"use server";

import { validateRequest } from "@/lib/lucia/auth";
import { hashPassword } from "@/lib/utils/hashPassword";
import {
  changePasswordSchema,
  createPasswordSchema,
  UpdatePasswordSchema,
} from "@/schemas/zod/my/updatePassword.schema";
import { getUser, updateUser } from "@/services/mongoose/auth/user.dal";
import { ActionState } from "@/types/ActionState";
import { verify } from "@node-rs/argon2";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const updatePasswordAction = async (
  hasCurrentPassword: boolean,
  prevState: ActionState<UpdatePasswordSchema<typeof hasCurrentPassword>>,
  data: FormData
) => {
  const { user } = await validateRequest();
  if (!user) {
    redirect("/auth");
  }

  const formData = Object.fromEntries(data);

  try {
    const newPassword = hasCurrentPassword
      ? await handleCurrentPasswordChange(user.id, formData)
      : await handleNewPasswordCreation(formData);

    const newPasswordHash = await hashPassword(newPassword);

    await updateUser({ _id: user.id }, { passwordHash: newPasswordHash });

    revalidatePath("my/settings");

    return { message: "success" };
  } catch (error: any) {
    console.error(error);
    return {
      message: "An error occurred while updating your password. Please try again later.",
    };
  }
};

async function handleCurrentPasswordChange(userId: string, formData: Record<string, any>): Promise<string> {
  const validatedFields = changePasswordSchema.safeParse(formData);
  if (!validatedFields.success) {
    throw {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const existingUser = await getUser({ _id: userId });
  const validPassword = await verify(existingUser.passwordHash ?? "", validatedFields.data.currentPassword);

  if (!validPassword) {
    throw {
      errors: {
        currentPassword: ["Invalid password."],
      },
    };
  }

  return validatedFields.data.newPassword;
}

async function handleNewPasswordCreation(formData: Record<string, any>): Promise<string> {
  const validatedFields = createPasswordSchema.safeParse(formData);
  if (!validatedFields.success) {
    throw {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  return validatedFields.data.newPassword;
}

export { updatePasswordAction };
