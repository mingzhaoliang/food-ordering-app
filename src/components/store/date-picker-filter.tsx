"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/shadcn/button";
import { Calendar } from "@/components/ui/shadcn/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/shadcn/popover";
import { cn } from "@/lib/utils/cn";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DatePickerFilterProps<T extends Record<string, any>> {
  queryKey?: keyof T;
  searchParams: T;
  basePath: string;
  urlExcludedParams?: keyof T | (keyof T)[];
}

export default function DatePickerFilter<T extends Record<string, any>>({
  queryKey = "date",
  searchParams,
  basePath,
  urlExcludedParams,
}: DatePickerFilterProps<T>) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const router = useRouter();

  const dateChangeHandler = (date: Date | undefined) => {
    setDate(date);
    setOpen(false);

    const newSearchParams = { ...searchParams };
    if (urlExcludedParams) {
      const excludedParams = Array.isArray(urlExcludedParams) ? urlExcludedParams : [urlExcludedParams];
      excludedParams.forEach((param) => delete newSearchParams[param]);
    }
    if (!date) {
      newSearchParams[queryKey] = "all" as T[keyof T];
    } else {
      newSearchParams[queryKey] = date.getTime() as T[keyof T];
    }
    router.push(`${basePath}?${new URLSearchParams(newSearchParams).toString()}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={dateChangeHandler} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
