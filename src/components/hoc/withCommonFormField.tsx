"use client";

import { cn } from "@/lib/utils/cn";
import dynamic from "next/dynamic";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormMessage } from "../ui/shadcn/form";

const FormLabel = dynamic(() => import("../ui/shadcn/form").then((mod) => mod.FormLabel));
const FormDescription = dynamic(() => import("../ui/shadcn/form").then((mod) => mod.FormDescription));

export interface WithCommonFormFieldProps {
  name: string;
  label: string;
  required?: boolean;
  description?: string;
  errorMessages?: string[];
  hideLabel?: boolean;
  itemClassName?: string;
}

export default function withCommonFormField<T extends object>(WrappedComponent: React.ComponentType<T>) {
  return function WithCommonFormField({
    name,
    label,
    required,
    description,
    errorMessages,
    hideLabel,
    itemClassName,
    ...props
  }: WithCommonFormFieldProps & Omit<T, "field">) {
    const { control } = useFormContext();
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={itemClassName}>
            {!hideLabel && (
              <FormLabel
                className={cn(
                  "pl-1 lg:text-base text-stone-500",
                  required ? "after:content-['*'] after:ml-0.5 after:text-destructive" : ""
                )}
                htmlFor={name}
              >
                {label}
              </FormLabel>
            )}
            <WrappedComponent {...(props as T)} field={field} />
            {description && <FormDescription className="pl-1">{description}</FormDescription>}
            <FormMessage data-testid={`form-message-${name}`} className="text-xs pl-1">
              {errorMessages?.map((m) => (
                <span key={m}>
                  {errorMessages.length > 1 ? <li role="alert">{m}</li> : <span role="alert">{m}</span>}
                </span>
              )) ?? <span className="inline-block h-3" />}
            </FormMessage>
          </FormItem>
        )}
      />
    );
  };
}
