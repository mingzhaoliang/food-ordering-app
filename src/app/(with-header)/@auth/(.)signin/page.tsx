import AuthFlow from "@/components/auth/auth-flow";
import BackButton from "@/components/ui/back-button";
import Modal from "@/components/ui/modal";
import { validateRequest } from "@/lib/lucia/auth";
import { X } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }: { searchParams: { [key: string]: string } }) {
  const { user } = await validateRequest();

  if (user) {
    redirect("/");
  }

  return (
    <Modal disableEscape className="w-full max-w-96 lg:max-w-104 xl:max-w-112">
      <div className="p-6 sm:p-8 !h-fit">
        <div className="mb-8 self-start sm:space-y-1">
          <p className="ml-0.5 text-lg sm:text-xl">Sign in to</p>
          <h2 className="font-semibold text-3xl sm:text-4xl">Continue</h2>
        </div>
        <AuthFlow searchParams={searchParams} />
        <BackButton variant="plain" size="icon" className="absolute top-4 right-4 bg-white/80 shadow-none">
          <X className="size-icon-1" />
        </BackButton>
      </div>
    </Modal>
  );
}
