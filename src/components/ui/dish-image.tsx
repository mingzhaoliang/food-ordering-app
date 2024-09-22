"use client";

import { cn } from "@/lib/utils/cn";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface DishImageProps extends React.ComponentProps<typeof Image> {
  course: string;
  slug: string;
}

export default function DishImage({ course, slug, className, ...props }: DishImageProps) {
  const router = useRouter();

  const imageClickHandler = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    event.preventDefault();
    if (!course || !slug) return;
    router.push(`/menu/image/${slug}`, { scroll: false });
  };

  return <Image {...props} className={cn("cursor-pointer", className)} onClick={imageClickHandler} />;
}
