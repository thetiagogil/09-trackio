import { LayoutGrid, Target, Trophy } from "lucide-react";

import { StatCard } from "@/components/features/dashboard/stat-card";
import type { TrackerStats } from "@/types/trackio";

type SummaryProps = {
  playerLevel: {
    level: number;
    percent: number;
  };
  profileName: string;
  stats: TrackerStats;
};

export function Summary({
  playerLevel,
  profileName,
  stats,
}: SummaryProps) {
  return (
    <section className="relative mb-8 overflow-hidden rounded-lg border-2 border-primary/40 bg-card p-6 shadow-card">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10" />
      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            * {profileName}
          </div>
          <div className="flex items-end gap-4">
            <div className="font-display text-4xl leading-none text-glow-primary md:text-5xl">
              LV.{playerLevel.level}
            </div>
            <div className="pb-1 font-mono text-xs text-muted-foreground">
              {stats.totalXp.toLocaleString()} XP
            </div>
          </div>
          <div className="mt-3 w-full md:w-80">
            <div className="h-2 overflow-hidden rounded-full border border-border bg-surface-elevated">
              <div
                className="h-full bg-linear-to-r from-primary via-accent to-primary transition-all"
                style={{
                  backgroundSize: "200% 100%",
                  width: `${playerLevel.percent}%`,
                }}
              />
            </div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {playerLevel.percent}% to LV.{playerLevel.level + 1}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<Target className="h-3.5 w-3.5" />}
            label="Trackers"
            tone="pink"
            value={stats.totalTrackers}
          />
          <StatCard
            icon={<LayoutGrid className="h-3.5 w-3.5" />}
            label="Realms"
            tone="cyan"
            value={stats.categoryCount}
          />
          <StatCard
            icon={<Trophy className="h-3.5 w-3.5" />}
            label="Top"
            small
            tone="amber"
            value={stats.topTracker?.title ?? "-"}
          />
        </div>
      </div>
    </section>
  );
}
