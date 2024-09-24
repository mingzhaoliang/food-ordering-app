import { BadgeProps } from "@/components/ui/shadcn/badge";
import { DeliveryStatusEnum, OrderStatusEnum } from "@/schemas/mongoose/order/order.model";

type OrderStatusInfo = {
  label: string;
  value: OrderStatusEnum;
};

type DeliveryStatusInfo = {
  label: string;
  value: DeliveryStatusEnum;
  progressValue: number;
};

const ORDER_STATUS: OrderStatusInfo[] = [
  { label: "Unpaid", value: "unpaid" },
  { label: "Paid", value: "paid" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Failed", value: "failed" },
];

const DELIVERY_STATUS: DeliveryStatusInfo[] = [
  { label: "Awaiting confirmation", value: "pending", progressValue: 0 },
  { label: "Preparing", value: "preparing", progressValue: 25 },
  { label: "Out for delivery", value: "out-for-delivery", progressValue: 50 },
  { label: "Delivered", value: "delivered", progressValue: 100 },
  { label: "Cancelled", value: "cancelled", progressValue: 0 },
];

const getOrderStatusBadgeVariant = (status: OrderStatusEnum | "delivered"): BadgeProps["variant"] => {
  const variants: Record<OrderStatusEnum | "delivered", BadgeProps["variant"]> = {
    delivered: "default",
    unpaid: "destructive",
    paid: "success",
    cancelled: "outline",
    failed: "destructive",
  };

  return variants[status] || "default";
};

const getDeliveryStatusBadgeVariant = (status: DeliveryStatusEnum): BadgeProps["variant"] => {
  const variants: Record<DeliveryStatusEnum, BadgeProps["variant"]> = {
    pending: "secondary",
    preparing: "secondary",
    "out-for-delivery": "default",
    delivered: "success",
    cancelled: "outline",
  };

  return variants[status] || "default";
};

const getOrderStatus = (status: OrderStatusEnum) =>
  ORDER_STATUS.find((statusInfo) => statusInfo.value === status) || ORDER_STATUS[0];

const getDeliveryStatus = (status: DeliveryStatusEnum) =>
  DELIVERY_STATUS.find((statusInfo) => statusInfo.value === status) || DELIVERY_STATUS[0];

export {
  DELIVERY_STATUS,
  getDeliveryStatus,
  getDeliveryStatusBadgeVariant,
  getOrderStatus,
  getOrderStatusBadgeVariant,
  ORDER_STATUS,
};
