import { Lucia } from "lucia";
import { adapter } from "./adapter";
import { UserRole } from "@/schemas/mongoose/auth/user.model";

const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      role: attributes.role,
      emailVerified: attributes.emailVerified,
    };
  },
});

interface DatabaseUserAttributes {
  email: string;
  role: UserRole;
  emailVerified: boolean;
}

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

export { lucia };
