import { AU_STATES } from "@/lib/utils/constants";
import parsePhoneNumberFromString from "libphonenumber-js";
import isPostalCode from "validator/es/lib/isPostalCode";
import { z } from "zod";
import { imageSchema } from "../cloudinary/image.schema";

const categorySchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters long."),
    image: imageSchema,
    imageFile: z.instanceof(File),
  })
  .superRefine((val, ctx) => {
    // Provided imageUrl indicates that an existing image has already been uploaded. Otherwise, imageFile must be provided
    if (!val.image.publicId) {
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

export const restaurantSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long."),
  contactNumber: z.string().transform((value, context) => {
    const parsedPhoneNumber = parsePhoneNumberFromString(value, {
      defaultCountry: "AU",
      extract: false,
    });

    if (parsedPhoneNumber && parsedPhoneNumber.isValid()) {
      return parsedPhoneNumber.number.toString();
    }

    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please enter a valid contact number (include the international prefix).",
    });

    return z.NEVER;
  }),
  email: z.string().email("Please enter a valid email address."),
  street: z.string().trim().min(2, { message: "Please enter at least 2 characters." }),
  city: z.string().trim().min(2, { message: "Please enter at least 2 characters." }),
  state: z.enum(AU_STATES, { message: "Please select a valid state." }),
  postcode: z.string().refine((value) => isPostalCode(value, "AU"), {
    message: "Please enter a valid postcode.",
  }),
  courses: z.array(categorySchema),
  specialDiets: z.array(categorySchema),
  deliveryFee: z.coerce.number().min(0, { message: "Please enter a valid delivery fee." }),
  freeDeliveryThreshold: z.coerce
    .number()
    .min(0, { message: "Please enter a valid free delivery threshold." })
    .optional(),
  estimatedDeliveryTime: z.coerce
    .number()
    .min(0, { message: "Please enter a valid estimated delivery time in minutes." })
    .optional(),
});

export type CategorySchema = z.infer<typeof categorySchema>;
export type RestaurantSchema = z.infer<typeof restaurantSchema>;
