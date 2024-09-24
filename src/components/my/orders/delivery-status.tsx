import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
import { Progress } from "@/components/ui/shadcn/progress";
import { Separator } from "@/components/ui/shadcn/separator";
import { getDeliveryStatus, getDeliveryStatusBadgeVariant } from "@/config/order-status-config";
import { datetimeFormatter } from "@/lib/utils/formatter";
import { OrderDTO } from "@/services/mongoose/store/order.dal";
import { MapPin, Truck } from "lucide-react";

interface DeliveryStatusProps {
  order: OrderDTO;
}

export default function DeliveryStatus({ order }: DeliveryStatusProps) {
  const badgeVariant = getDeliveryStatusBadgeVariant(order.deliveryInfo.status);
  let { label, progressValue } = getDeliveryStatus(order.deliveryInfo.status);

  const { actualDeliveryTime, expectedDeliveryTime } = order.deliveryInfo;
  const deliveryTime = actualDeliveryTime || expectedDeliveryTime;

  return (
    <div className="border border-stone-200 rounded-2xl p-4 space-y-4">
      <div className="flex justify-between">
        <h4 className="heading-4">Delivery</h4>
        <Badge variant={badgeVariant} className="!h-fit">
          {label}
        </Badge>
      </div>
      <Separator />
      {deliveryTime && (
        <div className="flex justify-between items-center">
          <p className="body-3">
            {order.deliveryInfo.status === "delivered" ? "Delivered on" : "Expected delivery on"}
          </p>
          <p className="body-3">{datetimeFormatter(deliveryTime)}</p>
        </div>
      )}
      <div className="flex justify-end">
        <Button disabled variant="outline" className="!opacity-100">
          <MapPin className="size-icon-1" />
          <p className="text-nowrap text-ellipsis overflow-hidden">{order.deliveryAddress.street}</p>
        </Button>
      </div>
      <div className="w-full">
        <Button
          disabled
          variant="outline"
          size="icon"
          className="!opacity-100"
          style={{
            marginLeft: `${progressValue - 3}%`,
          }}
        >
          <Truck className="size-icon-1" />
        </Button>
      </div>
      <Progress value={progressValue} />
    </div>
  );
}
