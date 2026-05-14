import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type EmptyStateProps = {
  hasTrackers: boolean;
  onCreate: () => void;
};

export function EmptyState({ hasTrackers, onCreate }: EmptyStateProps) {
  return (
    <Card
      as="article"
      className="flex min-h-80 items-center justify-center p-6 text-center"
    >
      <div className="flex max-w-xs flex-col items-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md border-2 border-accent/40 bg-surface-elevated">
          <Plus className="h-6 w-6 text-accent" />
        </div>
        <h3 className="mb-2 font-display text-base uppercase text-glow-primary">
          No trackers found
        </h3>
        <p className="mb-6 font-mono text-sm text-muted-foreground">
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
