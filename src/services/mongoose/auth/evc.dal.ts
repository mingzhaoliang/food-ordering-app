import "server-only";

import Evc from "@/schemas/mongoose/auth/evc.model";
import { ObjectId } from "mongoose";
import { createDate, TimeSpan } from "oslo";
import dbConnect from "../mongoose";

const deleteAllEmailVerificationCodes = async (userId: string) => {
  try {
    await dbConnect();
    await Evc.deleteMany({ userId }).exec();
  } catch (error) {
    console.error(error);
    throw new Error("Database Error: Failed to delete email verification codes");
  }
};

const createEmailVerificationCode = async (userId: string, email: string, code: string) => {
  try {
    await dbConnect();
    await Evc.create({
      userId,
      email,
      code,
      expiresAt: createDate(new TimeSpan(15, "m")),
    });

    return code;
  } catch (error) {
    console.error(error);
    throw new Error("Database Error: Failed to create email verification code");
  }
};

const getEmailVerificationCode = async (userId: string) => {
  try {
    await dbConnect();
    const databaseCode = await Evc.findOne({ userId }).exec();

    return databaseCode;
  } catch (error) {
    console.error(error);
    throw new Error("Database Error: Failed to get email verification code");
  }
};

const deleteEmailVerificationCodeById = async (id: ObjectId) => {
  try {
    await dbConnect();
    await Evc.findByIdAndDelete(id).exec();
  } catch (error) {
    console.error(error);
    throw new Error("Database Error: Failed to delete email verification code");
  }
};

const resendEvcEligibilityCheck = async (userId: string) => {
  const oldVerificationCode = await getEmailVerificationCode(userId);
  if (oldVerificationCode) {
    const { createdAt } = oldVerificationCode;
    const createdTime = createdAt.getTime();
    const currentTime = new Date().getTime();
    if (currentTime - createdTime <= 60000) {
      throw new Error("Verification code already sent. Please check your email.");
    }
  }
};

export {
  createEmailVerificationCode,
  deleteAllEmailVerificationCodes,
  deleteEmailVerificationCodeById,
  getEmailVerificationCode,
  resendEvcEligibilityCheck,
};
