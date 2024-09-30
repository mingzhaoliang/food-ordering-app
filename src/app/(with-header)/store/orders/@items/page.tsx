import DatePickerFilter from "@/components/store/date-picker-filter";
import DropdownFilter from "@/components/store/dropdown-filter";
import OrderOverview from "@/components/store/orders/items/order-overview";
import AutoPagination from "@/components/ui/auto-pagination";
import { Separator } from "@/components/ui/shadcn/separator";
import { validateRequest } from "@/lib/lucia/auth";
import { deliveryStatusEnum, DeliveryStatusEnum, OrderStatusEnum } from "@/schemas/mongoose/order/order.model";
import { getStoreOrders } from "@/services/mongoose/store/order.dal";
import { redirect } from "next/navigation";

export interface OrderSearchParams {
  status?: string;
  page?: string;
  id?: string;
  date?: string; // timestamp
}

export default async function Page({ searchParams }: { searchParams: OrderSearchParams }) {
  const { user } = await validateRequest();

  if (!user) redirect("/auth");
  if (!["admin", "superadmin", "demo"].includes(user.role)) redirect("/");

  const { status, page, date: timestamp } = searchParams;

  const queryPage = +(page ?? 1) || 1;
  const createdAt = timestamp === "all" ? undefined : timestamp ? new Date(+timestamp) : new Date();

  const filter = {
    ...getStatusFilter(status),
    createdAt,
  };

  const { orders, currentPage, totalPages } = await getStoreOrders({ ...filter, page: queryPage });

  return (
    <div className="min-h-full mb-4 bg-white rounded-3xl p-6 flex flex-col gap-y-4">
      <h3 className="heading-3">Orders</h3>
      <div className="grid lg:grid-cols-2 gap-4">
        <DropdownFilter
          label="Status"
          items={deliveryStatusEnum as any}
          queryKey="status"
          searchParams={searchParams}
          basePath="/store/orders"
          urlExcludedParams="page"
        />
        <DatePickerFilter searchParams={searchParams} basePath="/store/orders" urlExcludedParams="page" />
      </div>
      <div className="flex-1">
        {orders.map((order, index) => (
          <div key={order._id}>
            {!!index && <Separator className="my-2" />}
            <OrderOverview order={order} searchParams={searchParams} />
          </div>
        ))}
        {orders.length === 0 && <p className="text-center">No order is placed yet.</p>}
      </div>
      <AutoPagination searchParams={searchParams} currentPage={currentPage} maxPage={totalPages} hideNavigationText />
    </div>
  );
}

const getStatusFilter = (
  status: string | undefined
):
  | {
      deliveryStatus?: DeliveryStatusEnum;
      orderStatus?: OrderStatusEnum;
    }
  | {} => {
  if (!status) return {};

  const filters: Record<string, { deliveryStatus?: DeliveryStatusEnum; orderStatus?: OrderStatusEnum } | {}> = {
    all: {},
    pending: {
      deliveryStatus: "pending",
      orderStatus: "paid",
    },
    preparing: {
      deliveryStatus: "preparing",
      orderStatus: "paid",
    },
    "out-for-delivery": {
      deliveryStatus: "out-for-delivery",
      orderStatus: "paid",
    },
    delivered: {
      deliveryStatus: "delivered",
      orderStatus: "paid",
    },
    cancelled: {
      $or: [{ deliveryStatus: "cancelled" }, { orderStatus: "cancelled" }],
    },
  };
  return filters[status];
};
