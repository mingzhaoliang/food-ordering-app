import DeliveryStatus from "@/components/my/orders/delivery-status";
import OrderItem from "@/components/my/orders/order-item";
import OrderSummary from "@/components/my/orders/order-summary";
import BackButton from "@/components/ui/back-button";
import { Badge } from "@/components/ui/shadcn/badge";
import { getOrderStatusBadgeVariant } from "@/config/order-status-config";
import { validateRequest } from "@/lib/lucia/auth";
import { getOrder } from "@/services/mongoose/store/order.dal";
import { ArrowLeft } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page({
  params,
  searchParams,
}: {
  params: { orderId: string };
  searchParams: { token?: string };
}) {
  const { user } = await validateRequest();
  if (!user && !cookies().get("guestSessionId")?.value) redirect("/");

  const { orderId } = params;
  const { token } = searchParams;

  const order = await getOrder(orderId, token);
  const badgeVariant = getOrderStatusBadgeVariant(order.orderStatus);

  return (
    <div className="bg-white rounded-3xl max-sm:p-6 p-8 space-y-4 lg:space-y-6">
      <div className="flex gap-4">
        <BackButton variant="secondary" size="icon">
          <ArrowLeft className="size-icon-1" />
        </BackButton>
        <div>
          <h3 className="heading-3">Order Detail</h3>
          <div className="flex items-center gap-2">
            <p className="body-3 text-fade">{`#${orderId}`}</p>
            <Badge variant={badgeVariant}>{order.orderStatus}</Badge>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          {order.items.map((item) => (
            <OrderItem key={item.dishId} {...item} />
          ))}
        </div>
        <div className="space-y-4">
          {!["cancelled", "unpaid"].includes(order.orderStatus) && <DeliveryStatus order={order} />}
          <OrderSummary order={order} />
        </div>
      </div>
    </div>
  );
}
