import { evcSchema } from "@/schemas/zod/auth/evc.schema";
import { redirect } from "next/navigation";

export const verifyEvc = async (prevState: any, formData: FormData) => {
  const data = Object.fromEntries(formData);
  const validatedFields = evcSchema.safeParse(data);

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  if (validatedFields.data.evc !== "123456") {
    return { errors: { evc: ["Invalid email verification code."] } };
  }

  redirect("/");
};
