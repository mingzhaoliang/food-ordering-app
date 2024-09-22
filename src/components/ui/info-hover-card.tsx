import { cn } from "@/lib/utils/cn";
import { HoverCardProps } from "@radix-ui/react-hover-card";
import { Info } from "lucide-react";
import { SVGProps } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./shadcn/hover-card";

interface InfoHoverCardProps extends HoverCardProps {
  cardContent: React.ComponentPropsWithoutRef<typeof HoverCardContent>;
  iconConfig?: SVGProps<SVGSVGElement>;
}

export function InfoHoverCard({ cardContent, iconConfig, openDelay, ...props }: InfoHoverCardProps) {
  const { side, ...cardContentProps } = cardContent;
  const { className, ...iconProps } = iconConfig || { className: "" };

  return (
    <HoverCard openDelay={openDelay ?? 100} {...props}>
      <HoverCardTrigger>
        <Info className={cn("w-5 h-5 text-fade", className)} {...iconProps} />
      </HoverCardTrigger>
      <HoverCardContent side={side ?? "top"} {...cardContentProps} />
    </HoverCard>
  );
}
