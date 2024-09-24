"use client";

import createCheckoutSession from "@/actions/orderFlow/createCheckoutSession";
import { Button } from "@/components/ui/shadcn/button";
import { useRouter } from "next/navigation";

interface PayButtonProps {
  orderId: string;
}

export default function PayButton({ orderId }: PayButtonProps) {
  const router = useRouter();

  const clickHandler = async () => {
    const { url } = await createCheckoutSession({ orderId });

    router.push(url);
  };

  return (
    <Button variant="default-active" className="w-fit h-fit max-sm:py-1" onClick={clickHandler}>
      Pay now
    </Button>
  );
}
