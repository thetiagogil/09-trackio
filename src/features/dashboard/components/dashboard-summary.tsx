import { LayoutGrid, Target, Trophy } from "lucide-react";

import { DashboardStatCard } from "@/features/dashboard/components/dashboard-stat-card";
import { Card } from "@/shared/components/ui/card";
import { ProgressBar } from "@/shared/components/ui/progress-bar";
import type { TrackerStats } from "@/features/dashboard/types";

type DashboardSummaryProps = {
  playerLevel: {
    level: number;
    percent: number;
  };
  profileName: string;
  stats: TrackerStats;
};

export function DashboardSummary({
  playerLevel,
  profileName,
  stats,
}: DashboardSummaryProps) {
  return (
    <Card as="section" className="mb-8 p-6" gradient tone="primary">
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
            <ProgressBar value={playerLevel.percent} />
            <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {playerLevel.percent}% to LV.{playerLevel.level + 1}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <DashboardStatCard
            icon={<Target className="h-3.5 w-3.5" />}
            label="Trackers"
            tone="pink"
            value={stats.totalTrackers}
          />
          <DashboardStatCard
            icon={<LayoutGrid className="h-3.5 w-3.5" />}
            label="Realms"
            tone="cyan"
            value={stats.categoryCount}
          />
          <DashboardStatCard
            icon={<Trophy className="h-3.5 w-3.5" />}
            label="Top"
            small
            tone="amber"
            value={stats.topTracker?.title ?? "-"}
          />
        </div>
      </div>
    </Card>
  );
}
