"use client";

import FormInputField from "@/components/ui/form/form-input-field";
import ImageUploader from "@/components/ui/image-uploader";
import { Button } from "@/components/ui/shadcn/button";
import { WarningTrigger } from "@/components/ui/warning-trigger";
import { cloudinaryUrl } from "@/lib/utils/cloudinary";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/lib/utils/constants";
import { CategorySchema, RestaurantSchema } from "@/schemas/zod/store/restaurant.schema";
import { ActionState } from "@/types/ActionState";
import { CloudinaryIdentifier } from "@/types/CloudinaryIdentifier";
import { X } from "lucide-react";
import Image from "next/image";
import { useFormContext } from "react-hook-form";

interface CategoryItemInputProps {
  actionState: ActionState<RestaurantSchema>;
  index: number;
  name: keyof RestaurantSchema;
  warningMessage?: string;
  remove: () => void;
}

export default function CategoryItemInput({
  actionState,
  index,
  name,
  warningMessage,
  remove,
}: CategoryItemInputProps) {
  const { getValues } = useFormContext();

  const existingImage = getValues(`${name}.${index}.image`) as CategorySchema["image"];

  return (
    <div className="relative grid grid-cols-[1fr_1fr_auto] gap-4">
      <FormInputField
        name={`${name}.${index}.name`}
        label="Name"
        placeholder={`${name
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())
          .replace(/s$/, "")} name`}
        errorMessages={actionState?.errors?.[name]?.[index]?.name}
      />
      <ImageUploader
        name={`${name}.${index}.imageFile`}
        label="Icon"
        maxSize={MAX_FILE_SIZE}
        acceptedImageTypes={ACCEPTED_IMAGE_TYPES}
        errorMessages={actionState?.errors?.[name]?.[index]?.imageFile}
        imageAreaConfig={{
          className: "rounded-3xl w-fit h-10 sm:h-12",
          defaultImage: existingImage.publicId ? (
            <Image
              src={cloudinaryUrl(existingImage as CloudinaryIdentifier)}
              alt="Icon"
              fill
              sizes="(max-width: 640px) 25vw, 5vw"
            />
          ) : null,
        }}
      />
      <WarningTrigger
        title={`Remove ${name
          .replace(/([A-Z])/g, " $1")
          .replace(/\b\w/g, (char) => char.toLowerCase())
          .replace(/s$/, "")}`}
        description={warningMessage || "Are you sure you want to remove it?"}
        continueConfig={{ onClick: remove }}
      >
        <Button type="button" variant="ghost" size="icon" className="self-center bg-stone-100 hover:bg-stone-200">
          <X className="size-icon-1" />
        </Button>
      </WarningTrigger>
    </div>
  );
}
