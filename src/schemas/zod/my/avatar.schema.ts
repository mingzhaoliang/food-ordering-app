import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/lib/utils/constants";
import { z } from "zod";

export const avatarSchema = z.object({
  avatar: z.instanceof(File).superRefine((val, ctx) => {
    if (val.size === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please upload an image.",
      });
    }
    if (val.size > MAX_FILE_SIZE) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please upload an image that is less than 3MB in size.",
      });
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(val.type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please upload an image of type JPEG, JPG, PNG, or WEBP.",
      });
    }
  }),
});

export type AvatarSchema = z.infer<typeof avatarSchema>;
