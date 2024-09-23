import Cart from "@/components/orderFlow/cart/cart";
import BackButton from "@/components/ui/back-button";
import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/shadcn/button";
import { Separator } from "@/components/ui/shadcn/separator";
import { getCart } from "@/services/mongoose/orderFlow/cart.dal";
import { X } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const cart = await getCart();

  let content = null;

  if (!cart || cart.items.length === 0) {
    content = (
      <Button variant="link" className="self-center" asChild>
        <Link href="/menu">Your cart is empty. Start ordering now!</Link>
      </Button>
    );
  } else {
    content = <Cart {...cart} isIntercepted />;
  }

  return (
    <Modal
      backdropClose
      className="w-full max-sm:max-w-96 sm:w-3/4 lg:w-3/5 2xl:w-1/2 h-[40rem] bg-stone-50 !no-scrollbar"
    >
      <div className="px-2 sm:px-4 flex flex-col bg-stone-50">
        <div className="sticky top-0 pt-2 sm:pt-4 z-40 bg-stone-50/80 backdrop-blur-sm">
          <h3 className="heading-3">Shopping Cart</h3>
          <Separator className="mt-3" />
          <BackButton variant="secondary" size="icon" className="absolute top-4 right-0">
            <X className="size-icon-1" />
          </BackButton>
        </div>
        {content}
      </div>
    </Modal>
  );
}
