"use server";

import { createAuthSession } from "@/lib/lucia/auth";
import { createUser } from "@/services/mongoose/auth/user.dal";
import { createDemoDishes } from "@/services/mongoose/store/dish.dal";
import { createDemoRestaurant } from "@/services/mongoose/store/restaurant.dal";
import crypto from "crypto";
import { redirect } from "next/navigation";

const createDemoUser = async (callbackUrl: string) => {
  const firstName = "Demo";
  const email = crypto.randomBytes(20).toString("hex") + "@demo.com";

  try {
    // Create the demo user
    const userId = await createUser({
      user: {
        firstName,
        email,
        emailVerified: true,
        role: "demo",
        expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
      },
    });

    // Create the auth session
    await createAuthSession(userId);

    await createDemoRestaurant(userId);
    await createDemoDishes(userId);
  } catch (error) {
    console.error("Error creating demo user: ", error);
    throw new Error("An error occurred while creating the demo user. Please try again later.");
  }

  // Redirect to the callback URL
  redirect(callbackUrl);
};

export { createDemoUser };
