"use client";

import { updateCartItemAction } from "@/actions/orderFlow/cart.action";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { useToast } from "@/components/ui/shadcn/use-toast";
import { cn } from "@/lib/utils/cn";
import { Minus, Plus } from "lucide-react";
import { useRef, useTransition } from "react";

interface CartItemQuantityProps {
  cartItemId: string;
  quantity: number;
  onChange: (id: string, quantity: number, isDelta?: boolean) => void;
  onOptimisticChange: (action: { type: "update"; payload: { cartItemId: string; quantity?: number } }) => void;
  className?: string;
}

const CartItemQuantity = ({ cartItemId, quantity, className, onChange, onOptimisticChange }: CartItemQuantityProps) => {
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [, startTransition] = useTransition();

  const scheduleUpdate = (value: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    return new Promise(() => {
      timeoutRef.current = setTimeout(async () => {
        const actionState = await updateCartItemAction(cartItemId, value);
        if (actionState?.message !== "success") {
          toast({
            variant: "destructive",
            title: actionState.message,
          });
        } else {
          onChange(cartItemId, value);
        }
        timeoutRef.current = null;
      }, 500);
    });
  };

  const handleUpdate = async (value: number, isDelta?: boolean) => {
    if (!isDelta && value < 1) return;
    startTransition(async () => {
      const newQuantity = isDelta ? quantity + value : value;
      onOptimisticChange({ type: "update", payload: { cartItemId, quantity: newQuantity } });
      await scheduleUpdate(newQuantity);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUpdate(+e.target.value);
  };
  const handleIncrement = handleUpdate.bind(null, 1, true);
  const handleDecrement = handleUpdate.bind(null, -1, true);

  return (
    <div className={cn("flex rounded-md overflow-hidden", className)}>
      <Button
        disabled={quantity <= 1}
        type="button"
        variant="secondary"
        size="icon"
        className="!w-8 !h-6 rounded-none"
        onClick={handleDecrement}
      >
        <Minus className="size-icon-1" />
      </Button>

      <Input
        id="quantity"
        type="number"
        min={1}
        value={quantity}
        onChange={handleChange}
        className="w-8 text-center rounded-none !h-6 !p-0 focus-visible:ring-offset-0 focus-visible:ring-0 no-arrows"
      />

      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="!w-8 !h-6 rounded-none"
        onClick={handleIncrement}
      >
        <Plus className="size-icon-1" />
      </Button>
    </div>
  );
};

export default CartItemQuantity;
