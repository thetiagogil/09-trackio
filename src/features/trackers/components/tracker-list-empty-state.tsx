import { Plus } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";

type TrackerListEmptyStateProps = {
  hasTrackers: boolean;
  onCreate: () => void;
};

export function TrackerListEmptyState({
  hasTrackers,
  onCreate,
}: TrackerListEmptyStateProps) {
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
          No trackers found
        </h3>
        <p className="text-muted-foreground mb-6 font-mono text-sm">
          {hasTrackers
            ? "Try a different realm or search."
            : "Add your first tracker."}
        </p>
        {!hasTrackers ? (
          <Button onClick={onCreate}>
            <Plus className="h-4 w-4" />
            Add Tracker
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
