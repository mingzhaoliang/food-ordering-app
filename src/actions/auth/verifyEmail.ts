"use server";

import { validateRequest } from "@/lib/lucia/auth";
import { sendEvc } from "@/lib/utils/sendEvc";
import { resendEvcEligibilityCheck } from "@/services/mongoose/auth/evc.dal";
import { getProfile } from "@/services/mongoose/my/profile.dal";
import { redirect } from "next/navigation";

export const verifyEmail = async (resend?: boolean) => {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/auth");
  }

  const { firstName } = await getProfile();

  try {
    await resendEvcEligibilityCheck(user.id);
    await sendEvc(user.id, firstName, user.email);
  } catch (error: any) {
    console.error(error);
    if (error.message === "Verification code already sent. Please check your email.") {
      redirect("/auth/email-verification");
    }
    return { message: "An error occurred. Please try again." };
  }

  if (resend) {
    return { message: "success" };
  } else {
    redirect("/auth/email-verification");
  }
};
