"use client";

import { Loader2, LogOut, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { AppHeader } from "@/shared/components/layout/app-header";
import { AppLogo } from "@/shared/components/layout/app-logo";
import { AppMain } from "@/shared/components/layout/app-main";
import { AppShell } from "@/shared/components/layout/app-shell";
import { Button } from "@/shared/components/ui/button";
import { DashboardActionFeedback } from "@/features/dashboard/components/dashboard-action-feedback";
import { DashboardControls } from "@/features/dashboard/components/dashboard-controls";
import { DashboardSummary } from "@/features/dashboard/components/dashboard-summary";
import { TrackerForm } from "@/features/dashboard/components/tracker-form";
import { TrackerList } from "@/features/dashboard/components/tracker-list";
import {
  getDashboardCategories,
  getDashboardFilteredTrackers,
  getDashboardProfileName,
  getDashboardStats,
  getDashboardVisibleRealms,
} from "@/features/dashboard/lib/view-model";
import {
  archiveTrackerAction,
  createTrackerAction,
  recordTrackerClickAction,
  updateTrackerAction,
} from "@/features/dashboard/server/actions";
import { levelFromXp } from "@/features/dashboard/lib/trackers";
import type { Tracker, TrackerFormInput } from "@/features/dashboard/types";
import { signOutAction } from "@/shared/server/auth-actions";
import type { CurrentUser } from "@/shared/types";

type DashboardViewProps = {
  initialTrackers: Tracker[];
  currentUser: CurrentUser;
};

export function DashboardView({
  currentUser,
  initialTrackers,
}: DashboardViewProps) {
  const router = useRouter();
  const [trackers, setTrackers] = useState(initialTrackers);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Tracker | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [pendingTrackerId, setPendingTrackerId] = useState<number | null>(null);
  const [isTrackerPending, startTrackerTransition] = useTransition();
  const [isAuthPending, startAuthTransition] = useTransition();

  const profileName = getDashboardProfileName(currentUser);
  const categories = useMemo(
    () => getDashboardCategories(trackers),
    [trackers],
  );
  const visibleRealms = useMemo(
    () => getDashboardVisibleRealms(trackers),
    [trackers],
  );
  const activeCategory =
    visibleRealms.length > 1 && visibleRealms.includes(category)
      ? category
      : "all";
  const filteredTrackers = useMemo(
    () => getDashboardFilteredTrackers(trackers, query, activeCategory),
    [activeCategory, query, trackers],
  );
  const stats = useMemo(() => getDashboardStats(trackers), [trackers]);
  const playerLevel = levelFromXp(stats.totalXp);

  const openCreateForm = () => {
    setFeedback(null);
    setEditing(null);
    setFormOpen(true);
  };

  const openEditForm = (tracker: Tracker) => {
    setFeedback(null);
    setEditing(tracker);
    setFormOpen(true);
  };

  const closeForm = () => {
    if (isTrackerPending) return;

    setFormOpen(false);
    setEditing(null);
  };

  const submitTracker = (input: TrackerFormInput) => {
    setFeedback(null);

    startTrackerTransition(async () => {
      const result = editing
        ? await updateTrackerAction(editing.id, input)
        : await createTrackerAction(input);

      if (!result.ok) {
        setFeedback(result.error);
        return;
      }

      setTrackers((current) =>
        editing
          ? current.map((tracker) =>
              tracker.id === result.data.id ? result.data : tracker,
            )
          : [result.data, ...current],
      );
      setFormOpen(false);
      setEditing(null);
      router.refresh();
    });
  };

  const archiveTracker = (tracker: Tracker) => {
    if (!window.confirm(`Archive ${tracker.title}?`)) {
      return;
    }

    setFeedback(null);
    setPendingTrackerId(tracker.id);

    startTrackerTransition(async () => {
      const result = await archiveTrackerAction(tracker.id);
      setPendingTrackerId(null);

      if (!result.ok) {
        setFeedback(result.error);
        return;
      }

      setTrackers((current) =>
        current.filter((item) => item.id !== result.data.id),
      );
      router.refresh();
    });
  };

  const launchTracker = (tracker: Tracker) => {
    const previousTrackers = trackers;
    const optimisticTracker: Tracker = {
      ...tracker,
      xp: tracker.xp + 1,
      clickCount: tracker.clickCount + 1,
      lastClickedAt: new Date().toISOString(),
    };

    setTrackers((current) =>
      current.map((item) =>
        item.id === tracker.id ? optimisticTracker : item,
      ),
    );

    startTrackerTransition(async () => {
      const result = await recordTrackerClickAction(tracker.id);

      if (!result.ok) {
        setTrackers(previousTrackers);
        setFeedback(result.error);
        return;
      }

      setTrackers((current) =>
        current.map((item) =>
          item.id === result.data.id ? result.data : item,
        ),
      );
      router.refresh();
    });
  };

  const signOut = () => {
    startAuthTransition(async () => {
      const result = await signOutAction();

      if (!result.ok) {
        setFeedback(result.error);
        return;
      }

      router.replace("/");
      router.refresh();
    });
  };

  return (
    <AppShell>
      <AppHeader
        innerClassName="flex-wrap"
        leading={
          <div>
            <AppLogo />
          </div>
        }
        actions={
          <>
            <div className="mr-2 hidden flex-col items-end sm:flex">
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                signed in
              </span>
              <span className="max-w-44 truncate font-display text-[11px] text-glow-accent">
                {profileName}
              </span>
            </div>
            <Button onClick={openCreateForm} size="lg">
              <Plus className="h-4 w-4" />
              New Tracker
            </Button>
            <Button
              aria-label="Sign out"
              disabled={isAuthPending}
              onClick={signOut}
              size="lg"
              title="Sign out"
              variant="outline"
            >
              {isAuthPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
            </Button>
          </>
        }
      />

      <AppMain className="pb-8">
        <DashboardSummary
          playerLevel={playerLevel}
          profileName={profileName}
          stats={stats}
        />
        <DashboardActionFeedback message={feedback} />
        <DashboardControls
          categories={visibleRealms}
          category={activeCategory}
          onCategoryChange={setCategory}
          onQueryChange={setQuery}
          query={query}
        />
        <TrackerList
          allTrackerCount={trackers.length}
          onArchive={archiveTracker}
          onCreate={openCreateForm}
          onEdit={openEditForm}
          onLaunch={launchTracker}
          pendingTrackerId={pendingTrackerId}
          trackers={filteredTrackers}
        />
      </AppMain>

      <TrackerForm
        categories={categories}
        editing={editing}
        key={`${formOpen ? "open" : "closed"}-${editing?.id ?? "new"}`}
        onClose={closeForm}
        onSubmit={submitTracker}
        open={formOpen}
        pending={isTrackerPending}
      />
    </AppShell>
  );
}
