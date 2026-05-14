import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

type ProgressBarSize = "sm" | "md";

type ProgressBarProps = ComponentPropsWithoutRef<"div"> & {
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
    <div
      className={cn(
        "w-full overflow-hidden rounded-full border border-border bg-surface-elevated",
        sizes[size],
        className,
      )}
      {...props}
    >
      <div
        className="h-full bg-linear-to-r from-primary via-accent to-primary transition-all"
        style={{
          backgroundSize: "200% 100%",
          width: `${boundedValue}%`,
        }}
      />
    </div>
  );
}
