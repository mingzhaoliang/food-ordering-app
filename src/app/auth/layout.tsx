import defaultBackground from "@/assets/images/default-background.jpg";
import Background from "@/components/ui/background";
import { getRestaurant } from "@/services/mongoose/store/restaurant.dal";
import Link from "next/link";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { name } = await getRestaurant();

  return (
    <div className="relative w-screen min-h-screen bg-cover bg-center flex max-lg:flex-center">
      <Background src={defaultBackground} />
      <div className="m-4 w-full max-w-104 sm:max-w-112 lg:max-w-120 2xl:max-w-128 rounded-3xl p-8 sm:p-12 bg-white/80">
        <div className="max-xs:mb-6 mb-10 font-lato space-y-1">
          <h1 className="max-xs:text-2xl text-3xl">Welcome to</h1>
          <h1 className="font-semibold max-xs:text-4xl text-5xl text-emerald-400 hover:text-emerald-300 transition-colors">
            <Link href="/">{name}</Link>
          </h1>
        </div>
        {children}
      </div>
    </div>
  );
}
