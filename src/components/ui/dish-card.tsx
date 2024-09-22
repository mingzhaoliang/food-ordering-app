import Card from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import shimmerPlaceholder from "@/lib/utils/shimmerPlaceholder";
import { DishDTO } from "@/services/mongoose/store/dish.dal";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import DishImage from "./dish-image";

type DishProps = Partial<DishDTO> &
  Pick<React.ComponentProps<typeof Card>, "variant" | "className"> & {
    button?: React.ReactNode;
    iconUrls?: string[];
  };

export default function DishCard({
  course,
  slug,
  variant,
  name,
  iconUrls,
  price,
  description,
  image,
  button,
  className,
}: DishProps) {
  return (
    <Card
      className={className}
      variant={variant}
      thumbnail={
        image ? (
          <DishImage
            course={course ?? ""}
            slug={slug ?? ""}
            src={image.imageUrl}
            alt={name ?? ""}
            draggable={false}
            fill
            sizes="25vw"
            placeholder={shimmerPlaceholder(250, 250)}
          />
        ) : (
          <div className="w-full h-full aspect-square rounded-2xl border-2 border-dashed flex-center">
            <ImageIcon className="text-fade size-icon-1" />
          </div>
        )
      }
      tags={iconUrls?.map((iconUrl) => (
        <Image
          key={iconUrl}
          src={iconUrl}
          alt="tag"
          draggable={false}
          width={36}
          height={36}
          className={cn(
            "inline-flex p-0.5 sm:p-1 rounded-full aspect-square bg-white/80",
            "border border-dashed border-active/50",
            "size-icon-3"
          )}
        />
      ))}
      title={name ?? ""}
      description={<p>{description}</p>}
      price={price ?? 0}
      button={button}
    />
  );
}
