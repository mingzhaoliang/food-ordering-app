"use client";

import { updatePasswordAction } from "@/actions/my/user.action";
import withActionStateReset from "@/components/hoc/withActionStateReset";
import FormActions from "@/components/ui/form/form-actions";
import FormInputField from "@/components/ui/form/form-input-field";
import { InfoHoverCard } from "@/components/ui/info-hover-card";
import { Form } from "@/components/ui/shadcn/form";
import { useToast } from "@/components/ui/shadcn/use-toast";
import VisibilityIcon from "@/components/ui/visibility-icon";
import {
  changePasswordSchema,
  createPasswordSchema,
  UpdatePasswordSchema,
} from "@/schemas/zod/my/updatePassword.schema";
import { ActionState } from "@/types/ActionState";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const UpdatePassword = withActionStateReset(
  ({ hasCurrentPassword, onReset }: { hasCurrentPassword: boolean; onReset: () => void }) => {
    const schema = hasCurrentPassword ? changePasswordSchema : createPasswordSchema;
    const defaultValues = {
      newPassword: "",
      confirmPassword: "",
      ...(hasCurrentPassword && { currentPassword: "" }),
    };
    const title = hasCurrentPassword ? "Change password" : "Create password";

    const { toast } = useToast();
    const [passwordVisible, setPasswordVisible] = useState<{
      currentPassword: boolean;
      newPassword: boolean;
      confirmPassword: boolean;
    }>({
      currentPassword: false,
      newPassword: false,
      confirmPassword: false,
    });

    const form = useForm<z.infer<typeof schema>>({
      resolver: zodResolver(schema),
      defaultValues,
    });

    const { isDirty } = form.formState;

    const [actionState, formAction, pending] = useActionState<
      ActionState<UpdatePasswordSchema<typeof hasCurrentPassword>>,
      FormData
    >(updatePasswordAction.bind(null, hasCurrentPassword), { errors: null });

    const onCancelConfirm = () => {
      form.reset();
      onReset();
    };

    const togglePasswordVisibility = (field: "currentPassword" | "newPassword" | "confirmPassword") => {
      setPasswordVisible((prevState) => ({
        ...prevState,
        [field]: !prevState[field],
      }));
    };

    useEffect(() => {
      if (!isDirty) {
        form.reset();
      }

      if (actionState?.message) {
        if (actionState.message === "success") {
          onReset();
          toast({
            title: "Password updated!",
            description: "Your password has been updated successfully.",
          });
        } else {
          toast({
            title: "Something went wrong!",
            description: actionState.message,
          });
        }
      }
    }, [isDirty, actionState, onReset, form, toast]);

    return (
      <Form {...form}>
        <form action={formAction} className="max-lg:space-y-2 space-y-4">
          <div className="max-lg:space-y-2 space-y-4">
            <h4 className="heading-4">{title}</h4>
            <div className="flex flex-col gap-y-1">
              {hasCurrentPassword && (
                <FormInputField
                  type={passwordVisible.currentPassword ? "text" : "password"}
                  name="currentPassword"
                  label="Current password"
                  placeholder="Current password"
                  icon={
                    form.getFieldState("currentPassword").isDirty && (
                      <VisibilityIcon
                        visible={passwordVisible.currentPassword}
                        onClick={togglePasswordVisibility.bind(null, "currentPassword")}
                      />
                    )
                  }
                  errorMessages={actionState?.errors?.currentPassword}
                  hideLabel
                />
              )}
              <FormInputField
                type={passwordVisible.newPassword ? "text" : "password"}
                name="newPassword"
                label="New password"
                placeholder="New password"
                icon={
                  form.getFieldState("newPassword").isDirty ? (
                    <VisibilityIcon
                      visible={passwordVisible.newPassword}
                      onClick={togglePasswordVisibility.bind(null, "newPassword")}
                    />
                  ) : (
                    <InfoHoverCard
                      cardContent={{
                        children:
                          "At least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
                      }}
                    />
                  )
                }
                errorMessages={actionState?.errors?.newPassword}
                hideLabel
              />
              <FormInputField
                type={passwordVisible.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                label="Confirm password"
                placeholder="Confirm new password"
                icon={
                  form.getFieldState("confirmPassword").isDirty && (
                    <VisibilityIcon
                      visible={passwordVisible.confirmPassword}
                      onClick={togglePasswordVisibility.bind(null, "confirmPassword")}
                    />
                  )
                }
                errorMessages={actionState?.errors?.confirmPassword}
                hideLabel
              />
            </div>
          </div>
          {isDirty && <FormActions pending={pending} onCancelConfirm={onCancelConfirm} />}
        </form>
      </Form>
    );
  }
);

export default UpdatePassword;
