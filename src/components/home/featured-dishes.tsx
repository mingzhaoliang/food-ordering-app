import ScrollContainer from "@/components/ui/scroll-container";
import { getDishes } from "@/services/mongoose/store/dish.dal";
import DishItem from "../menu/dish-item";

const FeaturedDishes = async () => {
  const { dishes: featuredDishes } = await getDishes({ featured: true, limit: 0 });

  return (
    <ScrollContainer className="max-lg:w-screen">
      <div className="flex lg:grid lg:grid-rows-2 lg:grid-flow-col lg:grid-cols-[repeat(auto-fit,_minmax(auto,_18rem))] gap-4 lg:gap-5">
        {featuredDishes.map((item) => (
          <div key={item.slug}>
            {/* For larger screens */}
            <DishItem item={item} variant="default" className="flex-none max-sm:hidden" />
            {/* For smaller screens */}
            <DishItem item={item} variant="vertical" className="flex-none sm:hidden" />
          </div>
        ))}
      </div>
    </ScrollContainer>
  );
};

export default FeaturedDishes;
