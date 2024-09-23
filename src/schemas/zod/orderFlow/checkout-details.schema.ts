import { AU_STATES } from "@/lib/utils/constants";
import parsePhoneNumberFromString from "libphonenumber-js";
import isPostalCode from "validator/es/lib/isPostalCode";
import { z } from "zod";

const checkoutDetailsSchema = z.object({
  name: z.string().trim().min(2, { message: "Please enter at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phoneNumber: z.string().transform((value, context) => {
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
  }),
  street: z.string().trim().min(2, { message: "Please enter at least 2 characters." }),
  city: z.string().trim().min(2, { message: "Please enter at least 2 characters." }),
  state: z.enum(AU_STATES, {
    message: "Please select a valid state.",
  }),
  postcode: z.string().refine((value) => isPostalCode(value, "AU"), {
    message: "Please enter a valid postcode.",
  }),
  instructions: z.string().max(140, { message: "Instructions must be less than 140 characters." }).default(""),
});

type CheckoutDetailsSchema = z.infer<typeof checkoutDetailsSchema>;

export { checkoutDetailsSchema, type CheckoutDetailsSchema };
