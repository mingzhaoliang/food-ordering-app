import defaultBackground from "@/assets/images/default-background.jpg";
import { Button } from "@/components/ui/shadcn/button";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import Background from "../ui/background";

export default function Hero() {
  return (
    <div className="relative w-screen pt-24 px-10 flex flex-col bg-cover bg-center">
      <Background src={defaultBackground} />
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white to-white/20 via-5% to-30%" />
      <div className="z-10 mt-12 sm:w-2/3 2xl:w-2/3 space-y-2 2xl:space-y-6">
        <p className="uppercase sm:pl-1 body-3">welcome to our restaurant</p>
        <h1
          className={cn(
            "text-4xl sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl",
            "leading-snug sm:leading-tight md:leading-tight lg:leading-tight 2xl:leading-tight",
            "text-balance"
          )}
        >
          Indulge in Melbourne&apos;s finest, artisanal Italian cuisine.
        </h1>
      </div>
      <div className="z-10 mt-8 flex gap-4">
        <Button variant="default-active" className="w-fit h-fit">
          <Link href="/menu">Order now</Link>
        </Button>
      </div>
      <div className="z-10 mt-12 max-w-120 space-y-2">
        <div className="border-t-2 border-black w-1/4 min-w-20" />
        <p className="text-balance body-3 tracking-wide lg:leading-relaxed 2xl:leading-relaxed">
          Dive into an authentic culinary journey with our diverse selection of traditional Italian courses, from
          enticing antipasti to indulgent dolci.
        </p>
      </div>
      <div className="z-10 w-full mt-12 mb-8 flex-center">
        <Button variant="default-active" size="icon" className="p-12 aspect-square flex-col-center" asChild>
          <Link href="/menu">
            <p className="text-center">
              Explore
              <br />
              Dishes
            </p>
          </Link>
        </Button>
      </div>
    </div>
  );
}
