"use server";

import { validateRequest } from "@/lib/lucia/auth";
import { avatarSchema, AvatarSchema } from "@/schemas/zod/my/avatar.schema";
import { profileSchema, ProfileSchema } from "@/schemas/zod/my/profile.schema";
import { updateProfile, updateProfileAvatar } from "@/services/mongoose/my/profile.dal";
import { ActionState } from "@/types/ActionState";
import { redirect } from "next/navigation";

const updateProfileAction = async (
  prevState: ActionState<ProfileSchema>,
  formData: FormData
): Promise<ActionState<ProfileSchema>> => {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/auth");
  }

  const data = Object.fromEntries(formData);
  const validatedFields = profileSchema.safeParse(data);

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  try {
    await updateProfile(validatedFields.data);
  } catch (error) {
    console.error("Error updating user: ", error);
    return { message: "An error occurred while updating your profile." };
  }

  return { message: "success" };
};

const deleteAddressAction = async () => {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/auth");
  }

  try {
    await updateProfile({ street: "", city: "", state: "", postcode: "" } as any);
  } catch (error) {
    console.error("Error deleting address: ", error);
    return { message: "An error occurred while deleting your address." };
  }

  return { message: "success" };
};

const updateAvatarAction = async (prevState: ActionState<AvatarSchema>, formData: FormData) => {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/auth");
  }

  const data = Object.fromEntries(formData);

  const validatedFields = avatarSchema.safeParse(data);

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  try {
    await updateProfileAvatar(validatedFields.data);
  } catch (error) {
    console.error(error);
    return { message: "An error occurred. Please try again." };
  }

  return { message: "success" };
};

export { deleteAddressAction, updateAvatarAction, updateProfileAction };
