"use client";

import FormCheckbox, { CheckboxItem } from "@/components/ui/form/form-checkbox";
import { useFormContext } from "react-hook-form";

interface SpecialDietsSectionProps {
  specialDiets: CheckboxItem[];
}

export default function SpecialDietsSection({ specialDiets }: SpecialDietsSectionProps) {
  const { watch } = useFormContext();

  return (
    <div className="mt-4">
      <FormCheckbox
        key={JSON.stringify(watch("specialDiets"))}
        label="Special Diets"
        name="specialDiets"
        items={specialDiets}
      />
    </div>
  );
}
