"use client";

import { updateAvatarAction } from "@/actions/my/profile.action";
import ImageUploader from "@/components/ui/image-uploader";
import { Button } from "@/components/ui/shadcn/button";
import { Form } from "@/components/ui/shadcn/form";
import { useToast } from "@/components/ui/shadcn/use-toast";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/lib/utils/constants";
import { avatarSchema, AvatarSchema } from "@/schemas/zod/my/avatar.schema";
import { ActionState } from "@/types/ActionState";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";

const AvatarUploadForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { toast } = useToast();

  const form = useForm<AvatarSchema>({
    resolver: zodResolver(avatarSchema),
    defaultValues: {
      avatar: new File([""], "filename"),
    },
  });

  const [actionState, formAction, pending] = useActionState<ActionState<AvatarSchema>, FormData>(
    updateAvatarAction,
    null
  );

  const submitHandler = async (formData: FormData) => {
    formData.append("avatar", form.getValues("avatar"));
    formAction(formData);
  };

  useEffect(() => {
    if (actionState?.message === "success") {
      toast({
        title: "Profile picture updated successfully!",
      });
      onSuccess();
    } else if (actionState?.message) {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: actionState.message,
      });
    }
  }, [actionState?.message, toast, onSuccess]);

  return (
    <Form {...form}>
      <form
        action={submitHandler}
        className="w-full flex-col-center gap-y-6 sm:gap-y-8 lg:gap-y-10 text-center text-balance"
      >
        <h3 className="heading-4">Update Avatar</h3>
        <ImageUploader
          name="avatar"
          maxSize={MAX_FILE_SIZE}
          acceptedImageTypes={ACCEPTED_IMAGE_TYPES}
          errorMessages={actionState?.errors?.avatar}
          required
          imageAreaConfig={{ className: "rounded-full mx-auto w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48" }}
        />
        <Button disabled={pending} type="submit" variant="default-active" className="w-2/3 sm:w-1/2">
          {pending ? (
            <>
              <Loader2 className="size-icon-1 animate-spin mr-1" />
              Uploading...
            </>
          ) : (
            "Upload"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AvatarUploadForm;
