"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/shadcn/alert-dialog";
import { AlertDialogProps } from "@radix-ui/react-alert-dialog";
import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";

interface WarningTriggerProps {
  title: string;
  description?: string;
  rootConfig?: AlertDialogProps;
  cancelConfig?: ButtonConfig;
  continueConfig?: ButtonConfig;
}

interface ButtonConfig extends Omit<React.ComponentPropsWithoutRef<"button">, "className"> {
  redirectUrl?: Url;
  text?: string;
}

// Helper function to handle conditional button content
const renderButton = ({ redirectUrl, text }: ButtonConfig, defaultText: string): React.ReactNode => {
  return redirectUrl ? <Link href={redirectUrl}>{text || defaultText}</Link> : text || defaultText;
};

export function WarningTrigger({
  children,
  title,
  description,
  rootConfig = {},
  cancelConfig = {},
  continueConfig = {},
}: React.PropsWithChildren<WarningTriggerProps>) {
  const { redirectUrl: cancelRedirectUrl, text: cancelText, ...cancelProps } = cancelConfig;
  const { redirectUrl: continueRedirectUrl, text: continueText, ...continueProps } = continueConfig;

  return (
    <AlertDialog {...rootConfig}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel {...cancelProps} className="rounded-md" asChild={!!cancelRedirectUrl}>
            {renderButton(cancelConfig, "Cancel")}
          </AlertDialogCancel>
          <AlertDialogAction {...continueProps} className="rounded-md" asChild={!!continueRedirectUrl}>
            {renderButton(continueConfig, "Continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
