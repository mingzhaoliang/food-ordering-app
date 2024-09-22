import { MenuItemsSearchParams } from "@/app/(with-header)/store/menu/@items/page";
import ParallelLink from "@/components/store/parallel-link";
import { Button } from "@/components/ui/shadcn/button";

interface AddDishButtonProps {
  searchParams: MenuItemsSearchParams;
}

export default function AddDishButton({ searchParams }: AddDishButtonProps) {
  return (
    <Button className="flex-1" asChild>
      <ParallelLink basePath="/store/menu" searchParams={searchParams} targetQueryParams={{ id: "add" }}>
        Add a new dish
      </ParallelLink>
    </Button>
  );
}
