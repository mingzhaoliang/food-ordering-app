import { z } from "zod";
import { passwordSchema } from "./password.schema";

export const signupSchema = z.object({
  firstName: z.string().trim().min(2, { message: "Please enter at least 2 characters." }),
  lastName: z.string().trim().min(2, { message: "Please enter at least 2 characters." }).optional().or(z.literal("")),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: passwordSchema,
});

export type SignupSchema = z.infer<typeof signupSchema>;
