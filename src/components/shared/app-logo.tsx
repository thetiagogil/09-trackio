import Link from "next/link";

import { cn } from "@/lib/cn";

type AppLogoProps = {
  href?: string;
};

export function AppLogo({ href }: AppLogoProps) {
  const content = (
    <span className={cn("font-display tracking-tight", "text-sm md:text-base")}>
      <span className="text-glow-primary">TRACKER</span>
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
