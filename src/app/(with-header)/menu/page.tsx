import DishList from "@/components/menu/dish-list";
import { getDishes } from "@/services/mongoose/store/dish.dal";

export default async function Page() {
  const { dishes } = await getDishes({ limit: 0 });

  return (
    <div className="flex-1 w-full space-y-4 sm:space-y-6 lg:space-y-8">
      <h1 className="heading-2 uppercase">Menu</h1>
      <DishList dishes={dishes} />
    </div>
  );
}
