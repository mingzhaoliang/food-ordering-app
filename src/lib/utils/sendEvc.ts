import { getRestaurant } from "@/services/mongoose/store/restaurant.dal";
import { generateEvc } from "../lucia/auth";
import { verificationEmailTemplate } from "./emailTemplates";
import { sendEmail } from "./sendEmail";

export const sendEvc = async (userId: string, firstName: string, email: string) => {
  const verificationCode = await generateEvc(userId, email);
  const { name: restaurantName } = await getRestaurant();

  // Send email with verification code
  if (process.env.NODE_ENV === "development") {
    console.log("Verification Code:", verificationCode);
  } else {
    await sendEmail(
      email,
      `${restaurantName} - Email Verification`,
      verificationEmailTemplate(restaurantName, firstName, verificationCode)
    );
  }
};
