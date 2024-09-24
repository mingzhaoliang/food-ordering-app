import OrderOverview from "@/components/my/orders/order-overview";
import AutoPagination from "@/components/ui/auto-pagination";
import { Button } from "@/components/ui/shadcn/button";
import { Separator } from "@/components/ui/shadcn/separator";
import { validateRequest } from "@/lib/lucia/auth";
import { getOrders } from "@/services/mongoose/store/order.dal";
import { MoveRight } from "lucide-react";
import Link from "next/link";

export default async function Page({ searchParams }: { searchParams: { page?: string } }) {
  const { user } = await validateRequest();
  if (!user) {
    return (
      <div className="bg-white rounded-3xl max-sm:p-6 p-8 space-y-4 lg:space-y-6">
        <h3 className="heading-3">Orders</h3>
        <Separator className="my-2" />
        <Button variant="link" asChild>
          <Link href="/signin">Sign in to view your orders.</Link>
        </Button>
      </div>
    );
  }

  const { page } = searchParams;

  const queryPage = +(page ?? 1) || 1;
  const { orders, currentPage, totalPages } = await getOrders({ page: queryPage });

  return (
    <div className="bg-white rounded-3xl max-sm:p-6 p-8 space-y-4 lg:space-y-6">
      <h3 className="heading-3">Orders</h3>
      <div>
        {orders.map((order, index) => (
          <div key={order._id}>
            {!!index && <Separator className="my-2" />}
            <OrderOverview order={order} />
          </div>
        ))}
      </div>
      {orders.length === 0 && (
        <Button variant="link" asChild>
          <Link href="/menu">
            Place your first order now!
            <MoveRight className="ml-1 size-icon-1" />
          </Link>
        </Button>
      )}
      {orders.length > 0 && (
        <AutoPagination searchParams={searchParams} currentPage={currentPage} maxPage={totalPages} hideNavigationText />
      )}
    </div>
  );
}
