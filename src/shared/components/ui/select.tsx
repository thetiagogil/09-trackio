"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, X } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/utils/cn";

export type SelectOption = {
  disabled?: boolean;
  label: string;
  value: string;
};

type SelectProps = Omit<
  ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
  "onChange" | "value"
> & {
  name?: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  value: string;
  wrapperClassName?: string;
};

export function Select({
  className,
  disabled,
  id,
  name,
  onValueChange,
  options,
  placeholder = "Select...",
  value,
  wrapperClassName,
  ...props
}: SelectProps) {
  const hasValue = value.length > 0;

  return (
    <span className={cn("relative block", wrapperClassName)}>
      <SelectPrimitive.Root
        disabled={disabled}
        name={name}
        onValueChange={onValueChange}
        value={value}
      >
        <SelectPrimitive.Trigger
          className={cn(
            "flex h-9 w-full items-center justify-between gap-3 rounded-md border-2 border-border bg-background/50 py-1 pl-3 pr-10 font-mono text-sm text-foreground shadow-sm transition-colors focus-visible:border-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:saturate-50 data-[placeholder]:text-muted-foreground",
            hasValue && "pr-16",
            className,
          )}
          id={id}
          {...props}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="h-4 w-4 text-accent" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="z-50 max-h-56 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border-2 border-accent/60 bg-popover text-popover-foreground shadow-accent"
            position="popper"
            sideOffset={6}
          >
            <SelectPrimitive.Viewport className="p-1">
              {options.map((option) => (
                <SelectPrimitive.Item
                  className={cn(
                    "relative flex cursor-default select-none items-center rounded-sm py-2 pl-2 pr-8 font-mono text-xs outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:text-muted-foreground",
                    option.value === value && "text-accent",
                  )}
                  disabled={option.disabled}
                  key={option.value}
                  value={option.value}
                >
                  <SelectPrimitive.ItemText>
                    {option.label}
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="absolute right-2 inline-flex items-center justify-center">
                    <Check className="h-4 w-4" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>

      {hasValue ? (
        <button
          aria-label="Clear selected option"
          className="absolute right-8 top-1/2 z-10 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:saturate-50"
          disabled={disabled}
          onClick={() => onValueChange("")}
          type="button"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </span>
  );
}
