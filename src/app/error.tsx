"use client";

import defaultBackground from "@/assets/images/default-background.jpg";
import Background from "@/components/ui/background";
import { Button } from "@/components/ui/shadcn/button";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="w-screen min-h-screen pt-24 px-10">
      <Background src={defaultBackground} />
      <div className="z-10 my-12 sm:w-2/3 2xl:w-2/3 space-y-2 2xl:space-y-6">
        <h1 className="heading-1 text-balance">Oops! Something went wrong.</h1>
      </div>
      <div className="space-x-4">
        <Button variant="outline" asChild>
          <Link href="/">Go back to home page</Link>
        </Button>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  );
}
