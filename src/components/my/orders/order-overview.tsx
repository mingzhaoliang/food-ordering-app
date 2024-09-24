import Card from "@/components/ui/card";
import ImageStack from "@/components/ui/image-stack";
import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
import {
  getDeliveryStatus,
  getDeliveryStatusBadgeVariant,
  getOrderStatus,
  getOrderStatusBadgeVariant,
} from "@/config/order-status-config";
import { OrderOverviewDTO } from "@/services/mongoose/store/order.dal";
import { ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

const PayButton = dynamic(() => import("./pay-button"));
const ExpirationTimer = dynamic(() => import("./expiration-timer"), { ssr: false });

interface OrderOverviewProps {
  order: OrderOverviewDTO;
}

export default function OrderOverview({ order }: OrderOverviewProps) {
  const names = order.items.map((item) => item.name);
  const imageUrls = order.items.map((item) => item.imageUrl);
  const { isPaid, orderStatus, deliveryStatus } = order;
  const badgeVariant =
    isPaid && deliveryStatus !== "pending"
      ? getDeliveryStatusBadgeVariant(deliveryStatus)
      : getOrderStatusBadgeVariant(orderStatus);
  const { label } =
    isPaid && deliveryStatus !== "pending" ? getDeliveryStatus(deliveryStatus) : getOrderStatus(orderStatus);
  const unpaid = orderStatus === "unpaid";

  return (
    <Card
      key={order._id}
      variant="horizontal"
      title={names.join(", ")}
      description={
        <p className="self-start text-xs text-fade -mb-1 text-ellipsis text-nowrap overflow-hidden">{`Order #${order._id}`}</p>
      }
      thumbnail={<ImageStack imageUrls={imageUrls} names={names} />}
      price={order.total}
      button={
        <div className="w-full flex justify-between items-end">
          <div className="flex flex-wrap gap-1 sm:gap-2">
            <Badge variant={badgeVariant} className="h-fit">
              {label}
            </Badge>
            {unpaid && <ExpirationTimer expiresAt={order.expiresAt} />}
          </div>

          <div className="flex flex-col gap-2 items-end">
            {unpaid && <PayButton orderId={order._id} />}
            <Button variant="link" className="w-fit !h-fit p-0" asChild>
              <Link href={`/my/orders/${order._id}`}>
                <p>Details</p>
                <ChevronRight className="size-icon-1" />
              </Link>
            </Button>
          </div>
        </div>
      }
    />
  );
}
