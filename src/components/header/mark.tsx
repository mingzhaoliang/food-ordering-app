import logo from "@/assets/icons/logo.svg";
import { getRestaurant } from "@/services/mongoose/store/restaurant.dal";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default function Mark() {
  return (
    <Link href="/" draggable={false} className="flex-center gap-2">
      <div className="p-0.5 rounded-full animate-spin-medium border-2 border-slate-800">
        <div className="relative w-8 sm:w-10 lg:w-12 2xl:w-16 aspect-square rounded-full border border-slate-800">
          <Image src={logo} alt="Pizza" fill sizes="(min-width: 640px) 10vw, 20vw" className="p-1.5 -mt-0.5 ml-0.5" />
        </div>
      </div>
      <Suspense fallback={null}>
        <MarkName />
      </Suspense>
    </Link>
  );
}

const MarkName = async () => {
  const { name } = await getRestaurant();

  const words = name.split(" ");
  const lastWord = words.pop();
  const restWords = words.join(" ");

  return (
    <div className="font-portLligatSans font-semibold -space-y-1">
      <h1 className="text-base sm:text-lg lg:text-xl 2xl:text-2xl">{restWords}</h1>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl">{lastWord}</h1>
    </div>
  );
};
