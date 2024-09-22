import { cn } from "@/lib/utils/cn";
import { CheckboxProps } from "@radix-ui/react-checkbox";
import { useFormContext } from "react-hook-form";
import { Checkbox } from "../shadcn/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "../shadcn/form";

export interface CheckboxItem {
  label: string;
  value: string;
}

interface FormCheckboxProps<T extends CheckboxItem> extends Omit<CheckboxProps, "checked" | "onCheckedChange"> {
  name: string;
  label?: string;
  items: T | T[];
  description?: string;
  optionDescription?: string;
  isVertical?: boolean;
  isSingle?: boolean;
}

export default function FormCheckbox<T extends CheckboxItem>({
  name,
  label,
  items,
  description,
  optionDescription,
  isVertical,
  ...props
}: FormCheckboxProps<T>) {
  const { control } = useFormContext();
  const isSingle = !Array.isArray(items);
  const itemList = isSingle ? [items] : items;

  return (
    <FormField
      control={control}
      name={name}
      render={({}) => (
        <FormItem>
          <div className="mb-4">
            <FormLabel className="lg:text-base text-stone-500">{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
          <div className={cn("flex flex-wrap gap-4", isVertical ? "flex-col" : "")}>
            {itemList.map((item) => (
              <FormField
                key={item.value}
                control={control}
                name={name}
                render={({ field }) => (
                  <FormItem key={item.value} className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={isSingle ? field.value : field.value?.includes(item.value)}
                        onCheckedChange={
                          isSingle
                            ? field.onChange
                            : (checked) =>
                                checked
                                  ? field.onChange([...field.value, item.value])
                                  : field.onChange(field.value?.filter((value: any) => value !== item.value))
                        }
                        {...props}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className={cn(isSingle ? "" : "font-normal")}>{item.label}</FormLabel>
                      <FormDescription>{optionDescription}</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </FormItem>
      )}
    />
  );
}
