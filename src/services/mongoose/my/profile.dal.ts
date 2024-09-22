import "server-only";

import { validateRequest } from "@/lib/lucia/auth";
import { Profile, ProfileDoc, TProfile } from "@/schemas/mongoose/my/profile.model";
import { unstable_cache } from "next/cache";
import dbConnect from "../mongoose";

interface ProfileDTO extends ProfileDoc {}

const createProfileDTO = (profile: TProfile): ProfileDTO => {
  const profileDTO = { ...profile.toObject() };

  return JSON.parse(JSON.stringify(profileDTO));
};

const getProfile = unstable_cache(
  async (): Promise<ProfileDTO> => {
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
  },
  ["profile"],
  { tags: ["profile"], revalidate: 60 * 60 * 24 }
);

export { getProfile, type ProfileDTO };
