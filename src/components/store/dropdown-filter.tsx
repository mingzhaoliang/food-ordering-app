"use client";

import { Button } from "@/components/ui/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { reverseSlugify } from "@/lib/utils/reverseSlugify";
import Link from "next/link";
import { useState } from "react";

interface DropdownFilterProps<T extends Record<string, any>> {
  label: string;
  items: string[];
  queryKey: keyof T;
  searchParams: T;
  basePath: string;
  urlExcludedParams?: keyof T | (keyof T)[];
}

export default function DropdownFilter<T extends Record<string, any>>({
  label,
  items,
  queryKey,
  searchParams,
  basePath,
  urlExcludedParams,
}: DropdownFilterProps<T>) {
  const [openMenu, setOpenMenu] = useState(false);
  const selectedItem = searchParams[queryKey] ?? "all";

  const buildUrl = (item: string) => {
    const newSearchParams = { ...searchParams };

    if (urlExcludedParams) {
      const excludedParams = Array.isArray(urlExcludedParams) ? urlExcludedParams : [urlExcludedParams];
      excludedParams.forEach((param) => delete newSearchParams[param]);
    }

    if (item === "all") {
      delete newSearchParams[queryKey];
    } else {
      newSearchParams[queryKey] = item as T[keyof T];
    }
    return { pathname: basePath, query: newSearchParams };
  };

  return (
    <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
      <DropdownMenuTrigger className="focus-visible:ring-offset-0 focus-visible:ring-0" asChild>
        <Button variant="secondary" className="flex-1 mb-4" onClick={() => setOpenMenu((prev) => !prev)}>
          {reverseSlugify(selectedItem, { caseStyle: "sentence" })}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={selectedItem}>
          <Link href={buildUrl("all")} className="w-full h-full" onClick={() => setOpenMenu(false)}>
            <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
          </Link>
          {items.map((item) => (
            <Link key={item} href={buildUrl(item)} onClick={() => setOpenMenu(false)}>
              <DropdownMenuRadioItem value={item}>
                {reverseSlugify(item, { caseStyle: "sentence" })}
              </DropdownMenuRadioItem>
            </Link>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
