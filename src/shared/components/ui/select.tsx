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
  clearLabel?: string;
  clearable?: boolean;
  name?: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  value: string;
  wrapperClassName?: string;
};

export function Select({
  className,
  clearLabel = "Clear selected option",
  clearable = true,
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
            "border-border bg-background/50 text-foreground focus-visible:border-accent focus-visible:ring-ring data-placeholder:text-muted-foreground relative flex h-9 w-full items-center rounded-md border-2 py-1 pr-9 pl-3 text-left font-mono text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:saturate-50",
            clearable && hasValue && "pr-16",
            className,
          )}
          id={id}
          {...props}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="text-accent absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="border-accent/60 bg-popover text-popover-foreground shadow-accent z-50 max-h-56 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border-2"
            position="popper"
            sideOffset={6}
          >
            <SelectPrimitive.Viewport className="p-1">
              {options.map((option) => (
                <SelectPrimitive.Item
                  className={cn(
                    "focus:bg-accent focus:text-accent-foreground data-disabled:text-muted-foreground relative flex cursor-default items-center rounded-sm py-2 pr-8 pl-2 font-mono text-xs transition-colors outline-none select-none data-disabled:pointer-events-none",
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

      {clearable && hasValue ? (
        <button
          aria-label={clearLabel}
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring absolute top-1/2 right-8 z-10 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:saturate-50"
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
