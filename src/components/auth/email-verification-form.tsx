"use client";

import { verifyEvc } from "@/actions/auth/verifyEvc";
import { Button } from "@/components/ui/shadcn/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/shadcn/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/shadcn/input-otp";
import { EvcSchema, evcSchema } from "@/schemas/zod/auth/evc.schema";
import { ActionState } from "@/types/ActionState";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useActionState, useRef } from "react";
import { useForm } from "react-hook-form";
import ResendButton from "./resend-button";

export default function EmailVerificationForm({ email }: { email: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<EvcSchema>({
    resolver: zodResolver(evcSchema),
    defaultValues: {
      evc: "",
    },
  });

  const [actionState, formAction, pending] = useActionState<ActionState<EvcSchema>, FormData>(verifyEvc, null);

  return (
    <Form {...form}>
      <form role="form" ref={formRef} action={formAction} className="space-y-8">
        <FormField
          control={form.control}
          name="evc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Verification Code</FormLabel>
              <FormControl>
                <InputOTP {...field} maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
                  {[...Array(6)].map((_, index) => (
                    <InputOTPGroup key={index}>
                      <InputOTPSlot index={index} />
                    </InputOTPGroup>
                  ))}
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the code sent to your email:
                <br />
                <span className="underline">{email}</span>
              </FormDescription>
              <FormMessage>{actionState?.errors?.evc ?? actionState?.message}</FormMessage>
            </FormItem>
          )}
        />
        <div className="space-x-3">
          <Button disabled={pending} type="submit" variant="default-active">
            Verify
          </Button>
          <ResendButton />
        </div>
      </form>
    </Form>
  );
}
