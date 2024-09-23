"use client";

import { Button } from "@/components/ui/shadcn/button";
import { Separator } from "@/components/ui/shadcn/separator";
import { CartDTO } from "@/services/mongoose/orderFlow/cart.dal";
import { produce } from "immer";
import Link from "next/link";
import { useCallback, useOptimistic } from "react";
import { useImmer } from "use-immer";
import CartItem from "./cart-item";
import CartSummary from "./cart-summary";

interface CartProps extends CartDTO {
  isIntercepted?: boolean;
}

export default function Cart({ items, deliveryFee, freeDeliveryThreshold, isIntercepted }: CartProps) {
  const [cartItems, setCartItems] = useImmer<CartDTO["items"]>(items);

  const [optimisticItems, setOptimisticItems] = useOptimistic(
    cartItems.map((item) => ({ ...item, addOns: item.addOns.map((addOn) => ({ ...addOn })) })),
    (
      state: CartDTO["items"],
      action: { type: "update" | "delete"; payload: { cartItemId: string; quantity?: number } }
    ) =>
      produce(state, (draft) => {
        switch (action.type) {
          case "update": {
            const item = draft.find((item) => item._id === action.payload.cartItemId);
            item!.quantity = action.payload.quantity!;
            item!.total = (item!.price + item!.addOns.reduce((acc, addOn) => acc + addOn.price, 0)) * item!.quantity;
            break;
          }
          case "delete": {
            const index = draft.findIndex((item) => item._id === action.payload.cartItemId);
            if (index === -1) return;
            draft.splice(index, 1);
            break;
          }
        }
      })
  );

  const subtotal = optimisticItems.reduce((acc, item) => acc + item.total, 0);

  const handleQuantityChange = useCallback(
    (cartItemId: string, quantity: number, isDelta?: boolean) => {
      setCartItems((draft) => {
        const item = draft.find((item) => item._id === cartItemId);
        item!.quantity = isDelta ? item!.quantity + quantity : quantity;
        item!.total = item!.price * item!.quantity;
      });
    },
    [setCartItems]
  );

  const handleDelete = useCallback(
    (cartItemId: string) => {
      setCartItems((draft) => {
        const index = draft.findIndex((item) => item._id === cartItemId);
        if (index === -1) return;
        draft.splice(index, 1);
      });
    },
    [setCartItems]
  );

  return (
    <>
      <div className="my-3 flex-1">
        {optimisticItems.map((item, index) => (
          <div key={item._id}>
            {index > 0 && <Separator className="my-3" />}
            <CartItem
              {...item}
              cartItemId={item._id}
              onQuantityChange={handleQuantityChange}
              onItemDelete={handleDelete}
              onOptimisticChange={setOptimisticItems}
            />
          </div>
        ))}
      </div>
      <div className="sticky z-40 pb-4 bottom-0 bg-inherit">
        <Separator className="mb-3" />
        <CartSummary subtotal={subtotal} deliveryFee={deliveryFee} freeDeliveryThreshold={freeDeliveryThreshold} />
        <Separator className="my-3" />
        <Button className="w-fit float-end" asChild>
          <Link href={isIntercepted ? "/cart/checkout" : "/my/cart/checkout"} scroll={false}>
            Checkout
          </Link>
        </Button>
      </div>
    </>
  );
}
