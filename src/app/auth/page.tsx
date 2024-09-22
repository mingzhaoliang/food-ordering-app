import AuthFlow from "@/components/auth/auth-flow";
import { validateRequest } from "@/lib/lucia/auth";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }: { searchParams: { [key: string]: string } }) {
  const { user } = await validateRequest();

  if (user) redirect("/");

  return <AuthFlow searchParams={searchParams} />;
}
