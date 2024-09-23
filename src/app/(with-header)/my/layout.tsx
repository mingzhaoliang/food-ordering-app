import LinkIcon from "@/components/ui/link-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/shadcn/avatar";
import Sidebar from "@/components/ui/sidebar";
import { validateRequest } from "@/lib/lucia/auth";
import { getProfile } from "@/services/mongoose/my/profile.dal";
import { BadgeDollarSign, Settings } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { user: currentUser } = await validateRequest();

  if (!currentUser) {
    redirect("/auth");
  }

  const profile = await getProfile();

  const sidebarItems = [
    {
      props: {
        href: "/my/profile",
        isImage: true,
      },
      render: (
        <Avatar className="w-full h-full">
          <AvatarImage src={profile.avatar ? profile.avatar.imageUrl : ""} alt="avatar" />
          <AvatarFallback>{profile.firstName[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      ),
    },
    {
      props: { href: "/my/orders" },
      render: <BadgeDollarSign />,
    },
    {
      props: { href: "/my/settings" },
      render: <Settings />,
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
