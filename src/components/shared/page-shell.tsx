import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/cn";

type PageShellProps = ComponentPropsWithoutRef<"div">;

type SiteHeaderProps = ComponentPropsWithoutRef<"header"> & {
  actions?: ReactNode;
  innerClassName?: string;
  leading?: ReactNode;
  sticky?: boolean;
};

type PageMainProps = ComponentPropsWithoutRef<"main"> & {
  constrained?: boolean;
};

type BrandMarkProps = {
  className?: string;
  href?: string;
  size?: "sm" | "md" | "lg";
};

export function PageShell({ className, ...props }: PageShellProps) {
  return (
    <div
      className={cn("flex min-h-screen flex-col scanline", className)}
      {...props}
    />
  );
}

export function SiteHeader({
  actions,
  className,
  innerClassName,
  leading,
  sticky,
  ...props
}: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "border-b-2 border-border/60 bg-background/40 backdrop-blur-sm",
        sticky && "sticky top-0 z-20",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5",
          innerClassName,
        )}
      >
        {leading ?? <BrandMark href="/" />}
        {actions ? (
          <nav className="flex items-center gap-2">{actions}</nav>
        ) : null}
      </div>
    </header>
  );
}

export function PageMain({
  children,
  className,
  constrained = true,
  ...props
}: PageMainProps) {
  return (
    <main
      className={cn(
        "w-full px-6",
        constrained && "mx-auto max-w-7xl",
        className,
      )}
      {...props}
    >
      {children}
    </main>
  );
}

export function BrandMark({ className, href, size = "md" }: BrandMarkProps) {
  const content = (
    <span
      className={cn(
        "font-display tracking-tight",
        size === "sm" && "text-xs",
        size === "md" && "text-sm md:text-base",
        size === "lg" && "text-xl leading-none md:text-2xl",
        className,
      )}
    >
      <span className="text-glow-primary">TRACKIO</span>
      <span className="mx-2 text-accent">x</span>
      <span className="text-glow-cyan">TRACKERS</span>
    </span>
  );

  if (!href) {
    return content;
  }

  return (
    <Link aria-label="Trackio home" href={href}>
      {content}
    </Link>
  );
}
