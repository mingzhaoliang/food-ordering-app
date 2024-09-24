"use client";

import { updateDeliveryStatusAction } from "@/actions/store/order.action";
import { Select, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/shadcn/select";
import { WarningTrigger } from "@/components/ui/warning-trigger";
import { DELIVERY_STATUS } from "@/config/order-status-config";
import { DeliveryStatusEnum } from "@/schemas/mongoose/order/order.model";
import { SelectContent } from "@radix-ui/react-select";
import { useState } from "react";

interface DeliveryStatusSelectProps {
  orderId: string;
  currentStatus: DeliveryStatusEnum;
}

export default function DeliveryStatusSelect({ orderId, currentStatus }: DeliveryStatusSelectProps) {
  const [status, setStatus] = useState<DeliveryStatusEnum>(currentStatus);
  const [dialogOpen, setDialogOpen] = useState(false);

  const statusChangeHandler = async (value: DeliveryStatusEnum) => {
    if (value === "delivered") {
      setDialogOpen(true);
      return;
    }

    await updateDeliveryStatusAction(orderId, value);
    setStatus(value);
  };

  const onWarningContinue = async () => {
    await updateDeliveryStatusAction(orderId, "delivered");
    setStatus("delivered");
    setDialogOpen(false);
  };

  return (
    <>
      <Select value={status} onValueChange={statusChangeHandler}>
        <SelectTrigger
          data-testid="status"
          className="rounded-full w-fit h-8 focus-visible:ring-offset-0 focus-visible:ring-0"
        >
          <SelectValue placeholder="Select delivery status" />
        </SelectTrigger>
        <SelectContent position="popper" className="bg-white border border-muted rounded-md">
          {DELIVERY_STATUS.map((statusInfo) => (
            <SelectItem key={statusInfo.value} value={statusInfo.value}>
              {statusInfo.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <WarningTrigger
        title="Mark this order as delivered?"
        description="You cannot change the status back once it's marked as delivered."
        rootConfig={{
          open: dialogOpen,
          onOpenChange: setDialogOpen,
        }}
        continueConfig={{ onClick: onWarningContinue }}
      />
    </>
  );
}
