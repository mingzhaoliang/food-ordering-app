import { cn } from "@/lib/utils/cn";
import { ImagePlus, ImageUp } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import { InfoHoverCard } from "./info-hover-card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./shadcn/form";

interface ImageUploaderProps {
  name: string;
  maxSize: number;
  acceptedImageTypes: string[];
  errorMessages?: string[];
  setFileRejections?: (rejections: FileRejection[]) => void;
  required?: boolean;
  label?: string;
  imageAreaConfig?: {
    className?: string;
    defaultImage?: React.ReactNode;
  };
}

export default function ImageUploader({
  name,
  maxSize,
  acceptedImageTypes,
  errorMessages,
  setFileRejections,
  required,
  label,
  imageAreaConfig,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | ArrayBuffer | null>("");

  const { control, setValue, clearErrors, resetField } = useFormContext();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const reader = new FileReader();

      try {
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(acceptedFiles[0]);

        setValue(name, acceptedFiles[0], { shouldDirty: true });
        clearErrors(name);
      } catch (error) {
        console.error(error);
        setPreview(null);
        resetField(name);
      }
    },
    [setValue, clearErrors, resetField, name]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections, inputRef } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: maxSize,
    accept: Object.fromEntries(new Map(acceptedImageTypes.map((type) => [type, []]))),
  });

  const uploadHandler = () => {
    inputRef.current?.click();
  };

  if (fileRejections.length > 0) {
    setFileRejections?.(fileRejections);
  }

  return (
    <FormField
      control={control}
      name={name}
      render={() => {
        return (
          <FormItem>
            {!!label && (
              <FormLabel
                className={cn(
                  "pl-1 lg:text-base text-stone-500",
                  required ? "after:content-['*'] after:ml-0.5 after:text-destructive" : ""
                )}
                htmlFor={name}
              >
                {label}
                <InfoHoverCard
                  cardContent={{
                    children: "Drag and drop an image or click the box to upload.",
                  }}
                  iconConfig={{ className: "inline-block ml-1 w-4 h-4" }}
                />
              </FormLabel>
            )}
            <div
              {...getRootProps({
                onClick: uploadHandler,
                className: cn(
                  "relative rounded-full overflow-hidden flex-center cursor-pointer",
                  "w-full h-full aspect-square",
                  !!preview || !!imageAreaConfig?.defaultImage ? "" : "border border-fade border-dashed",
                  imageAreaConfig?.className
                ),
              })}
            >
              {preview ? (
                <Image
                  src={preview as string}
                  alt={name}
                  fill
                  sizes="(max-width: 640px) 25vw, 5vw"
                  className="object-cover"
                />
              ) : (
                imageAreaConfig?.defaultImage ?? <ImagePlus className="text-fade" />
              )}
              {isDragActive && (
                <div className="absolute inset-0 bg-primary/40 flex-center">
                  <ImageUp className="text-white" />
                </div>
              )}
            </div>
            <FormControl>
              <input
                data-testid={name}
                {...getInputProps({
                  id: name,
                  name,
                  className: "hidden",
                  type: "file",
                })}
              />
            </FormControl>
            <FormMessage className="text-xs">
              {fileRejections.length > 0 ? (
                <span>
                  Image must be less than {(maxSize / 1024 / 1024).toFixed(0)}MB and of type PNG, JPG, JPEG, or WEBP.
                </span>
              ) : (
                errorMessages?.map((m) => (
                  <span key={m}>
                    {errorMessages.length > 1 ? <li role="alert">{m}</li> : <span role="alert">{m}</span>}
                  </span>
                )) ?? <span className="inline-block h-3" />
              )}
            </FormMessage>
          </FormItem>
        );
      }}
    />
  );
}
