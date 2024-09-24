import SignoutForm from "@/components/my/settings/signout-form";
import UpdatePassword from "@/components/my/settings/update-password";
import { validateRequest } from "@/lib/lucia/auth";
import { getUser } from "@/services/mongoose/auth/user.dal";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/auth");
  }

  const existingUser = await getUser({ _id: user.id });

  return (
    <>
      <div className="bg-white rounded-3xl max-sm:p-6 p-8 max-lg:space-y-4 space-y-6">
        <h2 className="font-medium max-lg:text-2xl max-2xl:text-3xl text-4xl tracking-wide">Settings</h2>
        <UpdatePassword hasCurrentPassword={!!existingUser.passwordHash} />
      </div>
      <SignoutForm />
    </>
  );
}
