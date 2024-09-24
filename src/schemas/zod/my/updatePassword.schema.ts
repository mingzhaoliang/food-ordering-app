import { z } from "zod";
import { passwordSchema } from "../auth/password.schema";

export const createPasswordSchema = z
  .object({
    currentPassword: z.undefined(),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, { message: "Please confirm your password." }),
  })
  .refine((data) => (data.confirmPassword ? data.newPassword === data.confirmPassword : true), {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "Please enter your current password." }),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, { message: "Please confirm your password." }),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from the current password.",
    path: ["newPassword"],
  })
  .refine((data) => (data.confirmPassword ? data.newPassword === data.confirmPassword : true), {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type CreatePasswordSchema = z.infer<typeof createPasswordSchema>;
type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

export type UpdatePasswordSchema<hasCurrentPassword> = hasCurrentPassword extends true
  ? ChangePasswordSchema
  : CreatePasswordSchema;
