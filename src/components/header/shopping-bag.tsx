"use client";

import { useCart } from "@/lib/store/context/cart.context";
import { cn } from "@/lib/utils/cn";
import { ShoppingBagIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/shadcn/button";

export default function ShoppingBag() {
  const { count, visible } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const clickHandler = () => {
    if (pathname === "/my/cart") {
      window.scrollTo(0, 0);
    } else if (pathname === "/my/cart/checkout") {
      router.replace("/my/cart");
    } else {
      router.push("/cart", { scroll: false });
    }
  };

  return (
    <div className="relative">
      <Button variant="plain" size="icon" onClick={clickHandler}>
        <ShoppingBagIcon className="size-icon-1" />
      </Button>
      <div
        className={cn(
          "absolute -top-2 -right-2 sm:-top-3 sm:-right-3",
          "text-[0.6rem] sm:text-xs w-5 h-5 sm:w-7 sm:h-7",
          "p-1 flex-center bg-active rounded-full",
          "transition-all duration-300",
          visible ? "scale-100 opacity-100" : "scale-0 opacity-0"
        )}
      >
        +{count}
      </div>
    </div>
  );
}
