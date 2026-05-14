import type { ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

type StatCardProps = {
  icon: ReactNode;
  label: string;
  small?: boolean;
  tone: "pink" | "cyan" | "amber";
  value: string | number;
};

export function StatCard({ icon, label, small, tone, value }: StatCardProps) {
  const toneClass =
    tone === "pink"
      ? "text-primary"
      : tone === "cyan"
        ? "text-accent"
        : "text-neon-amber";

  return (
    <div className="min-w-[90px] rounded-md border border-border bg-background/50 p-3">
      <div
        className={`flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider ${toneClass}`}
      >
        {icon} {label}
      </div>
      <div
        className={cn(
          "mt-1.5 truncate font-display",
          small ? "text-xs" : "text-xl",
        )}
        title={String(value)}
      >
        {value}
      </div>
    </div>
  );
}
