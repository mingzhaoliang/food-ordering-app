"use server";

import { createAuthSession, validateRequest } from "@/lib/lucia/auth";
import { lucia } from "@/lib/lucia/lucia";
import { EvcSchema, evcSchema } from "@/schemas/zod/auth/evc.schema";
import { deleteEmailVerificationCodeById, getEmailVerificationCode } from "@/services/mongoose/auth/evc.dal";
import { updateUser } from "@/services/mongoose/auth/user.dal";
import { ActionState } from "@/types/ActionState";
import { redirect } from "next/navigation";
import { isWithinExpirationDate } from "oslo";

export const verifyEvc = async (prevState: ActionState<EvcSchema>, formData: FormData) => {
  const { user } = await validateRequest();

  if (!user) redirect("/auth");

  const data = Object.fromEntries(formData);
  const validatedFields = evcSchema.safeParse(data);

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const databaseCode = await getEmailVerificationCode(user.id);

  // Compare user inputted verification code with the one in the database
  if (!databaseCode || databaseCode.code !== validatedFields.data.evc) {
    return { errors: { evc: ["Invalid email verification code."] } };
  }

  // Delete the verification code from the database if both codes match
  await deleteEmailVerificationCodeById(databaseCode.id);

  // Check expiration date and email
  if (!isWithinExpirationDate(databaseCode.expiresAt) || databaseCode.email !== user.email) {
    return { errors: { evc: ["Invalid email verification code."] } };
  }

  await lucia.invalidateUserSessions(user.id);
  await updateUser({ _id: user.id }, { email_verified: true });
  await createAuthSession(user.id);

  redirect("/");
};
