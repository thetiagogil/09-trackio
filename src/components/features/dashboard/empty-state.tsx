import { Plus, Zap } from "lucide-react";

import { HudCard } from "@/components/features/dashboard/hud-card";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  hasTrackers: boolean;
  onCreate: () => void;
};

export function EmptyState({ hasTrackers, onCreate }: EmptyStateProps) {
  return (
    <HudCard className="items-center justify-center border-rarity-common/40 py-20 text-center text-rarity-common">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md border-2 border-current/40 bg-surface-elevated">
        <Zap className="h-6 w-6 text-accent" />
      </div>
      <h3 className="mb-2 font-display text-base uppercase text-glow-primary">
        No trackers found
      </h3>
      <p className="mb-6 font-mono text-sm text-muted-foreground">
        {hasTrackers
          ? "Try a different realm or search."
          : "Begin your directory - add your first tracker."}
      </p>
      {!hasTrackers ? (
        <Button onClick={onCreate}>
          <Plus className="h-4 w-4" />
          Add Tracker
        </Button>
      ) : null}
    </HudCard>
  );
}
