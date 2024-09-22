import { validateRequest } from "@/lib/lucia/auth";
import { UserRole } from "@/schemas/mongoose/auth/user.model";

export const validateRole = async (roles: UserRole | UserRole[]) => {
  const { user } = await validateRequest();

  const roleList = Array.isArray(roles) ? roles : [roles];

  if (!user || !roleList.includes(user.role)) {
    throw new Error("Unauthorised.");
  }

  return { user };
};
