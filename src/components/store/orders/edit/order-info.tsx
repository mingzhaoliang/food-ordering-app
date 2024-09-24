import { Badge } from "@/components/ui/shadcn/badge";
import { Separator } from "@/components/ui/shadcn/separator";
import { getDeliveryStatus, getDeliveryStatusBadgeVariant } from "@/config/order-status-config";
import { datetimeFormatter } from "@/lib/utils/formatter";
import { OrderDTO } from "@/services/mongoose/store/order.dal";
import DeliveryStatusSelect from "./delivery-status-select";

interface OrderInfoProps {
  order: OrderDTO;
}

export default function OrderInfo({ order }: OrderInfoProps) {
  const badgeVariant = getDeliveryStatusBadgeVariant(order.deliveryInfo.status);
  let { label } = getDeliveryStatus(order.deliveryInfo.status);

  const deliveryStatus = order.deliveryInfo.status;

  const { street, city } = order.deliveryAddress;
  const deliveryAddress = `${street}, ${city}`;

  return (
    <div className="border border-stone-200 rounded-2xl p-4 space-y-4">
      <div className="flex justify-between">
        <h4 className="heading-4">Details</h4>
        {order.orderStatus !== "unpaid" &&
          (["cancelled", "delivered"].includes(deliveryStatus) ? (
            <Badge variant={badgeVariant} className="!h-fit">
              {label}
            </Badge>
          ) : (
            <DeliveryStatusSelect key={deliveryStatus} orderId={order._id} currentStatus={deliveryStatus} />
          ))}
      </div>
      <Separator />
      <div className="space-y-2">
        <OrderInfoItem label="Customer name" value={order.deliveryInfo.deliveryPerson.name} />
        <OrderInfoItem label="Delivery Address" value={deliveryAddress} />
        <OrderInfoItem label="Ordered at" value={datetimeFormatter(order.createdAt)} />
        {order.paymentResult?.paidAt && (
          <OrderInfoItem label="Paid at" value={datetimeFormatter(order.paymentResult.paidAt)} />
        )}
        {order.deliveryInfo.actualDeliveryTime && (
          <OrderInfoItem label="Delivered at" value={datetimeFormatter(order.deliveryInfo.actualDeliveryTime)} />
        )}
      </div>
    </div>
  );
}

const OrderInfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <p className="font-medium">{label}</p>
    <p>{value}</p>
  </div>
);
