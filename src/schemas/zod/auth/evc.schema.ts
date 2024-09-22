import { z } from "zod";

export const evcSchema = z.object({
  evc: z.string().min(6, {
    message: "Your email verification code must be 6 alphanumeric characters.",
  }),
});

export type EvcSchema = z.infer<typeof evcSchema>;
