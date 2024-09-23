import BriefAbout from "@/components/home/brief-about";
import FeaturedDishesSection from "@/components/home/featured-dishes-section";
import Footer from "@/components/home/footer";
import Hero from "@/components/home/hero";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <div className="relative z-10 bg-white overflow-hidden">
        <Hero />
        <FeaturedDishesSection />
        <BriefAbout />
      </div>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
