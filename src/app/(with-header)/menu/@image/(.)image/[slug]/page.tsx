import BackButton from "@/components/ui/back-button";
import Modal from "@/components/ui/modal";
import shimmerPlaceholder from "@/lib/utils/shimmerPlaceholder";
import { getDish } from "@/services/mongoose/store/dish.dal";
import { X } from "lucide-react";
import Image from "next/image";

export default async function Page({ params }: { params: { slug: string } }) {
  const { image } = await getDish({ slug: params.slug });

  return (
    <Modal backdropClose className="w-full max-sm:max-w-96 sm:w-3/4 lg:w-3/5 2xl:w-1/2 h-120 lg:h-[40rem] bg-stone-50">
      <div className="relative w-full h-full">
        <Image
          src={image.imageUrl}
          alt={params.slug}
          fill
          sizes="90vw"
          className="object-cover"
          placeholder={shimmerPlaceholder(900, 700)}
        />
        <BackButton
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4 bg-opacity-80 focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <X className="size-icon-1" />
        </BackButton>
      </div>
    </Modal>
  );
}
