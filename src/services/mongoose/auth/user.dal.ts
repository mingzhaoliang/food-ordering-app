import "server-only";

import { hashPassword } from "@/lib/utils/hashPassword";
import { Account } from "@/schemas/mongoose/auth/account.model";
import { User, UserDoc } from "@/schemas/mongoose/auth/user.model";
import { Profile, ProfileDoc } from "@/schemas/mongoose/my/profile.model";
import dbConnect from "@/services/mongoose/mongoose";
import { generateIdFromEntropySize } from "lucia";
import { startSession } from "mongoose";
import { revalidatePath } from "next/cache";

interface CreateUserArgs {
  user: {
    firstName: string;
    lastName?: string;
    email: string;
    password?: string;
    emailVerified?: boolean;
  };
  account?: {
    providerId: string;
    providerUserId: string;
  };
}

export const createUser = async ({ user, account }: CreateUserArgs): Promise<string> => {
  try {
    await dbConnect();
    const session = await startSession();
    session.startTransaction();

    try {
      const existingUser = await getUser({ email: user.email });

      // Hash the password
      const passwordHash = user.password ? await hashPassword(user.password) : undefined;

      // Check if the user already exists
      if (existingUser) {
        console.error("User already exists", existingUser);
        throw new Error("An account with this email already exists.");
      }

      const userId = generateIdFromEntropySize(10);

      const userData: Partial<UserDoc> = {
        _id: userId,
        email: user.email,
        passwordHash,
        emailVerified: user.emailVerified || false,
      };

      const profileData: Partial<ProfileDoc> = {
        userId,
        firstName: user.firstName,
        lastName: user.lastName || "",
      };

      await User.create([userData], { session });
      await Profile.create([profileData], { session });

      if (account) {
        await Account.create([{ _id: account, userId }], { session });
      }

      await session.commitTransaction();

      return userId;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create your account. Please try again later.");
  }
};

export const getUser = async (filter: { [key: string]: string } = {}): Promise<UserDoc> => {
  try {
    await dbConnect();
    const user = await User.findOne(filter);

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error(error);
    throw new Error("Database Error: Failed to get user");
  }
};

export const updateUser = async (filter: { [key: string]: string }, update: { [key: string]: any }) => {
  try {
    await dbConnect();
    await User.updateOne(filter, update, { upsert: true }).exec();

    revalidatePath("/my/profile", "layout");
  } catch (error) {
    console.error(error);
    throw new Error("Database Error: Failed to update user");
  }
};

export const deleteUserById = async (id: string) => {
  try {
    await dbConnect();
    await User.findByIdAndDelete(id).exec();
  } catch (error) {
    console.error(error);
    throw new Error("Database Error: Failed to delete user");
  }
};
