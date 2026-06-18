import { Loader2 } from "lucide-react";

import { TrackerListEmptyState } from "@/features/trackers/components/tracker-list-empty-state";
import { TrackerCard } from "@/features/trackers/components/tracker-card";
import type { Tracker } from "@/features/trackers/types";

type TrackerListProps = {
  allTrackerCount: number;
  hasActiveFilters: boolean;
  pendingTrackerIds: ReadonlySet<number>;
  trackers: Tracker[];
  onDelete: (tracker: Tracker) => void;
  onCreate: () => void;
  onEdit: (tracker: Tracker) => void;
  onLaunch: (tracker: Tracker) => void;
  onResetFilters: () => void;
};

export const TrackerList = ({
  allTrackerCount,
  hasActiveFilters,
  onCreate,
  onDelete,
  onEdit,
  onLaunch,
  onResetFilters,
  pendingTrackerIds,
  trackers,
}: TrackerListProps) => {
  if (trackers.length === 0) {
    return (
      <section>
        <TrackerListEmptyState
          hasActiveFilters={hasActiveFilters}
          hasTrackers={allTrackerCount > 0}
          onCreate={onCreate}
          onResetFilters={onResetFilters}
        />
      </section>
    );
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {trackers.map((tracker) => {
        const isPending = pendingTrackerIds.has(tracker.id);

        return (
          <div className="relative" key={tracker.id}>
            <TrackerCard
              launchPending={isPending}
              onDelete={onDelete}
              onEdit={onEdit}
              onLaunch={onLaunch}
              tracker={tracker}
            />
            {isPending ? (
              <div
                aria-live="polite"
                className="border-accent/60 bg-background/70 absolute inset-0 grid place-items-center rounded-lg border-2 backdrop-blur-sm"
                role="status"
              >
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="text-accent h-6 w-6 animate-spin" />
                  <span className="font-display text-accent text-[9px] tracking-wider uppercase">
                    Syncing
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </section>
  );
};
