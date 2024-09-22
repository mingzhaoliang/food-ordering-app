"use client";

import { Button } from "@/components/ui/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { cn } from "@/lib/utils/cn";
import { PAGES } from "@/lib/utils/constants";
import { Slot } from "@radix-ui/react-slot";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DropDownNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu onOpenChange={setOpen}>
      <DropdownMenuTrigger className="focus-visible:ring-offset-0 focus-visible:ring-0" asChild>
        <Button variant="plain" size="icon" className={cn("transition-transform", open ? "rotate-90" : "rotate-0")}>
          <Slot className="size-icon-1">{open ? <X /> : <Menu />}</Slot>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {PAGES.map((link) => (
          <DropdownMenuItem key={link.href} asChild>
            <Link href={link.href} draggable={false}>
              {link.text}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
