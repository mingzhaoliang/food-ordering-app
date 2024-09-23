import BackButton from "@/components/ui/back-button";
import { cn } from "@/lib/utils/cn";
import shimmerPlaceholder from "@/lib/utils/shimmerPlaceholder";
import { DishDTO } from "@/services/mongoose/store/dish.dal";
import { X } from "lucide-react";
import Image from "next/image";
import DishImage from "../ui/dish-image";
import { Separator } from "../ui/shadcn/separator";
import AddToCartForm from "./add-to-cart-form";

interface DishPanelProps {
  dish: DishDTO;
  className?: string;
}

export default function DishPanel({ dish, className }: DishPanelProps) {
  return (
    <div
      className={cn(
        "w-full grid grid-cols-1 grid-rows-[auto_1fr] sm:grid-rows-1 sm:grid-cols-2 lg:grid-cols-12 2xl:grid-cols-5 items-start",
        className
      )}
    >
      <div className="relative w-full h-60 sm:h-full max-sm:aspect-video lg:col-span-5 2xl:col-span-2">
        <DishImage
          course={dish.course}
          slug={dish.slug}
          src={dish.image.imageUrl}
          alt={dish.name}
          fill
          sizes="100vw, (min-width:640px) 50vw"
          placeholder={shimmerPlaceholder(650, 900)}
          className="p-3 object-cover rounded-3xl"
        />
      </div>
      <div className="max-sm:pb-0 p-3 h-full lg:col-span-7 2xl:col-span-3 flex flex-col">
        <div className="space-y-2">
          <h3 className="heading-3 sm:mr-8">{dish.name}</h3>

          {dish.specialDiets.map(({ slug, imageUrl }) => (
            <Image
              key={slug}
              src={imageUrl}
              alt="Special diet"
              draggable={false}
              width={36}
              height={36}
              className={cn(
                "inline-flex p-0.5 sm:p-1 rounded-full bg-white",
                "border border-dashed border-active/50",
                "size-icon-3"
              )}
            />
          ))}
        </div>

        <p className="mt-2">{dish.description}</p>
        <Separator className="my-3" />
        <AddToCartForm dish={dish} />
      </div>

      <BackButton variant="secondary" size="icon" className="absolute top-4 right-4">
        <X className="size-icon-1" />
      </BackButton>
    </div>
  );
}
