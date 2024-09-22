"use server";

import { validateRequest } from "@/lib/lucia/auth";
import { lucia } from "@/lib/lucia/lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const signOut = async () => {
  const { session } = await validateRequest();
  if (!session) {
    redirect("/auth");
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  redirect("/auth");
};
