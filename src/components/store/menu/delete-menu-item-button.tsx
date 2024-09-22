"use client";

import { deleteMenuItemAction } from "@/actions/store/menu.action";
import { Button, ButtonProps } from "@/components/ui/shadcn/button";
import { useToast } from "@/components/ui/shadcn/use-toast";
import { WarningTrigger } from "@/components/ui/warning-trigger";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

interface DeleteDishButtonProps {
  itemId?: string;
  buttonConfig: Omit<ButtonProps, "disabled" | "type"> & {
    children: React.ReactNode;
    pendingFallback?: React.ReactNode;
  };
  redirectBack?: boolean;
}

export default function DeleteMenuItemButton({ itemId, buttonConfig, redirectBack }: DeleteDishButtonProps) {
  const { pendingFallback, children, onClick, ...buttonProps } = buttonConfig;
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [openWarning, setOpenWarning] = useState(false);
  const [pending, setPending] = useState(false);

  let redirectUrl = "/store/menu";

  if (!redirectBack) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("id");

    const search = newSearchParams.toString();
    redirectUrl += search ? `?${search}` : "";
  }

  const deleteHandler = async () => {
    setPending(true);
    const result = await deleteMenuItemAction(itemId, redirectUrl);

    setPending(false);
    if (!result?.message) return;

    toast({
      variant: "destructive",
      title: "Something went wrong.",
      description: result.message,
    });
  };

  return (
    <WarningTrigger
      title={itemId ? "Remove dish" : "Cancel adding dish"}
      description={
        itemId ? "Are you sure you want to remove this dish?" : "Are you sure you want to cancel adding a new dish?"
      }
      rootConfig={{
        open: openWarning,
        onOpenChange: setOpenWarning,
      }}
      continueConfig={itemId ? { onClick: deleteHandler } : { redirectUrl }}
    >
      <Button
        disabled={pending}
        type="button"
        {...buttonProps}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onClick && onClick(e);
          setOpenWarning(true);
        }}
      >
        {pending ? pendingFallback : children}
      </Button>
    </WarningTrigger>
  );
}
