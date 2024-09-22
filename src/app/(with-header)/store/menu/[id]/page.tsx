import DeleteMenuItemButton from "@/components/store/menu/delete-menu-item-button";
import MenuForm from "@/components/store/menu/edit/menu-item-form";
import BackButton from "@/components/ui/back-button";
import { getDish } from "@/services/mongoose/store/dish.dal";
import { getCoursesAndSpecialDiets } from "@/services/mongoose/store/restaurant.dal";
import { ArrowLeft } from "lucide-react";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const isAdd = id === "add";

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
    <div className="relative h-full bg-white rounded-3xl space-y-4 p-6 pt-0 overflow-auto">
      <div className="sticky top-0 pt-6 sm:pt-8 bg-white/80 backdrop-blur-sm z-10 flex justify-between">
        <div className="flex items-center gap-4">
          <BackButton variant="secondary" size="icon">
            <ArrowLeft className="size-icon-1" />
          </BackButton>
          <h3 className="heading-3">{dish?.name ?? "Add a new dish"}</h3>
        </div>
        <DeleteMenuItemButton
          itemId={dish?._id}
          buttonConfig={{
            variant: "ghost",
            children: dish?._id ? "Delete" : "Cancel",
          }}
          redirectBack
        />
      </div>
      <MenuForm
        key={dish?._id.toString() ?? "add"}
        dish={dish}
        courses={courseOptions!}
        specialDiets={specialDietOptions!}
      />
    </div>
  );
}
