import googleG from "@/assets/icons/google-g.svg";
import { Button } from "@/components/ui/shadcn/button";
import dynamic from "next/dynamic";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "../ui/shadcn/skeleton";

const Fallback = () => (
  <div className="space-y-6">
    <Skeleton className="w-full h-10" />
    <Skeleton className="w-full h-10" />
    <Skeleton className="w-full h-10" />
  </div>
);

const SigninForm = dynamic(() => import("./signin-form"), { loading: Fallback });
const SignupForm = dynamic(() => import("./signup-form"), { loading: Fallback });

export default function AuthFlow({ searchParams }: { searchParams: { [key: string]: string } }) {
  const headerList = headers();
  const callbackUrl = headerList.get("referer")?.replace(process.env.BASE_URL!, "") ?? "/";

  const mode = (searchParams.mode ?? "signin") as "signin" | "signup";

  return (
    <div className="flex-col-center gap-2 max-xs:text-sm">
      {mode === "signin" ? <SigninForm callbackUrl={callbackUrl} /> : <SignupForm />}

      <div className="relative w-full flex py-3 items-center">
        <div className="flex-grow border-t border-stone-300" />
        <p className="px-4 text-stone-500">or</p>
        <div className="flex-grow border-t border-stone-300" />
      </div>
      <div className="flex w-full flex-col gap-2">
        <Button variant="outline" asChild>
          <a href={`/api/auth/signin/google?callbackUrl=${callbackUrl}`}>
            <Image src={googleG} alt="Google" width={30} height={30} />
            Continue with Google
          </a>
        </Button>
      </div>

      <div className="pt-4 text-sm text-stone-500">
        {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
        <Link
          href={`/auth?mode=${mode === "signin" ? "signup" : "signin"}`}
          className="text-teal-600 hover:underline"
          replace
        >
          {mode === "signin" ? "Create an account" : "Sign in"}
        </Link>
      </div>
    </div>
  );
}
