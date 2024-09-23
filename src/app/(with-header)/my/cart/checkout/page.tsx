import CheckoutForm from "@/components/orderFlow/checkout/checkout-form";
import { Separator } from "@/components/ui/shadcn/separator";
import { validateRequest } from "@/lib/lucia/auth";
import { getProfile } from "@/services/mongoose/my/profile.dal";
import { getCart } from "@/services/mongoose/orderFlow/cart.dal";
import { redirect } from "next/navigation";

export default async function Page() {
  const cart = await getCart();
  if (!cart) redirect("/cart");
  const { subtotal, deliveryFee, freeDeliveryThreshold } = cart;

  const { user } = await validateRequest();

  let profile = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    postcode: "",
  };

  if (user) {
    profile = {
      ...profile,
      ...(await getProfile()),
    };
  }

  return (
    <div className="bg-white rounded-3xl p-6 space-y-4 lg:space-y-6 h-full flex flex-col">
      <h3 className="heading-3">Delivery details</h3>
      <Separator className="my-3" />
      <CheckoutForm
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        freeDeliveryThreshold={freeDeliveryThreshold}
        {...profile}
      />
    </div>
  );
}
