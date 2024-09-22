import ManageRestaurantForm from "@/components/store/restaurant/manage-restaurant-form";
import { getRestaurant } from "@/services/mongoose/store/restaurant.dal";

export default async function Page() {
  const restaurant = await getRestaurant();

  return (
    <div className="mb-4 bg-white rounded-3xl p-6 sm:p-8 max-lg:space-y-4 space-y-6">
      <h3 className="heading-3">My restaurant</h3>
      <ManageRestaurantForm restaurant={restaurant} />
    </div>
  );
}
