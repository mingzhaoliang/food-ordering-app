import { DishDTO } from "@/services/mongoose/store/dish.dal";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import DishCard from "../ui/dish-card";
import { Button } from "../ui/shadcn/button";

interface DishItemProps {
  item: DishDTO;
  variant: "default" | "horizontal" | "vertical";
  className: string;
}

const DishItem = ({ item, variant, className }: DishItemProps) => (
  <DishCard
    {...item}
    iconUrls={item.specialDiets.map(({ imageUrl }) => imageUrl)}
    variant={variant}
    className={className}
    button={
      <Button size="icon" asChild>
        <Link href={`/menu/dish/${item.slug}`} scroll={false}>
          <ChevronRight className="size-icon-1" />
        </Link>
      </Button>
    }
  />
);

export default DishItem;
