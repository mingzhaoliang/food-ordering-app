import FormCheckbox from "@/components/ui/form/form-checkbox";
import FormInputField from "@/components/ui/form/form-input-field";
import { Button } from "@/components/ui/shadcn/button";
import { FormField, FormItem, FormLabel } from "@/components/ui/shadcn/form";
import { WarningTrigger } from "@/components/ui/warning-trigger";
import { MenuSchema } from "@/schemas/zod/store/menu.schema";
import { ActionState } from "@/types/ActionState";
import { X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

interface CustomisationSectionProps {
  actionState: ActionState<MenuSchema>;
}

const CustomisationSection = ({ actionState }: CustomisationSectionProps) => {
  const name = "customisation.addOns";
  const { control, getValues } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="mt-4 space-y-6">
      <div>
        <FormLabel className="mb-4 lg:text-base text-stone-500" asChild>
          <p>Add ons</p>
        </FormLabel>
        <FormField
          control={control}
          name={name}
          render={() => (
            <FormItem className="">
              {fields.map((field, index) => (
                <div key={field.id} className="relative grid grid-cols-[2fr_1fr_auto] items-start gap-4">
                  <FormInputField
                    name={`${name}.${index}.name`}
                    label="Add on name"
                    placeholder="Add on name"
                    errorMessages={(actionState?.errors?.customisation as any)?.addOns?.[index]?.name}
                    hideLabel
                  />
                  <FormInputField
                    type="number"
                    name={`${name}.${index}.price`}
                    label="Add on name"
                    placeholder="Add on name"
                    hideLabel
                  />
                  <WarningTrigger
                    title={`Remove add on`}
                    description="Are you sure you want to remove this add on?"
                    continueConfig={{ onClick: () => remove(index) }}
                  >
                    <Button type="button" variant="ghost" size="icon" className=" bg-stone-100 hover:bg-stone-200">
                      <X className="size-icon-1" />
                    </Button>
                  </WarningTrigger>
                </div>
              ))}
            </FormItem>
          )}
        />
        <Button
          type="button"
          onClick={() =>
            append({
              name: "",
              price: 0,
            })
          }
        >
          New add on
        </Button>
      </div>
      <FormCheckbox
        key={"specialInstructions" + getValues("customisation.specialInstructions").toString()}
        name="customisation.specialInstructions"
        items={{
          label: "Special instructions",
          value: "special-instructions",
        }}
      />
    </div>
  );
};

export default CustomisationSection;
