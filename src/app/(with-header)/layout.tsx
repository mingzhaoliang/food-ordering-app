import MainHeader from "@/components/header/main-header";
import { CartProvider } from "@/lib/store/context/cart.context";

export const experimental_ppr = true;

export default function MainLayout({
  children,
  auth,
  orderFlow,
}: {
  children: React.ReactNode;
  auth: React.ReactNode;
  orderFlow: React.ReactNode;
}) {
  return (
    <CartProvider>
      <MainHeader />
      {children}
      {auth}
      {orderFlow}
    </CartProvider>
  );
}
