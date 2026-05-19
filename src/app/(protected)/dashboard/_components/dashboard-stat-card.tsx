import type { ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

type DashboardStatCardProps = {
  icon: ReactNode;
  label: string;
  small?: boolean;
  tone: "pink" | "cyan" | "amber";
  value: string | number;
};

export function DashboardStatCard({
  icon,
  label,
  small,
  tone,
  value,
}: DashboardStatCardProps) {
  const toneClass =
    tone === "pink"
      ? "text-primary"
      : tone === "cyan"
        ? "text-accent"
        : "text-neon-amber";

  return (
    <div className="border-border bg-background/50 min-w-[90px] rounded-md border p-3">
      <div
        className={`flex items-center gap-1 font-mono text-[9px] tracking-wider uppercase ${toneClass}`}
      >
        {icon} {label}
      </div>
      <div
        className={cn(
          "font-display mt-1.5 truncate",
          small ? "text-xs" : "text-xl",
        )}
        title={String(value)}
      >
        {value}
      </div>
    </div>
  );
}
