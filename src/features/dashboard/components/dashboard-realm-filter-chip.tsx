import type { ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

type DashboardRealmFilterChipProps = {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
};

export function DashboardRealmFilterChip({
  active,
  children,
  onClick,
}: DashboardRealmFilterChipProps) {
  return (
    <button
      className={cn(
        "rounded-sm border-2 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all",
        active
          ? "border-accent bg-accent text-accent-foreground shadow-accent"
          : "border-border bg-card hover:border-accent/50",
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
