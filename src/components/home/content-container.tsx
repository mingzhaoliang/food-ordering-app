import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { Button } from "../ui/shadcn/button";

interface ContentContainerProps {
  title: string;
  description: string;
  buttonName: string;
  href: string;
  content: JSX.Element;
  reverse?: boolean;
}

export default function ContentContainer({
  title,
  description,
  buttonName,
  href,
  content,
  reverse,
}: ContentContainerProps) {
  return (
    <div
      className={cn(
        "grid grid-areas-container grid-cols-container lg:grid-cols-container-lg lg:grid-rows-container-lg gap-y-6 lg:gap-x-16",
        reverse ? "lg:grid-areas-container-lg-reverse" : "lg:grid-areas-container-lg"
      )}
    >
      <h1 className="heading-1 grid-in-title">{title}</h1>
      <p className="grid-in-description body-2 text-justify tracking-wide leading-relaxed lg:leading-loose 2xl:leading-loose">
        {description}
      </p>
      <Button variant="default-active" className={"w-fit h-fit grid-in-button"} asChild>
        <Link href={href}>{buttonName}</Link>
      </Button>
      <div className="grid-in-content">{content}</div>
    </div>
  );
}
