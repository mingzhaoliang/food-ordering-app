import MainHeader from "@/components/header/main-header";
import { CartProvider } from "@/lib/store/context/cart.context";
import { getRestaurant } from "@/services/mongoose/store/restaurant.dal";

export const experimental_ppr = true;

export default async function MainLayout({
  children,
  auth,
  orderFlow,
}: {
  children: React.ReactNode;
  auth: React.ReactNode;
  orderFlow: React.ReactNode;
}) {
  const { name } = await getRestaurant();

  return (
    <CartProvider>
      <MainHeader name={name} />
      {children}
      {auth}
      {orderFlow}
    </CartProvider>
  );
}
