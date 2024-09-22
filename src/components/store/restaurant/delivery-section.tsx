"use client";

import FormInputField from "@/components/ui/form/form-input-field";
import { RestaurantSchema } from "@/schemas/zod/store/restaurant.schema";
import { ActionState } from "@/types/ActionState";

interface DeliverySectionProps {
  actionState: ActionState<RestaurantSchema>;
}

export default function DeliverySection({ actionState }: DeliverySectionProps) {
  return (
    <div>
      <h4 className="heading-4 mb-2 lg:mb-4">Delivery</h4>
      <div className="grid sm:grid-cols-2 gap-x-4">
        <FormInputField
          type="number"
          name="deliveryFee"
          label="Delivery fee"
          placeholder="Delivery fee"
          errorMessages={actionState?.errors?.deliveryFee}
          required
        />
        <FormInputField
          type="number"
          name="freeDeliveryThreshold"
          label="Free delivery threshold"
          placeholder="Free delivery threshold"
          errorMessages={actionState?.errors?.freeDeliveryThreshold}
        />
        <FormInputField
          type="number"
          name="estimatedDeliveryTime"
          label="Estimated delivery time (minutes)"
          placeholder="Estimated delivery time"
          errorMessages={actionState?.errors?.estimatedDeliveryTime}
        />
      </div>
    </div>
  );
}
