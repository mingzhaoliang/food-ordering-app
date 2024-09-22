"use client";

import AddressSection from "@/components/common/address-section";
import FormInputField from "@/components/ui/form/form-input-field";
import { RestaurantSchema } from "@/schemas/zod/store/restaurant.schema";
import { ActionState } from "@/types/ActionState";

interface DetailsSectionProps {
  actionState: ActionState<RestaurantSchema>;
}

export default function DetailsSection({ actionState }: DetailsSectionProps) {
  return (
    <div>
      <h4 className="heading-4 mb-2 lg:mb-4">Details</h4>
      <FormInputField name="name" label="Name" placeholder="Name" errorMessages={actionState?.errors?.name} required />
      <div className="grid sm:grid-cols-2 gap-x-4">
        <FormInputField
          type="tel"
          name="contactNumber"
          label="Contact number"
          placeholder="Contact number"
          errorMessages={actionState?.errors?.contactNumber}
          required
        />
        <FormInputField
          type="email"
          name="email"
          label="Email"
          placeholder="Email"
          errorMessages={actionState?.errors?.email}
          required
        />
      </div>
      <AddressSection className="grid sm:grid-cols-2 2xl:grid-cols-4 gap-x-4" actionState={actionState} required />
    </div>
  );
}
