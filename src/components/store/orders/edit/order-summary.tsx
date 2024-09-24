import { Separator } from "@/components/ui/shadcn/separator";
import { priceFormatter } from "@/lib/utils/formatter";
import { OrderDTO } from "@/services/mongoose/store/order.dal";
import ConfirmOrderButton from "../items/confirm-order-button";
import CancelOrderButton from "./cancel-order-button";

interface OrderSummaryProps {
  order: OrderDTO;
}

export default function OrderSummary({ order }: OrderSummaryProps) {
  const { isPaid, deliveryInfo, items, subtotal, deliveryFee, total } = order;
  const awaitingConfirmation = isPaid && deliveryInfo.status === "pending";

  return (
    <div className="border border-stone-200 rounded-2xl p-4 space-y-4">
      <h4 className="heading-4">Summary</h4>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.dishId} className="flex justify-between">
            <p>{item.name}</p>
            <p>{priceFormatter(item.total)}</p>
          </div>
        ))}
        <Separator />
        <div className="flex justify-between">
          <p className="font-medium">Subtotal</p>
          <p>{priceFormatter(subtotal)}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium">Delivery Fee</p>
          <p>{priceFormatter(deliveryFee)}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium">Total</p>
          <p>{priceFormatter(total)}</p>
        </div>
      </div>
      {awaitingConfirmation && (
        <div className="flex justify-end gap-2">
          <CancelOrderButton orderId={order._id} />
          <ConfirmOrderButton orderId={order._id} />
        </div>
      )}
    </div>
  );
}
