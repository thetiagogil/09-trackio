"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import {
  getDashboardCategories,
  getDashboardFilteredTrackers,
  getDashboardStats,
  getDashboardVisibleRealms,
} from "../_lib/dashboard-view-model";
import {
  archiveTrackerAction,
  createTrackerAction,
  recordTrackerClickAction,
  updateTrackerAction,
} from "@/features/trackers/server/actions";
import { levelFromXp } from "@/features/trackers/lib/trackers";
import type { Tracker, TrackerFormInput } from "@/features/trackers/types";
import { signOutAction } from "@/shared/server/auth-actions";

export const useDashboardTrackers = (initialTrackers: Tracker[]) => {
  const router = useRouter();
  const [trackers, setTrackers] = useState(initialTrackers);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Tracker | null>(null);
  const [archiveCandidate, setArchiveCandidate] = useState<Tracker | null>(
    null,
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [pendingTrackerIds, setPendingTrackerIds] = useState<Set<number>>(
    () => new Set(),
  );
  const [isTrackerPending, startTrackerTransition] = useTransition();
  const [isAuthPending, startAuthTransition] = useTransition();

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
  const hasActiveFilters = query.trim().length > 0 || activeCategory !== "all";
  const filteredTrackers = useMemo(
    () => getDashboardFilteredTrackers(trackers, query, activeCategory),
    [activeCategory, query, trackers],
  );
  const stats = useMemo(() => getDashboardStats(trackers), [trackers]);
  const playerLevel = levelFromXp(stats.totalXp);

  const updatePendingTracker = (trackerId: number, pending: boolean) => {
    setPendingTrackerIds((current) => {
      const next = new Set(current);

      if (pending) {
        next.add(trackerId);
      } else {
        next.delete(trackerId);
      }

      return next;
    });
  };

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

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
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

  const requestArchiveTracker = (tracker: Tracker) => {
    setFeedback(null);
    setArchiveCandidate(tracker);
  };

  const confirmArchiveTracker = () => {
    if (!archiveCandidate) return;

    const tracker = archiveCandidate;
    setFeedback(null);
    setArchiveCandidate(null);
    updatePendingTracker(tracker.id, true);

    startTrackerTransition(async () => {
      const result = await archiveTrackerAction(tracker.id);
      updatePendingTracker(tracker.id, false);

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
    if (pendingTrackerIds.has(tracker.id)) return;

    const launchedAt = new Date().toISOString();

    setFeedback(null);
    updatePendingTracker(tracker.id, true);
    setTrackers((current) =>
      current.map((item) =>
        item.id === tracker.id
          ? {
              ...item,
              xp: item.xp + 1,
              clickCount: item.clickCount + 1,
              lastClickedAt: launchedAt,
            }
          : item,
      ),
    );

    startTrackerTransition(async () => {
      const result = await recordTrackerClickAction(tracker.id);
      updatePendingTracker(tracker.id, false);

      if (!result.ok) {
        setTrackers((current) =>
          current.map((item) =>
            item.id === tracker.id
              ? {
                  ...item,
                  xp: tracker.xp,
                  clickCount: tracker.clickCount,
                  lastClickedAt: tracker.lastClickedAt,
                }
              : item,
          ),
        );
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

  return {
    activeCategory,
    archiveCandidate,
    categories,
    closeForm,
    confirmArchiveTracker,
    editing,
    feedback,
    filteredTrackers,
    formOpen,
    hasActiveFilters,
    isAuthPending,
    isTrackerPending,
    launchTracker,
    openCreateForm,
    openEditForm,
    pendingTrackerIds,
    playerLevel,
    query,
    requestArchiveTracker,
    resetFilters,
    setArchiveCandidate,
    setCategory,
    setQuery,
    signOut,
    stats,
    submitTracker,
    trackers,
    visibleRealms,
  };
};
