"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type FilterOption<T extends string = string> = {
  value: T;
  label: string;
  icon?: ReactNode;
};

type FilterChipsProps<T extends string = string> = {
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

export function FilterChips<T extends string = string>({
  options,
  value,
  onChange,
  className,
}: FilterChipsProps<T>) {
  return (
    <div
      className={cn(
        "no-scrollbar flex gap-2 overflow-x-auto pb-0.5",
        className,
      )}
    >
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition-colors md:rounded-full md:py-1.5",
              active
                ? "bg-primary border-primary text-white"
                : "border-primary/20 bg-card text-primary hover:border-primary/50",
            )}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
