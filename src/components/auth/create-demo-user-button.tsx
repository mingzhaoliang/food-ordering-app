"use client";

import { createDemoUser } from "@/actions/auth/createDemoUser";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import ClientPortal from "../common/client-portal";
import Modal from "../ui/modal";
import { Button } from "../ui/shadcn/button";
import { useToast } from "../ui/shadcn/use-toast";

interface CreateDemoUserButtonProps {
  callbackUrl: string;
}

const CreateDemoUserButton = ({ callbackUrl }: CreateDemoUserButtonProps) => {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    try {
      setPending(true);
      await createDemoUser(callbackUrl);
      setPending(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: error.message,
      });
    }
  };

  return (
    <>
      <Button variant="outline" onClick={handleClick}>
        Continue with a demo account
      </Button>
      <ClientPortal selector="#modal">
        <Modal disableEscape controlOpen open={pending}>
          <div className="p-8 flex items-center gap-2">
            <Loader2 className="size-icon-2 animate-spin" />
            <h2 className="heading-4">Creating your demo account...</h2>
          </div>
        </Modal>
      </ClientPortal>
    </>
  );
};

export default CreateDemoUserButton;
