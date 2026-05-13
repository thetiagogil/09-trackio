import Link, { type LinkProps } from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

type ButtonStyleProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonStyleProps;

type ButtonLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  ButtonStyleProps & {
    children: ReactNode;
  };

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-primary bg-primary text-primary-foreground shadow-sm hover:border-primary hover:bg-primary hover:shadow-primary",
  secondary:
    "border-border bg-card text-foreground shadow-sm hover:border-accent hover:bg-surface-elevated",
  outline:
    "border-accent bg-background text-foreground shadow-sm hover:border-accent hover:bg-accent hover:text-accent-foreground hover:shadow-neon-cyan",
  ghost:
    "border-transparent bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
  danger:
    "border-destructive bg-destructive text-destructive-foreground shadow-sm hover:border-destructive hover:bg-primary",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[10px]",
  md: "h-9 px-4 text-[10px]",
  lg: "h-10 px-6 text-[10px]",
  icon: "h-9 w-9 p-0",
};

export function buttonVariants({
  className,
  size = "md",
  variant = "primary",
}: ButtonStyleProps & { className?: string } = {}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md border font-display uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:saturate-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    variants[variant],
    sizes[size],
    className,
  );
}

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
      className={buttonVariants({ className, size, variant })}
      {...props}
    />
  );
}

export function ButtonLink({
  className,
  size = "md",
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={buttonVariants({ className, size, variant })} {...props} />
  );
}
