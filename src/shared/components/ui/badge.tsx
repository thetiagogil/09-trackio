import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/utils/cn";

type BadgeVariant = "accent" | "danger" | "default" | "primary" | "surface";

type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  variant?: BadgeVariant;
};

const variants: Record<BadgeVariant, string> = {
  accent: "border-accent/60 bg-background/50 text-accent",
  danger: "border-destructive/50 bg-destructive/10 text-destructive",
  default: "border-border bg-background/50 text-foreground",
  primary: "border-primary/50 bg-background/50 text-primary",
  surface: "border-border bg-surface-elevated text-foreground",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
