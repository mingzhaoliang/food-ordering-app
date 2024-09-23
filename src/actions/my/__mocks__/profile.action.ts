import { avatarSchema, AvatarSchema } from "@/schemas/zod/my/avatar.schema";
import { profileSchema, ProfileSchema } from "@/schemas/zod/my/profile.schema";
import { ActionState } from "@/types/ActionState";

const updateProfileAction = async (
  prevState: ActionState<ProfileSchema>,
  formData: FormData
): Promise<ActionState<ProfileSchema>> => {
  const data = Object.fromEntries(formData);
  const validatedFields = profileSchema.safeParse(data);

  if (!validatedFields.success) {
    return Promise.resolve({ errors: validatedFields.error.flatten().fieldErrors });
  }

  return Promise.resolve({ message: "success" });
};

const deleteAddressAction = async () => {
  return Promise.resolve({ message: "success" });
};

const updateAvatarAction = async (prevState: ActionState<AvatarSchema>, formData: FormData) => {
  const data = Object.fromEntries(formData);

  const validatedFields = avatarSchema.safeParse(data);

  if (!validatedFields.success) {
    return Promise.resolve({ errors: validatedFields.error.flatten().fieldErrors });
  }

  return Promise.resolve({ message: "success" });
};

export { deleteAddressAction, updateAvatarAction, updateProfileAction };
