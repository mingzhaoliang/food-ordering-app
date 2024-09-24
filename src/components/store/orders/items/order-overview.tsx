import { OrderSearchParams } from "@/app/(with-header)/store/orders/@items/page";
import Card from "@/components/ui/card";
import ImageStack from "@/components/ui/image-stack";
import { Badge } from "@/components/ui/shadcn/badge";
import {
  getDeliveryStatus,
  getDeliveryStatusBadgeVariant,
  getOrderStatus,
  getOrderStatusBadgeVariant,
} from "@/config/order-status-config";
import { cn } from "@/lib/utils/cn";
import { OrderOverviewDTO } from "@/services/mongoose/store/order.dal";
import ParallelLink from "../../parallel-link";
import ConfirmOrderButton from "./confirm-order-button";

interface OrderOverviewProps {
  order: OrderOverviewDTO;
  searchParams: OrderSearchParams;
}

export default function OrderOverview({ order, searchParams }: OrderOverviewProps) {
  const names = order.items.map((item) => item.name);
  const imageUrls = order.items.map((item) => item.imageUrl);
  const { _id: orderId, isPaid, deliveryStatus, orderStatus } = order;

  const badgeVariant =
    isPaid && deliveryStatus !== "pending"
      ? getDeliveryStatusBadgeVariant(deliveryStatus)
      : getOrderStatusBadgeVariant(orderStatus);
  const { label } =
    isPaid && deliveryStatus !== "pending" ? getDeliveryStatus(deliveryStatus) : getOrderStatus(orderStatus);

  const awaitingConfirmation = isPaid && deliveryStatus === "pending";

  return (
    <ParallelLink basePath="/store/orders" searchParams={searchParams} targetQueryParams={{ id: orderId }}>
      <Card
        key={orderId}
        variant="horizontal"
        title={names.join(", ")}
        description={
          <p className="self-start text-xs text-fade text-ellipsis text-nowrap overflow-hidden">{`Order #${orderId}`}</p>
        }
        thumbnail={<ImageStack imageUrls={imageUrls} names={names} />}
        price={order.total}
        button={
          <div className="w-full flex justify-between items-end">
            <Badge variant={badgeVariant} className="h-fit">
              {label}
            </Badge>
            {awaitingConfirmation && <ConfirmOrderButton orderId={orderId} />}
          </div>
        }
        className={cn(
          "rounded-2xl p-1.5 pr-2 transition-colors",
          searchParams.id === orderId ? "bg-secondary/50" : "hover:bg-stone-50/50"
        )}
      />
    </ParallelLink>
  );
}
