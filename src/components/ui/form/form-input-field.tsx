import withCommonFormField from "@/components/hoc/withCommonFormField";
import dynamic from "next/dynamic";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { FormControl } from "../shadcn/form";
import { InputProps } from "../shadcn/input";
import { PhoneInputProps } from "../shadcn/phone-input";

const PhoneInput = dynamic(() => import("../shadcn/phone-input").then((mod) => mod.PhoneInput));
const Input = dynamic(() => import("../shadcn/input").then((mod) => mod.Input));

type InputFieldProps = InputProps &
  PhoneInputProps & {
    field: ControllerRenderProps<FieldValues, string>;
    icon?: React.ReactNode;
  };

const FormInputField = withCommonFormField(({ field, icon, ...props }: InputFieldProps) => {
  const InputComp = props.type === "tel" ? PhoneInput : Input;

  return (
    <FormControl>
      <div className="relative flex items-center">
        <div className="flex-1">
          <InputComp
            data-testid={field.name}
            id={field.name}
            {...field}
            {...props}
            onWheel={props.type === "number" ? (e) => e.currentTarget.blur() : undefined}
          />
        </div>
        {icon && <div className="absolute right-4">{icon}</div>}
      </div>
    </FormControl>
  );
});

export default FormInputField;
