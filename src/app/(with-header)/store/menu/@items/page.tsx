import DropdownFilter from "@/components/store/dropdown-filter";
import DeleteMenuItemButton from "@/components/store/menu/delete-menu-item-button";
import AddDishButton from "@/components/store/menu/items/add-dish-button";
import MenuItem from "@/components/store/menu/items/menu-item";
import AutoPagination from "@/components/ui/auto-pagination";
import DishCard from "@/components/ui/dish-card";
import { Separator } from "@/components/ui/shadcn/separator";
import { cn } from "@/lib/utils/cn";
import { getDishes } from "@/services/mongoose/store/dish.dal";
import { getCoursesAndSpecialDiets } from "@/services/mongoose/store/restaurant.dal";
import { Loader2, X } from "lucide-react";

export interface MenuItemsSearchParams {
  course?: string;
  page?: string;
  id?: string;
}

export default async function Page({ searchParams }: { searchParams: MenuItemsSearchParams }) {
  const isAdd = searchParams.id === "add";
  const { course, page, id } = searchParams;

  // Data fetching
  const { courses } = await getCoursesAndSpecialDiets();

  const queryPage = +(page ?? 1) || 1;
  const { dishes, currentPage, totalPages } = await getDishes({ course, page: queryPage });
  const courseSlugs = courses.map(({ slug }) => slug);

  return (
    <div className="min-h-full flex flex-col bg-white rounded-3xl p-6 sm:p-8 max-lg:space-y-4 space-y-6">
      <h3 className="heading-3">My menu</h3>
      <div className="grid grid-cols-2 gap-x-4">
        <DropdownFilter
          label="Menu course"
          items={courseSlugs}
          queryKey="course"
          searchParams={searchParams}
          basePath="/store/menu"
          urlExcludedParams="page"
        />
        <AddDishButton searchParams={searchParams} />
      </div>
      {isAdd && (
        <DishCard
          name="Add a new dish"
          description="Click here to add a new dish"
          variant="horizontal"
          className={cn("rounded-2xl p-1 transition-colors", "bg-secondary")}
          button={
            <div>
              <DeleteMenuItemButton
                buttonConfig={{
                  variant: "secondary",
                  size: "icon",
                  className: cn("w-8 h-8 sm:w-8 sm:h-8 hover:bg-stone-200", "bg-secondary"),
                  children: <X className="size-icon-1" />,
                }}
              />
            </div>
          }
        />
      )}
      {isAdd && <Separator className="my-3" />}
      <div className="flex-1 flex flex-col">
        {dishes.map((item, index) => (
          <div key={item._id.toString()}>
            {!!index && <Separator className="my-3" />}
            <div className="relative">
              <MenuItem
                item={item}
                specialDietIcons={item.specialDiets.map(({ imageUrl }) => imageUrl)}
                searchParams={searchParams}
              />
              <div className="absolute bottom-2 right-2">
                <DeleteMenuItemButton
                  itemId={item._id}
                  buttonConfig={{
                    variant: "secondary",
                    size: "icon",
                    className: cn(
                      "w-8 h-8 sm:w-8 sm:h-8 hover:bg-stone-200",
                      id === item._id ? "bg-secondary" : "bg-stone-50"
                    ),
                    children: <X className="size-icon-1" />,
                    pendingFallback: <Loader2 className="size-icon-1 animate-spin" />,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
        {dishes.length === 0 && <p className="text-center">Add a new dish now.</p>}
      </div>
      <AutoPagination searchParams={searchParams} currentPage={currentPage} maxPage={totalPages} hideNavigationText />
    </div>
  );
}
