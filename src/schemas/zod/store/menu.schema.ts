import { z } from "zod";
import { imageSchema } from "../cloudinary/image.schema";

const singleCheckboxSchema = z
  .string()
  .refine((value) => value === "true" || value === "false", {
    message: "Value must be a boolean",
  })
  .transform((value) => value === "true");

export const menuSchema = z
  .object({
    course: z.string().min(1, "Please select a course."),
    name: z
      .string()
      .min(3, "Dish name must be at least 3 characters long.")
      .refine((val) => val.toLowerCase() !== "add", {
        message: "Dish name cannot be 'add'.",
      }),
    description: z.string(),
    price: z.coerce.number().min(0, "Price must be a positive number."),
    customisation: z.object({
      addOns: z
        .array(
          z.object({
            name: z.string().min(3, "Add on name must be at least 3 characters long."),
            price: z.coerce.number().min(0, "Price must be a positive number."),
          })
        )
        .default([]),
      specialInstructions: z.boolean().default(false),
    }),
    specialDiets: z.array(z.string()),
    onlineAvailable: singleCheckboxSchema,
    featured: singleCheckboxSchema,
    popular: singleCheckboxSchema,
    image: imageSchema,
    imageFile: z.instanceof(File),
  })
  .superRefine((val, ctx) => {
    // Provided imageUrl indicates that an existing image has already been uploaded
    // If not provided, imageFile must be provided
    if (!val.image?.publicId) {
      if (!val.imageFile || val.imageFile?.size === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please upload an image.",
          path: ["imageFile"],
        });
      }

      // Rest of the validations are handled by dropzone
    }
  });

export type MenuSchema = z.infer<typeof menuSchema>;
