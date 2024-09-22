import { signupSchema } from "@/schemas/zod/auth/signup.schema";
import { redirect } from "next/navigation";

export const signUp = (prevState: any, formData: FormData) => {
  const data = Object.fromEntries(formData);
  const validatedFields = signupSchema.safeParse(data);

  if (!validatedFields.success) {
    return Promise.resolve({ errors: validatedFields.error.flatten().fieldErrors });
  }

  if (validatedFields.data.email === "exist@email.com") {
    return Promise.resolve({
      errors: {
        email: ["An account with this email already exists."],
      },
    });
  }

  redirect("/auth/email-verification");
};
