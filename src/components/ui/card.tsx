import { cn } from "@/lib/utils/cn";
import { shortPriceFormatter } from "@/lib/utils/formatter";
import { Slot } from "@radix-ui/react-slot";
import { cva, VariantProps } from "class-variance-authority";

const cardVariants = cva("relative grid overflow-hidden", {
  variants: {
    variant: {
      default: [
        "w-48 lg:w-64 2xl:w-72 h-fit",
        "p-4 lg:p-6 2xl:p-8",
        "bg-stone-50 rounded-3xl shadow",
        "grid-areas-card grid-cols-2 grid-rows-card",
        "justify-items-center",
        "gap-1 sm:gap-2 2xl:gap-3",
      ],
      horizontal: [
        "w-full h-28 sm:h-32 lg:h-36",
        "grid-areas-card-horizontal grid-cols-card-horizontal grid-rows-card-horizontal",
        "items-center",
        "gap-x-3 gap-y-1.5",
      ],
      vertical: [
        "w-72 sm:w-80 lg:w-88 h-40 sm:h-44",
        "pb-1.5",
        "bg-stone-50 rounded-3xl shadow",
        "grid-areas-card-vertical grid-cols-card-vertical grid-rows-card-vertical",
        "items-center",
        "gap-x-3 gap-y-1.5",
      ],
    },
  },
});

const thumbnailVariants = cva("relative grid-in-thumbnail w-full h-full overflow-hidden", {
  variants: {
    variant: {
      default: "sm:p-2 aspect-square rounded-2xl rounded-full",
      horizontal: "!w-fit aspect-square rounded-2xl",
      vertical: "",
    },
  },
});

const tagsVariants = cva("flex gap-1", {
  variants: {
    variant: {
      default: "grid-in-thumbnail self-end translate-y-1/3",
      horizontal: "grid-in-tags",
      vertical: "grid-in-thumbnail self-end m-2",
    },
  },
});

const titleVariants = cva("grid-in-title overflow-hidden text-ellipsis text-nowrap", {
  variants: {
    variant: {
      default: "heading-4 w-full text-center",
      horizontal: "font-medium text-lg",
      vertical: "ml-3",
    },
  },
});

const descriptionVariants = cva("grid-in-description line-clamp-2", {
  variants: {
    variant: {
      default: "text-center lg:m-2 body-3 h-10 lg:h-12 2xl:h-14",
      horizontal: "text-xs sm:text-sm",
      vertical: "hidden",
    },
  },
});

const priceVariants = cva("grid-in-price font-medium", {
  variants: {
    variant: {
      default: "justify-self-start self-end body-2",
      horizontal: "text-sm sm:text-base",
      vertical: "body-2",
    },
  },
});

const buttonVariants = cva("w-fit h-fit grid-in-button", {
  variants: {
    variant: {
      default: "justify-self-end",
      horizontal: "justify-self-end self-end",
      vertical: "mr-3",
    },
  },
});

interface CardProps extends VariantProps<typeof cardVariants> {
  className?: string;
  thumbnail: React.ReactNode;
  tags?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  price: number;
  button?: React.ReactNode;
}

export default function Card({ variant, className, thumbnail, tags, title, description, price, button }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant, className }))}>
      <div className={cn(thumbnailVariants({ variant }))}>
        <Slot className="object-cover">{thumbnail}</Slot>
      </div>
      <div className={cn(tagsVariants({ variant }))}>{tags}</div>
      <p className={cn(titleVariants({ variant }))}>{title}</p>
      <Slot className={cn(descriptionVariants({ variant }))}>{description}</Slot>
      <p className={cn(priceVariants({ variant }))}>{shortPriceFormatter(price)}</p>
      <Slot className={cn(buttonVariants({ variant }))}>{button}</Slot>
    </div>
  );
}
