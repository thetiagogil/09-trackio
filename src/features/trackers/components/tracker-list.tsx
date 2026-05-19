import { Loader2 } from "lucide-react";

import { TrackerListEmptyState } from "@/features/trackers/components/tracker-list-empty-state";
import { TrackerCard } from "@/features/trackers/components/tracker-card";
import type { Tracker } from "@/features/trackers/types";

type TrackerListProps = {
  allTrackerCount: number;
  pendingTrackerId: number | null;
  trackers: Tracker[];
  onArchive: (tracker: Tracker) => void;
  onCreate: () => void;
  onEdit: (tracker: Tracker) => void;
  onLaunch: (tracker: Tracker) => void;
};

export function TrackerList({
  allTrackerCount,
  onArchive,
  onCreate,
  onEdit,
  onLaunch,
  pendingTrackerId,
  trackers,
}: TrackerListProps) {
  if (trackers.length === 0) {
    return (
      <section>
        <TrackerListEmptyState
          hasTrackers={allTrackerCount > 0}
          onCreate={onCreate}
        />
      </section>
    );
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {trackers.map((tracker) => (
        <div className="relative" key={tracker.id}>
          <TrackerCard
            onArchive={onArchive}
            onEdit={onEdit}
            onLaunch={onLaunch}
            tracker={tracker}
          />
          {pendingTrackerId === tracker.id ? (
            <div className="border-accent/60 bg-background/70 absolute inset-0 grid place-items-center rounded-lg border-2 backdrop-blur-sm">
              <Loader2 className="text-accent h-6 w-6 animate-spin" />
            </div>
          ) : null}
        </div>
      ))}
    </section>
  );
}
