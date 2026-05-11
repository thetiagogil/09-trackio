import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-primary bg-primary text-primary-foreground hover:shadow-neon-pink",
  secondary:
    "border-border bg-surface-elevated text-foreground hover:border-accent/70 hover:text-accent",
  ghost:
    "border-transparent bg-transparent text-muted-foreground hover:bg-surface-elevated hover:text-foreground",
  danger:
    "border-destructive/60 bg-destructive/10 text-destructive hover:border-destructive hover:bg-destructive/20",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[11px]",
  md: "h-10 px-4 text-xs",
  lg: "h-11 px-5 text-xs",
  icon: "h-9 w-9 p-0",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-sm border-2 font-display uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-55",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
