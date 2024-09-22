import { validateRequest } from "@/lib/lucia/auth";
import { LogIn, UserIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/shadcn/button";

export default async function Me() {
  const { user } = await validateRequest();

  const content = user ? (
    <Button variant="plain" size="icon" asChild>
      <Link href="/my">
        <UserIcon className="size-icon-1" />
      </Link>
    </Button>
  ) : (
    <Button variant="plain" className="max-sm:h-9" asChild>
      <Link href="/signin" scroll={false}>
        <LogIn className="mr-2 size-icon-1" />
        <p className="max-lg:text-sm">Sign in</p>
      </Link>
    </Button>
  );

  return <>{content}</>;
}
