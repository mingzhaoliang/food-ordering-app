"use client";

import { ShoppingBagIcon } from "lucide-react";
import { Button } from "../ui/shadcn/button";

export default function ShoppingBag() {
  return (
    <Button variant="plain" size="icon">
      <ShoppingBagIcon className="size-icon-1" />
    </Button>
  );
}
