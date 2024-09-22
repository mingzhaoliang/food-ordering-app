import "server-only";

import { Session, User } from "lucia";
import { cookies } from "next/headers";
import { cache } from "react";
import { lucia } from "./lucia";
import { createEmailVerificationCode, deleteAllEmailVerificationCodes } from "@/services/mongoose/auth/evc.dal";
import { alphabet, generateRandomString } from "oslo/crypto";

const validateRequest = cache(async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) return { user: null, session: null };

  const result = await lucia.validateSession(sessionId);

  try {
    // refresh session
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
    // clear session if it's invalid
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
  } catch {}

  return result;
});

const createAuthSession = async (userId: string) => {
  await lucia.invalidateUserSessions(userId);
  const session: Session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
};

const generateEvc = async (userId: string, email: string): Promise<string> => {
  await deleteAllEmailVerificationCodes(userId);

  const code = generateRandomString(6, alphabet("0-9", "A-Z"));
  await createEmailVerificationCode(userId, email, code);

  return code;
};

export { validateRequest, createAuthSession, generateEvc };
