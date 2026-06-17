import Link from "next/link";

import { cn } from "@/shared/utils/cn";

type AppLogoProps = {
  href?: string;
};

export const AppLogo = ({ href }: AppLogoProps) => {
  const content = (
    <span className={cn("font-display tracking-tight", "text-sm md:text-base")}>
      <span className="text-glow-primary">TRACK</span>
      <span className="text-glow-accent">IO</span>
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
};
