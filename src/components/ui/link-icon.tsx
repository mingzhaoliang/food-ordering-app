"use client";

import { cn } from "@/lib/utils/cn";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";

export interface LinkIconProps extends LinkProps {
  children: React.ReactNode;
  isImage?: boolean;
  className?: string;
}

export default function LinkIcon({ children, href, isImage, className, ...props }: LinkIconProps) {
  const pathname = usePathname();

  const activeStyles = isImage ? "border-4 border-active" : "bg-black text-white";

  return (
    <Link
      href={href}
      className={cn(
        "relative rounded-full max-lg:w-10 w-12 aspect-square flex-center transition-all",
        isImage ? "" : "border border-stone-400",
        pathname.endsWith(href.toString()) ? activeStyles : "text-black",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
