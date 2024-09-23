"use client";

import { deleteCartItemAction } from "@/actions/orderFlow/cart.action";
import { useToast } from "@/components/ui/shadcn/use-toast";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";

interface DeleteCartItemButtonProps {
  cartItemId: string;
  onDelete: (id: string) => void;
  onOptimisticDelete: (action: { type: "delete"; payload: { cartItemId: string } }) => void;
}

export default function DeleteCartItemButton({ cartItemId, onDelete, onOptimisticDelete }: DeleteCartItemButtonProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const deleteHandler = () => {
    startTransition(async () => {
      onOptimisticDelete({ type: "delete", payload: { cartItemId } });
      const { message } = await deleteCartItemAction(cartItemId);

      if (message !== "success") {
        toast({
          variant: "destructive",
          title: message,
        });
      } else {
        onDelete(cartItemId);
      }
    });
  };

  return (
    <button disabled={isPending} onClick={deleteHandler}>
      <Trash2 className="size-icon-1 text-fade hover:text-destructive" />
    </button>
  );
}
