"use client";

import { signOut } from "@/actions/auth/signOut";
import { Button } from "@/components/ui/shadcn/button";
import { WarningTrigger } from "@/components/ui/warning-trigger";
import { useRef } from "react";

export default function SignoutForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const onSignOutConfirm = () => {
    formRef.current?.requestSubmit();
  };

  return (
    <form ref={formRef} action={signOut} className="mt-4 flex justify-end">
      <WarningTrigger
        title="Are you sure to sign out?"
        description="You will be signed out from your account."
        continueConfig={{ onClick: onSignOutConfirm }}
      >
        <Button type="button" variant="outline">
          Sign out
        </Button>
      </WarningTrigger>
    </form>
  );
}
