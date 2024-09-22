import { validateRequest } from "@/lib/lucia/auth";
import { Store } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/shadcn/button";

export default async function StoreEntry() {
  const { user } = await validateRequest();

  if (user && ["admin", "superadmin"].includes(user.role)) {
    return (
      <Button variant="plain" size="icon" asChild>
        <Link href="/store">
          <Store className="size-icon-1" />
        </Link>
      </Button>
    );
  }
  return null;
}
