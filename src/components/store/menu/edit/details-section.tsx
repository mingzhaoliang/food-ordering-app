import { CheckboxItem } from "@/components/ui/form/form-checkbox";
import FormInputField from "@/components/ui/form/form-input-field";
import FormSelectField from "@/components/ui/form/form-select-field";
import { MenuSchema } from "@/schemas/zod/store/menu.schema";
import { ActionState } from "@/types/ActionState";

interface DetailsSectionProps {
  actionState: ActionState<MenuSchema>;
  courses: CheckboxItem[];
}

export default function DetailsSection({ actionState, courses }: DetailsSectionProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-x-4">
      <FormInputField name="name" label="Name" placeholder="Dish name" errorMessages={actionState?.errors?.name} />
      <FormInputField
        name="price"
        label="Price"
        type="number"
        placeholder="Dish price"
        errorMessages={actionState?.errors?.price}
      />
      <FormSelectField
        name="course"
        label="Course"
        placeholder="Select a course"
        options={courses}
        errorMessages={actionState?.errors?.course}
      />
    </div>
  );
}
