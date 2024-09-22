"use client";

import { Button } from "@/components/ui/shadcn/button";
import { FormField, FormItem } from "@/components/ui/shadcn/form";
import { cloudinaryIdentifier } from "@/lib/utils/cloudinary";
import { RestaurantSchema } from "@/schemas/zod/store/restaurant.schema";
import { ActionState } from "@/types/ActionState";
import { useFieldArray, useFormContext } from "react-hook-form";
import CategoryItemInput from "./category-item-input";

interface CategorySectionProps {
  actionState: ActionState<RestaurantSchema>;
  name: keyof RestaurantSchema;
  warningMessage?: string;
}

export default function CategorySection({ actionState, name, warningMessage }: CategorySectionProps) {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div>
      <h4 className="heading-4 mb-2 lg:mb-4">
        {name.replace(/([A-Z])/g, " $1").replace(/\b\w/g, (char) => char.toUpperCase())}
      </h4>
      <FormField
        control={control}
        name={name}
        render={() => (
          <FormItem className="grid sm:grid-cols-2 gap-x-8">
            {fields.map((field, index) => (
              <CategoryItemInput
                key={field.id}
                actionState={actionState}
                index={index}
                name={name}
                warningMessage={warningMessage}
                remove={() => remove(index)}
              />
            ))}
          </FormItem>
        )}
      />
      <Button
        type="button"
        onClick={() =>
          append({
            name: "",
            image: cloudinaryIdentifier(),
            imageFile: new File([""], "filename"),
          })
        }
      >
        Add a new{" "}
        {name
          .replace(/([A-Z])/g, " $1")
          .replace(/\b\w/g, (char) => char.toLowerCase())
          .replace(/s$/, "")}
      </Button>
    </div>
  );
}
