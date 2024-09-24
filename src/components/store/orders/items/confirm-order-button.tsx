"use client";

import { updateDeliveryStatusAction } from "@/actions/store/order.action";
import { Button } from "@/components/ui/shadcn/button";

interface ConfirmOrderButtonProps {
  orderId: string;
}

export default function ConfirmOrderButton({ orderId }: ConfirmOrderButtonProps) {
  const clickHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await updateDeliveryStatusAction(orderId, "preparing");
  };

  return (
    <Button className="!h-fit" onClick={clickHandler}>
      Confirm
    </Button>
  );
}
