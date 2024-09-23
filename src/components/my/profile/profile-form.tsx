"use client";

import { updateProfileAction } from "@/actions/my/profile.action";
import AddressSection from "@/components/common/address-section";
import withActionStateReset from "@/components/hoc/withActionStateReset";
import FormActions from "@/components/ui/form/form-actions";
import FormInputField from "@/components/ui/form/form-input-field";
import { Form } from "@/components/ui/shadcn/form";
import { useToast } from "@/components/ui/shadcn/use-toast";
import { ProfileSchema, profileSchema } from "@/schemas/zod/my/profile.schema";
import { ProfileDTO } from "@/services/mongoose/my/profile.dal";
import { ActionState } from "@/types/ActionState";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";

const DeleteAddressButton = dynamic(() => import("@/components/my/profile/delete-address-button"));

const ProfileForm = withActionStateReset(({ profile, onReset }: { profile: ProfileDTO; onReset: () => void }) => {
  const { toast } = useToast();

  const form = useForm<ProfileSchema>({
    mode: "onBlur",
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      phoneNumber: profile.phoneNumber ?? "",
      street: profile.street ?? "",
      city: profile.city ?? "",
      state: (profile.state as any) ?? "",
      postcode: profile.postcode ?? "",
    },
  });

  const { isDirty } = form.formState;
  const isEmptyAddress = !profile.street && !profile.city && !profile.state && !profile.postcode;

  const [actionState, formAction, pending] = useActionState<ActionState<ProfileSchema>, FormData>(updateProfileAction, {
    errors: null,
  });

  const onCancelConfirm = () => {
    form.reset();
    onReset();
  };

  const submitHandler = async (formData: FormData) => {
    if (form.getValues("state") === "") {
      formData.set("state", "");
    }

    formAction(formData);
  };

  useEffect(() => {
    if (!isDirty) {
      form.reset();
    }

    if (actionState?.message) {
      if (actionState.message === "success") {
        onReset();
        toast({
          title: "Profile updated!",
          description: "Your profile has been updated successfully.",
        });
      } else {
        toast({
          title: "Something went wrong.",
          description: actionState.message,
        });
      }
    }
  }, [isDirty, actionState, onReset, form, toast]);

  return (
    <Form {...form}>
      <form action={submitHandler} className="max-lg:space-y-2 space-y-4">
        <div className="max-lg:space-y-2 space-y-4">
          <h4 className="heading-4">Basic information</h4>
          <div className="grid max-sm:grid-cols-1 max-2xl:grid-cols-2 grid-cols-4 max-sm:gap-x-2 max-xl:gap-x-6 gap-x-8 gap-y-1">
            <FormInputField
              name="firstName"
              label="First name"
              placeholder="First name"
              errorMessages={actionState?.errors?.firstName}
              required
            />
            <FormInputField
              name="lastName"
              label="Last name"
              placeholder="Last name"
              errorMessages={actionState?.errors?.lastName}
            />
            <FormInputField
              type="tel"
              name="phoneNumber"
              label="Phone number"
              placeholder="Phone number"
              errorMessages={actionState?.errors?.phoneNumber}
            />
          </div>
        </div>
        <div className="max-lg:space-y-2 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h4 className="heading-4">Delivery address</h4>
              {!isEmptyAddress && <DeleteAddressButton />}
            </div>
            {isEmptyAddress && (
              <div className="text-sm w-full text-stone-500">
                You have not provided a delivery address yet. Add one now!
              </div>
            )}
          </div>
          <AddressSection
            className="grid max-sm:grid-cols-1 max-2xl:grid-cols-2 grid-cols-4 max-sm:gap-x-2 max-xl:gap-x-6 gap-x-8 gap-y-1"
            actionState={actionState}
          />
        </div>
        {isDirty && <FormActions pending={pending} onCancelConfirm={onCancelConfirm} />}
      </form>
    </Form>
  );
});

export default ProfileForm;
