import { z } from "zod";

export const signinSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string(),
});

export type SigninSchema = z.infer<typeof signinSchema>;
