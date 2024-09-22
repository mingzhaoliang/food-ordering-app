import MainHeader from "@/components/header/main-header";
import { getRestaurant } from "@/services/mongoose/store/restaurant.dal";

export const experimental_ppr = true;

export default async function MainLayout({ children, auth }: { children: React.ReactNode; auth: React.ReactNode }) {
  const { name } = await getRestaurant();

  return (
    <>
      <MainHeader name={name} />
      {children}
      {auth}
    </>
  );
}
