import { Plus } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";

type TrackerListEmptyStateProps = {
  hasActiveFilters: boolean;
  hasTrackers: boolean;
  onCreate: () => void;
  onResetFilters: () => void;
};

export function TrackerListEmptyState({
  hasActiveFilters,
  hasTrackers,
  onCreate,
  onResetFilters,
}: TrackerListEmptyStateProps) {
  const title = hasTrackers ? "No matches found" : "No trackers yet";
  const body = hasTrackers
    ? "No active tracker matches the current search or realm."
    : "Add your first tracker.";

  return (
    <Card
      as="article"
      className="flex min-h-80 items-center justify-center p-6 text-center"
    >
      <div className="flex max-w-xs flex-col items-center">
        <div className="border-accent/40 bg-surface-elevated mb-4 flex h-12 w-12 items-center justify-center rounded-md border-2">
          <Plus className="text-accent h-6 w-6" />
        </div>
        <h3 className="font-display text-glow-primary mb-2 text-base uppercase">
          {title}
        </h3>
        <p className="text-muted-foreground mb-6 font-mono text-sm">{body}</p>
        {hasTrackers && hasActiveFilters ? (
          <Button onClick={onResetFilters} variant="outline">
            Reset filters
          </Button>
        ) : null}
        {!hasTrackers ? <Button onClick={onCreate}>Add Tracker</Button> : null}
      </div>
    </Card>
  );
}
