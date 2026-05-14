"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/utils/cn";

type ProgressBarSize = "sm" | "md";

type ProgressBarProps = ComponentPropsWithoutRef<
  typeof ProgressPrimitive.Root
> & {
  size?: ProgressBarSize;
  value: number;
};

const sizes: Record<ProgressBarSize, string> = {
  md: "h-2",
  sm: "h-1.5",
};

export function ProgressBar({
  className,
  size = "md",
  value,
  ...props
}: ProgressBarProps) {
  const boundedValue = Math.max(0, Math.min(100, value));

  return (
    <ProgressPrimitive.Root
      className={cn(
        "w-full overflow-hidden rounded-full border border-border bg-surface-elevated",
        sizes[size],
        className,
      )}
      max={100}
      value={boundedValue}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full bg-linear-to-r from-primary via-accent to-primary transition-transform"
        style={{
          backgroundSize: "200% 100%",
          transform: `translateX(-${100 - boundedValue}%)`,
        }}
      />
    </ProgressPrimitive.Root>
  );
}
