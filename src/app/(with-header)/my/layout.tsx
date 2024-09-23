import LinkIcon from "@/components/ui/link-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/shadcn/avatar";
import Sidebar from "@/components/ui/sidebar";
import { validateRequest } from "@/lib/lucia/auth";
import { getProfile } from "@/services/mongoose/my/profile.dal";
import { BadgeDollarSign, Settings, ShoppingBag, User2Icon } from "lucide-react";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { user } = await validateRequest();
  const profile = user && (await getProfile());

  const sidebarItems = [
    {
      props: {
        href: "/my/profile",
        isImage: true,
      },
      render: (
        <Avatar className="w-full h-full">
          {profile && <AvatarImage src={profile.avatar ? profile.avatar.imageUrl : ""} alt="avatar" />}
          <AvatarFallback>
            {profile ? profile.firstName[0].toUpperCase() : <User2Icon className="w-6 h-6" />}
          </AvatarFallback>
        </Avatar>
      ),
    },
    {
      props: { href: "/my/cart" },
      render: <ShoppingBag />,
    },
    {
      props: { href: "/my/orders" },
      render: <BadgeDollarSign />,
    },
  ];

  user && sidebarItems.push({ props: { href: "/my/settings" }, render: <Settings /> });

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
