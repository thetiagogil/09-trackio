import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type CategoryChipProps = {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
};

export function CategoryChip({
  active,
  children,
  onClick,
}: CategoryChipProps) {
  return (
    <button
      className={cn(
        "rounded-sm border-2 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all",
        active
          ? "border-accent bg-accent text-accent-foreground shadow-neon-cyan"
          : "border-border bg-card hover:border-accent/50",
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
