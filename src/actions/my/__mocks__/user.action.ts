import {
  changePasswordSchema,
  createPasswordSchema,
  UpdatePasswordSchema,
} from "@/schemas/zod/my/updatePassword.schema";
import { ActionState } from "@/types/ActionState";

const updatePasswordAction = async (
  hasCurrentPassword: boolean,
  prevState: ActionState<UpdatePasswordSchema<typeof hasCurrentPassword>>,
  data: FormData
) => {
  const formData = Object.fromEntries(data);
  let newPassword;

  if (hasCurrentPassword) {
    const validatedFields = changePasswordSchema.safeParse(formData);
    if (!validatedFields.success) {
      return Promise.resolve({ errors: validatedFields.error.flatten().fieldErrors });
    }

    if (validatedFields.data.currentPassword !== "123") {
      return Promise.resolve({ errors: { currentPassword: ["Invalid password."] } });
    }

    newPassword = validatedFields.data.newPassword;
  } else {
    const validatedFields = createPasswordSchema.safeParse(formData);
    if (!validatedFields.success) {
      return Promise.resolve({ errors: validatedFields.error.flatten().fieldErrors });
    }

    newPassword = validatedFields.data.newPassword;
  }

  return Promise.resolve({ message: "success" });
};

export { updatePasswordAction };
