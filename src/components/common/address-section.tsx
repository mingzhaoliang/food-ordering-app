"use client";

import FormAutocomplete, { AutocompleteOption } from "@/components/ui/form/form-autocomplete";
import FormInputField from "@/components/ui/form/form-input-field";
import FormSelectField from "@/components/ui/form/form-select-field";
import { useLocationSuggestions } from "@/lib/hooks/useLocationSuggestions";
import { AU_STATES } from "@/lib/utils/constants";
import { ActionState } from "@/types/ActionState";
import { AutocompleteLocation } from "@/types/AutocompleteLocation";
import { useFormContext } from "react-hook-form";

interface AddressSectionProps {
  className?: string;
  actionState: ActionState<any>;
  popoverContainer?: Element | null;
  required?: boolean;
}

export default function AddressSection({ className, actionState, popoverContainer, required }: AddressSectionProps) {
  const { getFieldState, setValue, watch } = useFormContext();

  const { suggestions, loading } = useLocationSuggestions(
    getFieldState("street").isDirty ? watch("street") ?? "" : "",
    500
  );

  const onSelectLocation = (value: AutocompleteOption) => {
    const location = value as AutocompleteLocation & AutocompleteOption;
    const street = [location.address.name, location.address.house_number, location.address.road]
      .filter(Boolean)
      .join(", ");

    setValue("street", street);

    setValue("city", location.address.city ?? "");

    if (location.address.state && AU_STATES.includes(location.address.state as (typeof AU_STATES)[number])) {
      setValue("state", location.address.state);
    } else {
      setValue("state", "");
    }

    setValue("postcode", location.address.postcode ?? "");
  };

  return (
    <div className={className}>
      <FormAutocomplete
        name="street"
        label="Street"
        placeholder="Street"
        errorMessages={actionState?.errors?.street}
        options={suggestions}
        loading={loading}
        onSelectOption={onSelectLocation}
        disableFilter
        container={popoverContainer}
        required={required}
      />
      <FormInputField
        name="city"
        label="City/Suburb"
        placeholder="City/Suburb"
        errorMessages={actionState?.errors?.city}
        required={required}
      />
      <FormSelectField
        name="state"
        label="State"
        placeholder="Select a state"
        options={AU_STATES.map((state) => ({
          label: state,
          value: state,
        }))}
        errorMessages={actionState?.errors?.state}
        container={popoverContainer}
        required={required}
      />
      <FormInputField
        name="postcode"
        label="Postcode"
        placeholder="Postcode"
        errorMessages={actionState?.errors?.postcode}
        required={required}
      />
    </div>
  );
}
