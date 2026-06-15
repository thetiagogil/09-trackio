"use client";

import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { AppHeader } from "@/shared/components/layout/app-header";
import { AppLogo } from "@/shared/components/layout/app-logo";
import { AppMain } from "@/shared/components/layout/app-main";
import { AppShell } from "@/shared/components/layout/app-shell";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { TrackerForm } from "@/features/trackers/components/tracker-form";
import { TrackerList } from "@/features/trackers/components/tracker-list";
import {
  getDashboardCategories,
  getDashboardFilteredTrackers,
  getDashboardProfileName,
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
import type { CurrentUser } from "@/shared/types";
import { DashboardActionFeedback } from "./dashboard-action-feedback";
import { DashboardControls } from "./dashboard-controls";
import { DashboardSummary } from "./dashboard-summary";

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
  const [archiveCandidate, setArchiveCandidate] = useState<Tracker | null>(
    null,
  );
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
  const hasActiveFilters = query.trim().length > 0 || activeCategory !== "all";
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

    setFeedback(null);
    setPendingTrackerId(tracker.id);
    setTrackers((current) =>
      current.map((item) =>
        item.id === tracker.id ? optimisticTracker : item,
      ),
    );

    startTrackerTransition(async () => {
      const result = await recordTrackerClickAction(tracker.id);
      setPendingTrackerId(null);

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
              <span className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
                signed in
              </span>
              <span className="font-display text-glow-accent max-w-44 truncate text-[11px]">
                {profileName}
              </span>
            </div>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    aria-label="Sign out"
                    disabled={isAuthPending}
                    onClick={signOut}
                    size="lg"
                    variant="outline"
                  >
                    {isAuthPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Sign out</TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
          onCreate={openCreateForm}
          onQueryChange={setQuery}
          onResetFilters={resetFilters}
          query={query}
          totalCount={trackers.length}
          visibleCount={filteredTrackers.length}
        />
        <TrackerList
          allTrackerCount={trackers.length}
          hasActiveFilters={hasActiveFilters}
          onArchive={requestArchiveTracker}
          onCreate={openCreateForm}
          onEdit={openEditForm}
          onLaunch={launchTracker}
          onResetFilters={resetFilters}
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

      <AlertDialog
        onOpenChange={(open) => {
          if (!open) {
            setArchiveCandidate(null);
          }
        }}
        open={Boolean(archiveCandidate)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Tracker</AlertDialogTitle>
            <AlertDialogDescription>
              {archiveCandidate
                ? `Archive ${archiveCandidate.title}? It will leave your active HUD, but your data stays private.`
                : "Archive this tracker? It will leave your active HUD, but your data stays private."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isTrackerPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isTrackerPending}
              onClick={confirmArchiveTracker}
            >
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
