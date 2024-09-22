import { cn } from "@/lib/utils/cn";

interface SidebarProps extends React.ComponentPropsWithoutRef<"div"> {}

export default function Sidebar({ children, className, ...props }: SidebarProps) {
  return (
    <div
      className={cn(
        "sticky self-start top-20 sm:top-28 2xl:top-32 w-full sm:w-fit bg-white shadow rounded-3xl",
        "px-6 py-3 sm:px-4 sm:py-8 z-50",
        "flex sm:flex-col items-center sm:gap-8 justify-between",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
