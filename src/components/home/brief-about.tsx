"use client";

import pastaDish1 from "@/assets/images/pasta-dish1.jpg";
import pastaDish2 from "@/assets/images/pasta-dish2.jpg";
import pastaDish3 from "@/assets/images/pasta-dish3.jpg";
import pastaDish4 from "@/assets/images/pasta-dish4.jpg";
import ScrollContainer from "@/components/ui/scroll-container";
import shimmerPlaceholder from "@/lib/utils/shimmerPlaceholder";
import Image from "next/image";
import ContentContainer from "./content-container";

const pastaDishes = [pastaDish1, pastaDish2, pastaDish3, pastaDish4];

export default function BriefAbout() {
  return (
    <section id="brief-about" className="section">
      <ContentContainer
        reverse
        title="Embark on a Delightful Culinary Journey"
        description={`Here, we invite you to embark on a delightful journey through the vibrant flavours of Italy. Our story is one of passion, tradition, and a deep-rooted love for authentic Italian cuisine.`}
        buttonName="About us"
        href="/about"
        content={
          <ScrollContainer className="max-sm:px-5 max-md:px-10 max-lg:px-12 max-sm:-mx-5 max-lg:-mx-12 max-lg:w-screen">
            <div className="w-max flex gap-2 sm:gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="relative h-60 w-48 sm:h-72 sm:w-56 lg:h-120 lg:w-72 rounded-3xl overflow-hidden"
                >
                  <Image
                    src={pastaDishes[i]}
                    alt="Pasta dish"
                    fill
                    sizes="50vw"
                    draggable={false}
                    className="object-cover"
                    placeholder={shimmerPlaceholder(288, 192)}
                  />
                </div>
              ))}
            </div>
          </ScrollContainer>
        }
      />
    </section>
  );
}
