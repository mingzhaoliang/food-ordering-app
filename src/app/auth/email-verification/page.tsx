import EmailVerificationForm from "@/components/auth/email-verification-form";
import { validateRequest } from "@/lib/lucia/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await validateRequest();

  if (!user) redirect("/auth");

  if (user.emailVerified) redirect("/");

  return (
    <div className="max-lg:py-8 py-12">
      <EmailVerificationForm email={user.email} />
    </div>
  );
}
