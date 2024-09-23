import Cart from "@/components/orderFlow/cart/cart";
import { Button } from "@/components/ui/shadcn/button";
import { Separator } from "@/components/ui/shadcn/separator";
import { getCart } from "@/services/mongoose/orderFlow/cart.dal";
import Link from "next/link";

export default async function Page() {
  const cart = await getCart();

  let content = null;

  if (!cart || cart.items.length === 0) {
    content = (
      <Button variant="link" className="!w-fit" asChild>
        <Link href="/menu">Your cart is empty. Start ordering now!</Link>
      </Button>
    );
  } else {
    content = <Cart {...cart} />;
  }

  return (
    <div className="bg-white rounded-3xl p-6 space-y-4 lg:space-y-6 h-full flex flex-col">
      <h3 className="heading-3">Shopping Cart</h3>
      <Separator className="my-2" />
      {content}
    </div>
  );
}
