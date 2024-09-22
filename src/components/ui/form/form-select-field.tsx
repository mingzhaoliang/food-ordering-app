import withCommonFormField from "@/components/hoc/withCommonFormField";
import { FormControl } from "@/components/ui/shadcn/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/shadcn/select";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

interface BasicSelectFieldProps {
  field: ControllerRenderProps<FieldValues, string>;
  placeholder: string;
  options: { label: string; value: string }[];
  container?: Element | null;
}

const FormSelectField = withCommonFormField(({ field, placeholder, options, container }: BasicSelectFieldProps) => {
  const { ref, ...rest } = field;

  return (
    <Select onValueChange={field.onChange} defaultValue={field.value ?? ""} {...rest}>
      <FormControl>
        <SelectTrigger data-testid={field.name} className="rounded-full xl:p-5 xl:text-base">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent container={container}>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});

export default FormSelectField;
