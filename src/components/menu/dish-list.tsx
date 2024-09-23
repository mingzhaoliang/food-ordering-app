import { DishDTO } from "@/services/mongoose/store/dish.dal";
import { Separator } from "../ui/shadcn/separator";
import DishItem from "./dish-item";

interface DishListProps {
  dishes: DishDTO[];
}

const DishList = ({ dishes }: DishListProps) => {
  return (
    <div className="flex max-sm:flex-col sm:flex-wrap sm:gap-3 md:gap-4 lg:gap-3 xl:gap-6 2xl:gap-5">
      {dishes.map((item, index) => (
        <div key={item.name}>
          {index > 0 && <Separator className="sm:hidden my-3" />}
          {/* For larger screens */}
          <DishItem item={item} variant="default" className="flex-none max-sm:hidden" />
          {/* For smaller screens */}
          <DishItem item={item} variant="horizontal" className="flex-none sm:hidden" />
        </div>
      ))}
    </div>
  );
};

export default DishList;
