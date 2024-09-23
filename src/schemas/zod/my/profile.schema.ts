import { AU_STATES } from "@/lib/utils/constants";
import parsePhoneNumberFromString from "libphonenumber-js";
import isPostalCode from "validator/es/lib/isPostalCode";
import { z } from "zod";

export const profileSchema = z
  .object({
    firstName: z.string().trim().min(2, { message: "Please enter at least 2 characters." }),
    lastName: z.string().trim().min(2, { message: "Please enter at least 2 characters." }).optional().or(z.literal("")),
    phoneNumber: z
      .string()
      .transform((value, context) => {
        const parsedPhoneNumber = parsePhoneNumberFromString(value, {
          defaultCountry: "AU",
          extract: false,
        });

        if (parsedPhoneNumber && parsedPhoneNumber.isValid()) {
          return parsedPhoneNumber.number.toString();
        }

        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a valid phone number (include the international prefix).",
        });

        return z.NEVER;
      })
      .optional()
      .or(z.literal("")),
    street: z.string().trim().min(2, { message: "Please enter at least 2 characters." }).optional().or(z.literal("")),
    city: z.string().trim().min(2, { message: "Please enter at least 2 characters." }).optional().or(z.literal("")),
    state: z
      .enum(AU_STATES, {
        message: "Please select a valid state.",
      })
      .optional()
      .or(z.literal("")),
    postcode: z
      .string()
      .refine((value) => isPostalCode(value, "AU"), {
        message: "Please enter a valid postcode.",
      })
      .optional()
      .or(z.literal("")),
  })
  .superRefine((val, ctx) => {
    const addressFields = {
      street: val.street,
      city: val.city,
      state: val.state,
      postcode: val.postcode,
    } as { [key: string]: string | undefined };

    if (Object.values(addressFields).some(Boolean)) {
      Object.keys(addressFields).forEach((fieldName) => {
        if (!addressFields[fieldName]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${fieldName[0].toUpperCase() + fieldName.slice(1)} must not be empty.`,
            path: [fieldName],
          });
        }
      });
    }
  });

export type ProfileSchema = z.infer<typeof profileSchema>;
