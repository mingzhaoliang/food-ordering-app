"use client";

import { signUp } from "@/actions/auth/signUp";
import { Form } from "@/components/ui/shadcn/form";
import { signupSchema, SignupSchema } from "@/schemas/zod/auth/signup.schema";
import { ActionState } from "@/types/ActionState";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useState } from "react";
import { useForm } from "react-hook-form";
import FormInputField from "../ui/form/form-input-field";
import { InfoHoverCard } from "../ui/info-hover-card";
import { Button } from "../ui/shadcn/button";
import VisibilityIcon from "../ui/visibility-icon";

export default function SignupForm() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const [state, formAction, pending] = useActionState<ActionState<SignupSchema>, FormData>(signUp, {
    errors: null,
  });

  return (
    <Form {...form}>
      <form role="form" action={formAction} className="font-lato flex flex-col w-full gap-1">
        <div className="grid max-lg:grid-cols-1 grid-cols-2 gap-x-4 gap-y-1">
          <FormInputField
            name="firstName"
            label="First name"
            placeholder="First name"
            errorMessages={state?.errors?.firstName}
            required
            className="xs:h-12"
            hideLabel
          />
          <FormInputField
            name="lastName"
            label="Last name"
            placeholder="Last name (optional)"
            errorMessages={state?.errors?.lastName}
            className="xs:h-12"
            hideLabel
          />
        </div>
        <FormInputField
          type="email"
          name="email"
          label="Email"
          placeholder="Email"
          errorMessages={state?.errors?.email}
          required
          className="xs:h-12"
          hideLabel
        />
        <FormInputField
          type={passwordVisible ? "text" : "password"}
          name="password"
          label="Password"
          placeholder="Password"
          icon={
            form.getFieldState("password").isDirty ? (
              <VisibilityIcon visible={passwordVisible} onClick={() => setPasswordVisible((prevState) => !prevState)} />
            ) : (
              <InfoHoverCard
                cardContent={{
                  children:
                    "At least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
                }}
              />
            )
          }
          errorMessages={state?.errors?.password}
          required
          className="xs:h-12"
          hideLabel
        />
        <Button type="submit" disabled={pending} variant="default-active" className="xs:h-12 mt-2 xl:text-base">
          Sign up
        </Button>
      </form>
    </Form>
  );
}
