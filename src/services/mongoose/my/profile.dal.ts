import "server-only";

import { validateRequest } from "@/lib/lucia/auth";
import { cloudinaryIdentifier } from "@/lib/utils/cloudinary";
import { Profile, ProfileDoc, TProfile } from "@/schemas/mongoose/my/profile.model";
import { AvatarSchema } from "@/schemas/zod/my/avatar.schema";
import { ProfileSchema } from "@/schemas/zod/my/profile.schema";
import { uploadImage } from "@/services/api/cloudinary";
import { revalidatePath } from "next/cache";
import dbConnect from "../mongoose";

interface ProfileDTO extends ProfileDoc {}

const createProfileDTO = (profile: TProfile): ProfileDTO => {
  const profileDTO = { ...profile.toObject() };

  return JSON.parse(JSON.stringify(profileDTO));
};

const getProfile = async (): Promise<ProfileDTO> => {
  try {
    const { user } = await validateRequest();

    if (!user) {
      throw new Error("Unauthorised!");
    }

    await dbConnect();
    const profile = await Profile.findOne({ userId: user.id }).exec();

    if (!profile) {
      throw new Error("Profile not found");
    }

    return createProfileDTO(profile);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch profile.");
  }
};

const updateProfile = async (profile: ProfileSchema) => {
  try {
    const { user } = await validateRequest();

    if (!user) {
      throw new Error("Unauthorised!");
    }

    await dbConnect();

    await Profile.updateOne({ userId: user.id }, profile).exec();

    revalidatePath("/my/profile");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update profile.");
  }
};

const updateProfileAvatar = async ({ avatar }: AvatarSchema) => {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Unauthorised!");
  }

  try {
    await dbConnect();

    const profile = await Profile.findOne({ userId: user.id }).exec();

    if (!profile) {
      throw new Error("Profile not found!");
    }

    const uploadResult = await uploadImage(avatar, {
      folder: "/food-ordering-app/user/avatar",
      publicId: profile.avatar?.publicId || undefined,
    });

    const updatedAvatar = cloudinaryIdentifier(uploadResult);

    await Profile.updateOne({ userId: user.id }, { avatar: updatedAvatar }).exec();

    revalidatePath("/my/profile", "layout");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update profile avatar.");
  }
};

export { getProfile, updateProfile, updateProfileAvatar, type ProfileDTO };
