import { z } from "zod";

const cartItemSchema = z.object({
  quantity: z.coerce.number().min(1, "Quantity must be at least 1").default(1),
  addOns: z.array(z.string()).default([]),
  specialInstructions: z.string().default(""),
});

type CartItemSchema = z.infer<typeof cartItemSchema>;

export { cartItemSchema, type CartItemSchema };
