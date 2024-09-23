import { Button } from "@/components/ui/shadcn/button";
import { priceFormatter } from "@/lib/utils/formatter";
import { Truck } from "lucide-react";
import Link from "next/link";

interface CartSummaryProps {
  subtotal: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
}

export default function CartSummary({ subtotal, deliveryFee, freeDeliveryThreshold }: CartSummaryProps) {
  const total = subtotal + deliveryFee;

  return (
    <div className="flex flex-col gap-1 body-2">
      <div className="text-xs sm:text-sm mb-2">
        <Truck className="inline-block size-icon-1 mr-1" />
        {deliveryFee > 0 && (
          <div className="inline-block">
            Spend {priceFormatter(freeDeliveryThreshold - subtotal)} more to get FREE delivery.{" "}
            <span>
              <Button variant="link" className="!p-0 !h-fit text-xs sm:text-sm" asChild>
                <Link href="/menu">Order more.</Link>
              </Button>
            </span>
          </div>
        )}
        {!deliveryFee && freeDeliveryThreshold && "Your order qualifies for free delivery!"}
      </div>
      <SummaryItem title="Subtotal" value={priceFormatter(subtotal)} />
      <SummaryItem title="Delivery fee" value={deliveryFee ? priceFormatter(deliveryFee) : "Free"} />
      <SummaryItem title="Total" value={priceFormatter(total)} />
    </div>
  );
}

const SummaryItem = ({ title, value }: { title: string; value: string }) => (
  <div className="flex justify-between">
    <p className="font-medium">{title}</p>
    <p>{value}</p>
  </div>
);
