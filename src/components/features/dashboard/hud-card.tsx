import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type HudCardProps = {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
};

export function HudCard({
  children,
  className,
  interactive = false,
}: HudCardProps) {
  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-lg border-2 bg-card p-5 shadow-card transition-all",
        interactive && "hover:-translate-y-1",
        className,
      )}
    >
      <span className="absolute left-1.5 top-1.5 h-2 w-2 border-l-2 border-t-2 border-current opacity-60" />
      <span className="absolute right-1.5 top-1.5 h-2 w-2 border-r-2 border-t-2 border-current opacity-60" />
      <span className="absolute bottom-1.5 left-1.5 h-2 w-2 border-b-2 border-l-2 border-current opacity-60" />
      <span className="absolute bottom-1.5 right-1.5 h-2 w-2 border-b-2 border-r-2 border-current opacity-60" />

      {children}
    </article>
  );
}
