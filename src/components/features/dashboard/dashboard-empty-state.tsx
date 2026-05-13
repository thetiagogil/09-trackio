import { Plus, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";

type DashboardEmptyStateProps = {
  hasTrackers: boolean;
  onCreate: () => void;
};

export function DashboardEmptyState({
  hasTrackers,
  onCreate,
}: DashboardEmptyStateProps) {
  return (
    <div className="rounded-lg border-2 border-dashed border-border py-24 text-center">
      <Zap className="mx-auto mb-4 h-10 w-10 text-accent" />
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
    </div>
  );
}
