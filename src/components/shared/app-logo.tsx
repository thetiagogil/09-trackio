import Link from "next/link";

import { cn } from "@/lib/cn";

type AppLogoProps = {
  className?: string;
  href?: string;
  size?: "sm" | "md" | "lg";
};

export function AppLogo({ className, href, size = "md" }: AppLogoProps) {
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
      <span className="text-glow-accent">TRACKERS</span>
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
