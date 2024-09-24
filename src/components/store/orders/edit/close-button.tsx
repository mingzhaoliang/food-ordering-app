"use client";

import { Button } from "@/components/ui/shadcn/button";
import { X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function CloseButton({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const clickHandler = async () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("id");
    const newUrl = newSearchParams.toString() ? `${pathname}?${newSearchParams.toString()}` : pathname;
    router.push(newUrl);
  };

  return (
    <Button variant="secondary" size="icon" onClick={clickHandler} className={className}>
      <X className="size-icon-1" />
    </Button>
  );
}
