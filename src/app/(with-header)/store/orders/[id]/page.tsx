import OrderItem from "@/components/my/orders/order-item";
import OrderInfo from "@/components/store/orders/edit/order-info";
import OrderSummary from "@/components/store/orders/edit/order-summary";
import BackButton from "@/components/ui/back-button";
import { Badge } from "@/components/ui/shadcn/badge";
import { getOrderStatusBadgeVariant } from "@/config/order-status-config";
import { validateRequest } from "@/lib/lucia/auth";
import { getOrder } from "@/services/mongoose/store/order.dal";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const { user } = await validateRequest();
  if (!user || !["admin", "superadmin"].includes(user.role)) redirect("/auth");

  const { id } = params;
  const order = await getOrder(id);
  const badgeVariant = getOrderStatusBadgeVariant(order.orderStatus);

  return (
    <div className="relative h-full bg-white rounded-3xl space-y-4 overflow-auto">
      <div className="sticky p-6 pb-0 z-40 top-0 bg-white/90 backdrop-blur">
        <div className="flex gap-4">
          <BackButton variant="secondary" size="icon">
            <ArrowLeft className="size-icon-1" />
          </BackButton>
          <div>
            <h3 className="heading-3">Order Detail</h3>
            <div className="flex items-center gap-2">
              <p className="body-3 text-fade">{`#${id}`}</p>
              <Badge variant={badgeVariant}>{order.orderStatus}</Badge>
            </div>
          </div>
        </div>
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
