import FormTextarea from "@/components/ui/form/form-textarea";
import ImageUploader from "@/components/ui/image-uploader";
import { cloudinaryUrl } from "@/lib/utils/cloudinary";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/lib/utils/constants";
import shimmerPlaceholder from "@/lib/utils/shimmerPlaceholder";
import { MenuSchema } from "@/schemas/zod/store/menu.schema";
import { ActionState } from "@/types/ActionState";
import { CloudinaryIdentifier } from "@/types/CloudinaryIdentifier";
import Image from "next/image";
import { useFormContext } from "react-hook-form";

interface AdditionalInfoSectionProps {
  actionState: ActionState<MenuSchema>;
  imagePublicId: string | undefined;
}

export default function AdditionalInfoSection({ actionState, imagePublicId }: AdditionalInfoSectionProps) {
  const { getValues } = useFormContext();

  return (
    <div className="mt-6 col-span-2 grid 2xl:grid-cols-2 gap-x-4">
      <FormTextarea name="description" label="Description" className="h-[calc(100%-4rem)] rounded-2xl lg:text-base" />
      <ImageUploader
        name="imageFile"
        label="Image"
        maxSize={MAX_FILE_SIZE}
        acceptedImageTypes={ACCEPTED_IMAGE_TYPES}
        errorMessages={actionState?.errors?.imageFile}
        imageAreaConfig={{
          className: "rounded-3xl w-full max-2xl:w-fit h-40 sm:h-48 lg:h-56 2xl:h-fit aspect-[4/3]",
          defaultImage: imagePublicId ? (
            <Image
              src={cloudinaryUrl(getValues("image") as CloudinaryIdentifier)}
              alt="Dish image"
              fill
              sizes="(max-width: 640px) 100vw, 25vw"
              className="object-cover"
              placeholder={shimmerPlaceholder(640, 480)}
            />
          ) : null,
        }}
      />
    </div>
  );
}
