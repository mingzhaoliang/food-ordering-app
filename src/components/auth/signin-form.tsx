"use client";

import { signIn } from "@/actions/auth/signIn";
import { SigninSchema, signinSchema } from "@/schemas/zod/auth/signin.schema";
import { ActionState } from "@/types/ActionState";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/shadcn/button";
import { Form } from "../ui/shadcn/form";
import VisibilityIcon from "../ui/visibility-icon";
import FormInputField from "../ui/form/form-input-field";

export default function SigninForm({ callbackUrl }: { callbackUrl: string }) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const form = useForm<SigninSchema>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [state, formAction, pending] = useActionState<ActionState<SigninSchema>, FormData>(
    signIn.bind(null, callbackUrl),
    {
      errors: null,
    }
  );

  return (
    <Form {...form}>
      <form role="form" action={formAction} className="font-lato flex flex-col w-full gap-1">
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
            form.getFieldState("password").isDirty && (
              <VisibilityIcon visible={passwordVisible} onClick={() => setPasswordVisible((prevState) => !prevState)} />
            )
          }
          errorMessages={state?.errors?.password}
          required
          className="xs:h-12 pr-10"
          hideLabel
        />
        <Button type="submit" disabled={pending} variant="default-active" className="mt-2">
          Sign in
        </Button>
      </form>
    </Form>
  );
}
