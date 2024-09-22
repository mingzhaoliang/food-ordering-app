"use client";

import withCommonFormField from "@/components/hoc/withCommonFormField";
import { cn } from "@/lib/utils/cn";
import { PopoverAnchor } from "@radix-ui/react-popover";
import { Command as CommandPrimitive } from "cmdk";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { ControllerRenderProps, FieldValues, useFormContext } from "react-hook-form";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "../shadcn/command";
import { FormControl } from "../shadcn/form";
import { Input, InputProps } from "../shadcn/input";
import { Popover, PopoverContent } from "../shadcn/popover";
import { Separator } from "../shadcn/separator";

export interface AutocompleteOption {
  key: string;
  label: string;
  value: string;
  description?: string;
}

type AutocompleteProps<T extends AutocompleteOption> = InputProps & {
  field: ControllerRenderProps<FieldValues, string>;
  options: T[];
  loading?: boolean;
  emptyMessage?: string;
  disableFilter?: boolean;
  onSelectOption?: (value: T) => void;
  container?: Element | null;
};

const FormAutocomplete = withCommonFormField(
  <T extends AutocompleteOption>({
    field,
    options,
    loading,
    emptyMessage,
    disableFilter,
    onSelectOption,
    container,
    ...props
  }: AutocompleteProps<T>) => {
    const [open, setOpen] = useState(false);
    const { setValue, formState } = useFormContext();

    const onInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      if (!event.relatedTarget?.hasAttribute("cmdk-list")) {
        setOpen(false);
      }
    };

    const selectHandler = (option: T) => {
      setValue(field.name, option.value);
      onSelectOption?.(option);
      setOpen(false);
    };

    return (
      <Popover open={open}>
        <Command className="overflow-visible h-fit" shouldFilter={!disableFilter}>
          <PopoverAnchor asChild>
            <CommandPrimitive.Input asChild onFocus={() => setOpen(true)} onBlur={onInputBlur}>
              <FormControl>
                <Input data-testid={field.name} id={field.name} {...field} {...props} />
              </FormControl>
            </CommandPrimitive.Input>
          </PopoverAnchor>
          <PopoverContent
            container={container}
            asChild
            onOpenAutoFocus={(e) => e.preventDefault()}
            className={cn("w-[--radix-popover-trigger-width] p-0", formState.isDirty ? "" : "hidden")}
          >
            <CommandList>
              {loading && (
                <CommandPrimitive.Loading>
                  <LoaderCircle className="mx-auto my-6 animate-spin" />
                </CommandPrimitive.Loading>
              )}
              {!loading && options.length === 0 && <CommandEmpty>{emptyMessage ?? "No items found."}</CommandEmpty>}
              {!loading && options?.length > 0 && (
                <CommandGroup>
                  {options.map((option, index) => (
                    <div key={option.key}>
                      {index > 0 && <Separator />}
                      <CommandItem value={option.value} onSelect={() => selectHandler(option)}>
                        <div>
                          <p className="font-medium">{option.label}</p>
                          <p className="text-fade">{option.description}</p>
                        </div>
                      </CommandItem>
                    </div>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
    );
  }
);

export default FormAutocomplete;
