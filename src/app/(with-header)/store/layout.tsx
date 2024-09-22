import LinkIcon from "@/components/ui/link-icon";
import Sidebar from "@/components/ui/sidebar";
import { validateRequest } from "@/lib/lucia/auth";
import { BadgeDollarSign, House, NotebookText } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { user } = await validateRequest();

  if (!user || !["admin", "superadmin"].includes(user.role)) {
    redirect("/");
  }

  const sidebarItems = [
    {
      props: { href: "/store" },
      render: <House />,
    },
    {
      props: { href: "/store/menu" },
      render: <NotebookText />,
    },
    {
      props: { href: "/store/orders" },
      render: <BadgeDollarSign />,
    },
  ];

  return (
    <div className="relative min-h-screen pt-28 sm:pt-32 px-5 sm:px-8 flex max-sm:flex-col gap-4 sm:gap-6 lg:gap-8 bg-stone-50">
      <Sidebar>
        {sidebarItems.map(({ props, render }) => (
          <LinkIcon key={props.href} {...props}>
            {render}
          </LinkIcon>
        ))}
      </Sidebar>
      <div className="flex-1">{children}</div>
    </div>
  );
}
