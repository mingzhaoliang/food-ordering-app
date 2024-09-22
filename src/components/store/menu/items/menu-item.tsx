import { MenuItemsSearchParams } from "@/app/(with-header)/store/menu/@items/page";
import ParallelLink from "@/components/store/parallel-link";
import DishCard from "@/components/ui/dish-card";
import { cn } from "@/lib/utils/cn";
import { DishDTO } from "@/services/mongoose/store/dish.dal";

interface ExistingDishProps {
  item: DishDTO;
  specialDietIcons: string[];
  searchParams: MenuItemsSearchParams;
}

export default function MenuItem({ item, specialDietIcons, searchParams }: ExistingDishProps) {
  const activeDishId = searchParams.id;

  return (
    <ParallelLink basePath="/store/menu" searchParams={searchParams} targetQueryParams={{ id: item._id }}>
      <DishCard
        {...item}
        iconUrls={specialDietIcons}
        variant="horizontal"
        className={cn(
          "rounded-2xl p-1.5 pr-2 transition-colors",
          activeDishId === item._id ? "bg-secondary" : "hover:bg-stone-50"
        )}
      />
    </ParallelLink>
  );
}
