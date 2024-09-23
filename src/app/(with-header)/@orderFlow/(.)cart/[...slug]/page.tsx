import CheckoutForm from "@/components/orderFlow/checkout/checkout-form";
import BackButton from "@/components/ui/back-button";
import Modal from "@/components/ui/modal";
import { Separator } from "@/components/ui/shadcn/separator";
import { validateRequest } from "@/lib/lucia/auth";
import { getProfile } from "@/services/mongoose/my/profile.dal";
import { getCart } from "@/services/mongoose/orderFlow/cart.dal";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { slug: string[] } }) {
  const { slug } = params;

  switch (slug[0]) {
    case "checkout":
      return <CheckoutPage />;
    default:
      return null;
  }
}

const CheckoutPage = async () => {
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
    <Modal
      disableEscape
      className="w-full max-sm:max-w-96 sm:w-3/4 lg:w-3/5 2xl:w-1/2 h-[40rem] bg-stone-50 !no-scrollbar"
    >
      <div className="px-2 sm:px-4 flex flex-col bg-stone-50">
        <div className="sticky top-0 pt-2 sm:pt-4 z-40 bg-stone-50/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <BackButton variant="secondary" size="icon">
              <ArrowLeft className="size-icon-1" />
            </BackButton>
            <h3 className="heading-3">Delivery details</h3>
          </div>
          <Separator className="my-3" />
        </div>
        <CheckoutForm
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          freeDeliveryThreshold={freeDeliveryThreshold}
          {...profile}
        />
      </div>
    </Modal>
  );
};
