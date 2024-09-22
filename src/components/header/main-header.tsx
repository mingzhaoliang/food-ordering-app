import Header from "@/components/ui/header";
import { cn } from "@/lib/utils/cn";
import { PAGES } from "@/lib/utils/constants";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "../ui/shadcn/button";
import DropDownNavigation from "./drop-down-navigation";
import Mark from "./mark";
import Me from "./me";
import ShoppingBag from "./shopping-bag";
import StoreEntry from "./store-entry";

interface MainHeaderProps {
  name: string;
}

export default function MainHeader({ name }: MainHeaderProps) {
  return (
    <Header>
      <div className="flex-center lg:gap-10 2xl:gap-12">
        <Mark name={name} />
        {PAGES.map((link) => (
          <Link key={link.href} href={link.href} className={cn("body-2 text-nowrap text-ellipsis", "max-lg:hidden")}>
            {link.text}
          </Link>
        ))}
      </div>
      <div className="flex-center gap-3 lg:gap-4">
        <Suspense
          fallback={
            <Button variant="plain" size="icon">
              <Loader2 className="size-icon-1 animate-spin" />
            </Button>
          }
        >
          <ShoppingBag />
          <Me />
          <StoreEntry />
        </Suspense>
        <div className="lg:hidden">
          <DropDownNavigation />
        </div>
      </div>
    </Header>
  );
}
