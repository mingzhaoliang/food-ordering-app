"use client";

import manageCheckout from "@/actions/orderFlow/manageCheckout";
import AddressSection from "@/components/common/address-section";
import CartSummary from "@/components/orderFlow/cart/cart-summary";
import FormInputField from "@/components/ui/form/form-input-field";
import FormTextarea from "@/components/ui/form/form-textarea";
import { Button } from "@/components/ui/shadcn/button";
import { Form } from "@/components/ui/shadcn/form";
import { Separator } from "@/components/ui/shadcn/separator";
import { useToast } from "@/components/ui/shadcn/use-toast";
import { checkoutDetailsSchema, CheckoutDetailsSchema } from "@/schemas/zod/orderFlow/checkout-details.schema";
import { ActionState } from "@/types/ActionState";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface CheckoutFormProps {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  postcode: string;
  subtotal: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
}

export default function CheckoutForm({
  firstName,
  lastName,
  email,
  phoneNumber,
  street,
  city,
  state,
  postcode,
  subtotal,
  deliveryFee,
  freeDeliveryThreshold,
}: CheckoutFormProps) {
  const { toast } = useToast();
  const [containerRef, setContainerRef] = useState<HTMLFormElement | null>(null);
  const form = useForm<CheckoutDetailsSchema>({
    resolver: zodResolver(checkoutDetailsSchema),
    defaultValues: {
      name: `${firstName} ${lastName}`,
      email,
      phoneNumber,
      street,
      city,
      state: state as any,
      postcode,
      instructions: "",
    },
  });

  const [actionState, formAction, pending] = useActionState<ActionState<CheckoutDetailsSchema>, FormData>(
    manageCheckout,
    null
  );

  const submitHandler = async (formData: FormData) => {
    if (form.getValues("state") === ("" as any)) {
      formData.set("state", "");
    }

    formAction(formData);
  };

  useEffect(() => {
    if (actionState?.message && actionState.message !== "success") {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: actionState.message,
      });
    }
  }, [actionState?.message, toast]);

  return (
    <Form {...form}>
      <form ref={setContainerRef} action={submitHandler} className="flex-1 flex flex-col gap-y-2 lg:gap-y-4 bg-inherit">
        <div className="flex-1">
          <div className="grid sm:grid-cols-2 gap-x-2 sm:gap-x-4 sm:gap-y-1">
            <FormInputField
              name="name"
              label="Name"
              placeholder="Name"
              errorMessages={actionState?.errors?.name}
              required
            />
            <FormInputField
              type="tel"
              name="phoneNumber"
              label="Phone number"
              placeholder="Phone number"
              errorMessages={actionState?.errors?.phoneNumber}
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
          <AddressSection
            className="grid sm:grid-cols-2 gap-x-2 sm:gap-x-4 sm:gap-y-1"
            actionState={actionState}
            popoverContainer={containerRef}
            required
          />
          <FormTextarea
            name="instructions"
            label="Delivery instructions"
            placeholder="Delivery instructions"
            errorMessages={actionState?.errors?.instructions}
          />
        </div>
        <div className="sticky z-40 pb-4 bottom-0 bg-inherit">
          <Separator className="mb-3" />
          <CartSummary subtotal={subtotal} deliveryFee={deliveryFee} freeDeliveryThreshold={freeDeliveryThreshold} />
          <Separator className="my-3" />
          <Button disabled={pending} type="submit" className="w-fit float-end">
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
}
