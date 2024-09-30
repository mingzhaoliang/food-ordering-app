import restaurantBackground from "@/assets/images/restaurant-background.jpg";
import picture from "@/assets/images/two-round-white-and-gray-plates-on-table-with-egg-sandwiches.jpg";
import Background from "@/components/ui/background";
import { Button } from "@/components/ui/shadcn/button";
import { cn } from "@/lib/utils/cn";
import { getRestaurant } from "@/services/mongoose/store/restaurant.dal";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default function AboutPage() {
  return (
    <div className="relative space-y-8 pb-20">
      <div className="relative w-screen min-h-[calc(100vh*2/3)] pt-24 px-10 flex flex-col bg-cover bg-center">
        <Background src={restaurantBackground} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white to-white/20 via-5% to-30%" />
        <div className="z-10 mt-12 sm:w-2/3 2xl:w-2/3 space-y-2 2xl:space-y-6 text-white">
          <Suspense fallback={null}>
            <Title />
          </Suspense>
          <h1
            className={cn(
              "text-4xl sm:text-5xl lg:text-6xl",
              "leading-snug sm:leading-tight md:leading-tight lg:leading-tight 2xl:leading-tight",
              "text-balance"
            )}
          >
            We serve authentic Italian dishes, craft great cocktails, and welcome every guest with warmth.
          </h1>
        </div>
      </div>
      <div className="px-10 space-y-4">
        <div className="space-y-2">
          <h2 className="heading-1">Our Story</h2>
          <h4 className="heading-4 font-normal">A glimpse into our evolution.</h4>
        </div>
        <div className="grid sm:grid-cols-2 sm:gap-x-12">
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            <Image
              src={picture}
              alt="Roasted meat served on white ceramic plates"
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="body-2 leading-relaxed space-y-4 mr-16">
            <Suspense fallback={<StoryDetails />}>
              <StorySection />
            </Suspense>
            <Button variant="default-active" className="w-fit h-fit" asChild>
              <Link href="/menu">
                Menu
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const Title = async () => {
  const { name } = await getRestaurant();
  return <p className="uppercase body-1">About {name}</p>;
};

const StorySection = async () => {
  const { name, city } = await getRestaurant();
  return <StoryDetails name={name} city={city} />;
};

const StoryDetails = ({ name = "Restaurant Name", city = "City" }: { name?: string; city?: string }) => (
  <>
    <p>
      What started as a small workshop has blossomed into {name}, a cherished spot in {city}. Founded by three
      passionate friends, our vision was to create a welcoming space where everyone could savour delightful food and
      drinks in a relaxed environment.
    </p>
    <p>
      As we&apos;ve grown, so has our commitment to excellence. With the recent leadership of Somebody, our former head
      chef, we’ve revitalised our menu and enhanced our focus on locally sourced ingredients and innovative cocktails.
    </p>
    <p>
      While the road has had its ups and downs, the support from our local community has been invaluable. We&apos;re
      eager to reopen our doors and invite you back to experience the warmth and vibrancy that {name} embodies. Join us
      for memorable moments and a taste of what makes us special!
    </p>
  </>
);
