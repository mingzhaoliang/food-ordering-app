import DeleteMenuItemButton from "@/components/store/menu/delete-menu-item-button";
import MenuForm from "@/components/store/menu/edit/menu-item-form";
import { getDish } from "@/services/mongoose/store/dish.dal";
import { getCoursesAndSpecialDiets } from "@/services/mongoose/store/restaurant.dal";

export default async function Page({ searchParams }: { searchParams: { id?: string } }) {
  const { id } = searchParams;
  const isAdd = id === "add";

  if (!id) {
    return null;
  }

  const dish = isAdd ? undefined : await getDish({ id });
  if (!isAdd && !dish) {
    return null;
  }

  const { courses, specialDiets } = await getCoursesAndSpecialDiets();

  const [courseOptions, specialDietOptions] = [courses, specialDiets].map((options) =>
    options.map((option) => ({
      label: option.name,
      value: option.slug,
    }))
  );

  return (
    <div className="relative w-full h-full overflow-scroll p-6 pt-0 space-y-4 bg-white rounded-3xl">
      <div className="sticky top-0 pt-6 sm:pt-8 bg-white/80 backdrop-blur-sm z-10 flex justify-between">
        <h3 className="heading-3">{dish?.name ?? "Add a new dish"}</h3>
        <DeleteMenuItemButton
          itemId={dish?._id}
          buttonConfig={{
            variant: "ghost",
            children: dish?._id ? "Delete" : "Cancel",
          }}
        />
      </div>
      <MenuForm
        key={dish?._id.toString() ?? "add"}
        searchParams={searchParams}
        dish={dish}
        courses={courseOptions!}
        specialDiets={specialDietOptions!}
      />
    </div>
  );
}
