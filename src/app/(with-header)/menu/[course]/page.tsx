import DishList from "@/components/menu/dish-list";
import { getDishes } from "@/services/mongoose/store/dish.dal";
import { getCourses } from "@/services/mongoose/store/restaurant.dal";

export const dynamicParams = false;
export const experimental_ppr = false;

export async function generateStaticParams() {
  const courses = await getCourses();

  return courses.map((course) => ({ course: course.slug }));
}

export default async function Page({ params }: { params: { course: string } }) {
  const { course } = params;
  const { dishes } = await getDishes({ course, limit: 0 });

  return (
    <div className="flex-1 w-full space-y-4 sm:space-y-6 lg:space-y-8">
      <h1 className="heading-2 uppercase">{course}</h1>
      <DishList dishes={dishes} />
    </div>
  );
}
