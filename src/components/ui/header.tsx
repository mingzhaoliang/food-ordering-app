"use client";

import { cn } from "@/lib/utils/cn";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Header({ children, className }: { children: React.ReactNode; className?: string }) {
  const pathname = usePathname();
  const isHome = !pathname.split("/")[1];

  const headerRef = useRef<HTMLHeadElement | null>(null);
  const [showHeaderBackground, setShowHeaderBackground] = useState(isHome ? false : true);

  useEffect(() => {
    setShowHeaderBackground(isHome ? false : true);

    const displayHeaderBackground = () => {
      if (headerRef.current && isHome) {
        setShowHeaderBackground(headerRef.current.clientHeight < window.scrollY);
      }
    };

    displayHeaderBackground();

    window.addEventListener("scroll", displayHeaderBackground);

    return () => {
      window.removeEventListener("scroll", displayHeaderBackground);
    };
  }, [headerRef, isHome]);

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed top-0 left-0 right-0 flex justify-between items-center z-50 px-5 py-2 md:px-8 md:py-4 transition-all",
        showHeaderBackground ? "bg-white/80 backdrop-blur-sm shadow-sm" : "bg-transparent",
        className
      )}
    >
      {children}
    </header>
  );
}
