import { Loader2 } from "lucide-react";

import { EmptyState } from "@/features/dashboard/components/empty-state";
import { TrackerCard } from "@/features/dashboard/components/tracker-card";
import type { Tracker } from "@/features/dashboard/types";

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
        <EmptyState hasTrackers={allTrackerCount > 0} onCreate={onCreate} />
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
            <div className="absolute inset-0 grid place-items-center rounded-lg border-2 border-accent/60 bg-background/70 backdrop-blur-sm">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          ) : null}
        </div>
      ))}
    </section>
  );
}
