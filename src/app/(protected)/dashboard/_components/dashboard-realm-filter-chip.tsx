import type { ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

type DashboardRealmFilterChipProps = {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
};

export const DashboardRealmFilterChip = ({
  active,
  children,
  onClick,
}: DashboardRealmFilterChipProps) => {
  return (
    <button
      aria-pressed={active}
      className={cn(
        "focus-visible:ring-ring rounded-sm border-2 px-3 py-1.5 font-mono text-[11px] tracking-wider uppercase transition-all focus-visible:ring-1 focus-visible:outline-none",
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
};
