import withCommonFormField from "@/components/hoc/withCommonFormField";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { FormControl } from "../shadcn/form";
import { Textarea, TextareaProps } from "../shadcn/textarea";

interface BasicFormTextareaProps extends TextareaProps {
  field: ControllerRenderProps<FieldValues, string>;
}

const FormTextarea = withCommonFormField(({ field, ...props }: BasicFormTextareaProps) => {
  return (
    <FormControl>
      <Textarea data-testid={field.name} id={field.name} {...field} {...props} />
    </FormControl>
  );
});

export default FormTextarea;
