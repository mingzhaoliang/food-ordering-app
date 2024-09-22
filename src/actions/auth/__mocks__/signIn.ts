import { signinSchema } from "@/schemas/zod/auth/signin.schema";
import { redirect } from "next/navigation";

export const signIn = (callbackUrl: string, prevState: any, formData: FormData) => {
  const data = Object.fromEntries(formData);
  const validatedFields = signinSchema.safeParse(data);

  if (!validatedFields.success) {
    console.log("Error validating fields: ", validatedFields.error.flatten().fieldErrors);
    return Promise.resolve({ errors: validatedFields.error.flatten().fieldErrors });
  }

  if (validatedFields.data.email !== "valid@email.com" && validatedFields.data.password !== "valid-password") {
    return Promise.resolve({
      errors: {
        email: ["Invalid email or password."],
        password: ["Invalid email or password."],
      },
    });
  }

  redirect(callbackUrl);
};
