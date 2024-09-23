"use client";

import ScrollMask from "@/components/ui/scroll-mask";
import { cn } from "@/lib/utils/cn";
import { useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function ScrollContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);

  const { scrollXProgress } = useScroll({
    container: container,
    offset: ["start end", "start start"],
  });
  const startOpacity = useTransform(scrollXProgress, [0, 0.05, 0.1], [0, 0.9, 1]);
  const endOpacity = useTransform(scrollXProgress, [0.9, 0.95, 1], [1, 0.9, 0]);

  const scrollHandler = (direction: "left" | "right") => {
    container.current?.scrollTo({
      left: direction === "left" ? 0 : container.current.scrollWidth,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    container.current?.scrollTo({ left: 0, behavior: "smooth" });

    function checkScrollable() {
      if (container.current) {
        setScrollable(container.current.scrollWidth > container.current.clientWidth);
      }
    }

    checkScrollable();
    window.addEventListener("resize", checkScrollable);

    return () => window.removeEventListener("resize", checkScrollable);
  }, []);

  return (
    <div className="relative flex-center">
      {scrollable && (
        <ScrollMask
          startOpacityIndex={startOpacity}
          endOpacityIndex={endOpacity}
          scrollHandler={scrollHandler}
          className="max-lg:hidden"
        />
      )}
      <div ref={container} className={cn("py-2 overflow-auto", className)}>
        {children}
      </div>
    </div>
  );
}
