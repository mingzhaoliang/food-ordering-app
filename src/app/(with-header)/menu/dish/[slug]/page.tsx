import DishPanel from "@/components/menu/dish-panel";
import { getDish } from "@/services/mongoose/store/dish.dal";

export default async function Page({ params }: { params: { slug: string } }) {
  const dish = await getDish({ slug: params.slug });

  return <DishPanel dish={dish} />;
}
