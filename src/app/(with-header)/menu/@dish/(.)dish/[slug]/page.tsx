import DishPanel from "@/components/menu/dish-panel";
import Modal from "@/components/ui/modal";
import { getDish } from "@/services/mongoose/store/dish.dal";

export default async function Page({ params }: { params: { slug: string } }) {
  const dish = await getDish({ slug: params.slug });

  return (
    <Modal
      backdropClose
      className="w-full max-sm:max-w-96 sm:w-3/4 lg:w-3/5 2xl:w-1/2 h-full sm:h-120 bg-stone-50 no-scrollbar"
    >
      <DishPanel dish={dish} />
    </Modal>
  );
}
