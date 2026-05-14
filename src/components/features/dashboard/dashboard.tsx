"use client";

import { Loader2, LogOut, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { Controls } from "@/components/features/dashboard/controls";
import { Feedback } from "@/components/features/dashboard/feedback";
import { Summary } from "@/components/features/dashboard/summary";
import { TrackerForm } from "@/components/features/dashboard/tracker-form";
import { TrackerList } from "@/components/features/dashboard/tracker-list";
import { AppHeader } from "@/components/shared/app-header";
import { AppLogo } from "@/components/shared/app-logo";
import { AppMain } from "@/components/shared/app-main";
import { AppShell } from "@/components/shared/app-shell";
import { Button } from "@/components/ui/button";
import {
  archiveTrackerAction,
  createTrackerAction,
  recordTrackerClickAction,
  signOutAction,
  updateTrackerAction,
} from "@/lib/server/actions";
import { DEFAULT_CATEGORIES, levelFromXp } from "@/lib/trackers";
import type {
  CurrentUser,
  Tracker,
  TrackerFormInput,
  TrackerStats,
} from "@/types/trackio";

type DashboardProps = {
  initialTrackers: Tracker[];
  currentUser: CurrentUser;
};

export function Dashboard({ currentUser, initialTrackers }: DashboardProps) {
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

  const profileName = getProfileName(currentUser);
  const categories = useMemo(() => getCategories(trackers), [trackers]);
  const visibleRealms = useMemo(() => getVisibleRealms(trackers), [trackers]);
  const activeCategory =
    visibleRealms.length > 1 && visibleRealms.includes(category)
      ? category
      : "all";
  const filteredTrackers = useMemo(
    () => getFilteredTrackers(trackers, query, activeCategory),
    [activeCategory, query, trackers],
  );
  const stats = useMemo(() => getStats(trackers), [trackers]);
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
        <Summary
          playerLevel={playerLevel}
          profileName={profileName}
          stats={stats}
        />
        <Feedback message={feedback} />
        <Controls
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

function getProfileName(currentUser: CurrentUser) {
  return (
    currentUser.profile.displayName ??
    currentUser.profile.username ??
    currentUser.email ??
    "Trackio user"
  );
}

function getCategories(trackers: Tracker[]) {
  const categories = new Set(DEFAULT_CATEGORIES);
  trackers.forEach((tracker) => categories.add(tracker.category));

  return Array.from(categories);
}

function getVisibleRealms(trackers: Tracker[]) {
  const realms = new Set<string>();
  trackers.forEach((tracker) => realms.add(tracker.category));

  return Array.from(realms);
}

function getFilteredTrackers(
  trackers: Tracker[],
  query: string,
  category: string,
) {
  const normalizedQuery = query.trim().toLowerCase();

  return trackers.filter((tracker) => {
    if (category !== "all" && tracker.category !== category) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchable = [
      tracker.title,
      tracker.url,
      tracker.category,
      tracker.notes ?? "",
      tracker.username ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(normalizedQuery);
  });
}

function getStats(trackers: Tracker[]): TrackerStats {
  let totalXp = 0;
  let totalLaunches = 0;
  let topTracker: Tracker | null = null;
  const categories = new Set<string>();

  trackers.forEach((tracker) => {
    totalXp += tracker.xp;
    totalLaunches += tracker.clickCount;
    categories.add(tracker.category);

    if (!topTracker || tracker.clickCount > topTracker.clickCount) {
      topTracker = tracker;
    }
  });

  return {
    totalTrackers: trackers.length,
    totalXp,
    totalLaunches,
    categoryCount: categories.size,
    topTracker,
  };
}
