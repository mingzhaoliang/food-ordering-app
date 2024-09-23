import secondaryBackground from "@/assets/images/secondary-background.jpg";
import { Suspense } from "react";
import Background from "../ui/background";
import ContentContainer from "./content-container";
import FeaturedDishes from "./featured-dishes";

export default function FeaturedDishesSection() {
  return (
    <section id="featured-dishes" className="section pb-10">
      <BackgroundSection />
      <ContentContainer
        title="Our Featured Dishes"
        description="Explore our featured dishes, where each plate tells a story of passion
							and tradition, made with love and fresh ingredients to delight your
							taste buds."
        buttonName="Explore more"
        href="/menu"
        content={
          <Suspense>
            <FeaturedDishes />
          </Suspense>
        }
      />
    </section>
  );
}

const BackgroundSection = () => (
  <>
    <div className="absolute -z-10 inset-0 top-24 -left-20 bg-gradient-to-r from-white via-white to-white/20 via-5% to-20%" />
    <div className="absolute -z-10 inset-0 top-24 -left-20 bg-gradient-to-b from-white via-white to-white/20 via-10% to-40%" />
    <div className="absolute -z-10 inset-0 top-24 -left-20 bg-gradient-to-t from-white via-white to-white/20 via-5% to-30%" />
    <div className="absolute inset-0 top-24 -left-6 -z-20 opacity-90">
      <Background src={secondaryBackground} />
    </div>
  </>
);
