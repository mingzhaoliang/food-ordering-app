import OrderItem from "@/components/my/orders/order-item";
import CloseButton from "@/components/store/orders/edit/close-button";
import OrderInfo from "@/components/store/orders/edit/order-info";
import OrderSummary from "@/components/store/orders/edit/order-summary";
import { Badge } from "@/components/ui/shadcn/badge";
import { getOrderStatusBadgeVariant } from "@/config/order-status-config";
import { validateRequest } from "@/lib/lucia/auth";
import { getOrder } from "@/services/mongoose/store/order.dal";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }: { searchParams: { id?: string } }) {
  const { id: orderId } = searchParams;
  if (!orderId) return null;

  const { user } = await validateRequest();
  if (!user || !["admin", "superadmin", "demo"].includes(user.role)) redirect("/");

  const order = await getOrder(orderId);
  const badgeVariant = getOrderStatusBadgeVariant(order.orderStatus);

  return (
    <div className="relative h-full bg-white rounded-3xl space-y-4 overflow-auto">
      <div className="sticky p-6 pb-0 z-40 top-0 bg-white/90 backdrop-blur">
        <h3 className="heading-3">Order Details</h3>
        <div className="flex items-center gap-2">
          <p className="body-3 text-fade">{`#${orderId}`}</p>
          <Badge variant={badgeVariant}>{order.orderStatus}</Badge>
        </div>
        <CloseButton className="absolute top-6 right-6" />
      </div>
      <div className="p-6 pt-0 grid 2xl:grid-cols-2 gap-6">
        <div className="space-y-2 max-2xl:row-start-2">
          {order.items.map((item) => (
            <OrderItem key={item.dishId} {...item} />
          ))}
        </div>
        <div className="space-y-4">
          <OrderInfo order={order} />
          <OrderSummary order={order} />
        </div>
      </div>
    </div>
  );
}
