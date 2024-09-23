import Card from "@/components/ui/card";
import { Badge } from "@/components/ui/shadcn/badge";
import { shortPriceFormatter } from "@/lib/utils/formatter";
import shimmerPlaceholder from "@/lib/utils/shimmerPlaceholder";
import Image from "next/image";
import { memo } from "react";
import CartItemQuantity from "./cart-item-quantity";
import DeleteCartItemButton from "./delete-cart-item-button";

interface CartItemProps {
  cartItemId: string;
  name: string;
  course: string;
  price: number;
  addOns: { name: string; price: number }[];
  specialInstructions: string;
  total: number;
  imageUrl: string;
  quantity: number;
  onQuantityChange: (id: string, quantity: number, isDelta?: boolean) => void;
  onItemDelete: (id: string) => void;
  onOptimisticChange: (action: {
    type: "update" | "delete";
    payload: { cartItemId: string; quantity?: number };
  }) => void;
}

const CartItem = memo(function CartItem({
  cartItemId,
  name,
  course,
  price,
  addOns,
  specialInstructions,
  total,
  imageUrl,
  quantity,
  onQuantityChange,
  onItemDelete,
  onOptimisticChange,
}: CartItemProps) {
  const totalPrice = addOns.reduce((acc, { price }) => acc + price, 0) + price;
  return (
    <Card
      variant="horizontal"
      thumbnail={
        <Image
          src={imageUrl}
          alt={name}
          draggable={false}
          fill
          sizes="25vw"
          placeholder={shimmerPlaceholder(250, 250)}
        />
      }
      description={
        <div className="self-start">
          {addOns.length > 0 && (
            <p className="text-nowrap text-ellipsis overflow-hidden">
              <span className="font-medium">Add ons:</span> {addOns.map(({ name }) => name).join(", ")}
            </p>
          )}
          {specialInstructions && (
            <p className="text-nowrap text-ellipsis overflow-hidden">
              <span className="font-medium">Special instructions:</span> {specialInstructions}
            </p>
          )}
        </div>
      }
      tags={
        <div>
          <Badge variant="secondary">{course.toUpperCase()}</Badge>
        </div>
      }
      title={name}
      price={total}
      button={
        <div className="w-full flex justify-between">
          <p className="body-3">{shortPriceFormatter(totalPrice)}</p>
          <div className="relative flex items-end gap-2">
            <DeleteCartItemButton
              cartItemId={cartItemId}
              onDelete={onItemDelete}
              onOptimisticDelete={onOptimisticChange}
            />
            <CartItemQuantity
              cartItemId={cartItemId}
              quantity={quantity}
              onChange={onQuantityChange}
              onOptimisticChange={onOptimisticChange}
            />
          </div>
        </div>
      }
    />
  );
});

export default CartItem;
