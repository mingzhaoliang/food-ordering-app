import CancelOrderButton from "@/components/store/orders/edit/cancel-order-button";
import { Button } from "@/components/ui/shadcn/button";
import { Separator } from "@/components/ui/shadcn/separator";
import { priceFormatter } from "@/lib/utils/formatter";
import { OrderDTO } from "@/services/mongoose/store/order.dal";
import Link from "next/link";

interface OrderSummaryProps {
  order: OrderDTO;
}

export default function OrderSummary({ order }: OrderSummaryProps) {
  return (
    <div className="border border-stone-200 rounded-2xl p-4 space-y-4">
      <h4 className="heading-4">Summary</h4>
      <div className="space-y-2">
        {order.items.map((item) => (
          <div key={item.dishId} className="flex justify-between">
            <p>{item.name}</p>
            <p>{priceFormatter(item.total)}</p>
          </div>
        ))}
        <Separator />
        <div className="flex justify-between">
          <p className="font-medium">Subtotal</p>
          <p>{priceFormatter(order.subtotal)}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium">Delivery Fee</p>
          <p>{priceFormatter(order.deliveryFee)}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium">Total</p>
          <p>{priceFormatter(order.total)}</p>
        </div>
      </div>
      <div className="flex justify-end">
        {order.isPaid && (
          <Button variant="outline" className="!h-fit" asChild>
            <Link href={order.paymentResult?.receiptUrl || ""} rel="noreferrer" target="_blank">
              Receipt
            </Link>
          </Button>
        )}
        {order.orderStatus === "unpaid" && <CancelOrderButton orderId={order._id} />}
      </div>
    </div>
  );
}
