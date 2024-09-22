"use client";

import FormCheckbox from "@/components/ui/form/form-checkbox";
import { FormLabel } from "@/components/ui/shadcn/form";
import { useFormContext } from "react-hook-form";

export default function FeaturesSection() {
  const { watch } = useFormContext();

  return (
    <div>
      <FormLabel className="lg:text-base text-stone-500" asChild>
        <p>Features</p>
      </FormLabel>
      <div className="self-center flex flex-wrap gap-x-4">
        <FormCheckbox
          key={"onlineAvailable" + watch("onlineAvailable").toString()}
          name="onlineAvailable"
          items={{
            label: "Online available",
            value: "online-available",
          }}
        />
        <FormCheckbox
          key={"featured" + watch("featured").toString()}
          name="featured"
          items={{
            label: "Featured",
            value: "featured",
          }}
        />
        <FormCheckbox
          key={"popular" + watch("popular").toString()}
          name="popular"
          items={{
            label: "Popular",
            value: "popular",
          }}
        />
      </div>
    </div>
  );
}
