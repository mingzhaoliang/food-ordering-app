"use client";

import { deleteAddressAction } from "@/actions/my/profile.action";
import { Button } from "@/components/ui/shadcn/button";
import { useToast } from "@/components/ui/shadcn/use-toast";
import { WarningTrigger } from "@/components/ui/warning-trigger";
import { Trash2 } from "lucide-react";

const DeleteAddressButton = () => {
  const { toast } = useToast();

  const deleteAddress = async () => {
    const { message } = await deleteAddressAction();

    if (message === "success") {
      toast({
        title: "Delivery address deleted successfully!",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: message,
      });
    }
  };

  return (
    <WarningTrigger
      title="Are you sure you want to delete your delivery address?"
      description="This action cannot be undone."
      continueConfig={{ onClick: deleteAddress }}
    >
      <Button variant="plain" size="icon" className="bg-transparent shadow-none">
        <Trash2 className="size-icon-1 text-fade" />
      </Button>
    </WarningTrigger>
  );
};

export default DeleteAddressButton;
