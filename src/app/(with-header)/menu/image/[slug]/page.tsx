"use client";

import { redirect, usePathname } from "next/navigation";

export default function Page() {
  const path = usePathname();
  const newPath = path.replace("image", "dish");

  redirect(newPath);
}
