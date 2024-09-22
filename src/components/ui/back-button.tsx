"use client";

import { useRouter } from "next/navigation";
import { Button, ButtonProps } from "./shadcn/button";

interface BackButtonProps extends Omit<ButtonProps, "onClick"> {}

export default function BackButton({ children, ...props }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button onClick={() => router.back()} {...props}>
      {children}
    </Button>
  );
}
