import Card from "@/components/ui/card";
import { Badge } from "@/components/ui/shadcn/badge";
import { shortPriceFormatter } from "@/lib/utils/formatter";
import shimmerPlaceholder from "@/lib/utils/shimmerPlaceholder";
import { OrderDTO } from "@/services/mongoose/store/order.dal";
import Image from "next/image";

export default function OrderItem({ name, course, quantity, price, total, imageUrl }: OrderDTO["items"][number]) {
  return (
    <Card
      variant="horizontal"
      thumbnail={
        <>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              draggable={false}
              fill
              sizes="25vw"
              placeholder={shimmerPlaceholder(250, 250)}
            />
          ) : (
            <div className="w-full h-full flex-center bg-stone-200 rounded-2xl">
              <p className="text-stone-500">No Image</p>
            </div>
          )}
        </>
      }
      description={
        <div>
          <Badge variant="secondary">{course.toUpperCase()}</Badge>
        </div>
      }
      title={name}
      price={total}
      button={
        <div className="w-full">
          <p className="inline-block body-3">{shortPriceFormatter(price)}</p>
          <div className="inline-block text-sm text-stone-500 whitespace-pre">{` x ${quantity}`}</div>
        </div>
      }
      className="p-1.5 pr-3 rounded-2xl bg-stone-50"
    />
  );
}
