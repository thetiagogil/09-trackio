"use client";

import {
  LayoutGrid,
  Loader2,
  LogOut,
  Plus,
  Search,
  Target,
  Trophy,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { CategoryChip } from "@/components/features/dashboard/category-chip";
import { DashboardEmptyState } from "@/components/features/dashboard/dashboard-empty-state";
import { StatBox } from "@/components/features/dashboard/stat-box";
import { TrackerForm } from "@/components/forms/tracker-form";
import {
  BrandMark,
  PageMain,
  PageShell,
  SiteHeader,
} from "@/components/shared/page-shell";
import { TrackerCard } from "@/components/trackers/tracker-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
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

type TrackioDashboardProps = {
  initialTrackers: Tracker[];
  currentUser: CurrentUser;
};

export function TrackioDashboard({
  currentUser,
  initialTrackers,
}: TrackioDashboardProps) {
  const router = useRouter();
  const [trackers, setTrackers] = useState(initialTrackers);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Tracker | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [pendingTrackerId, setPendingTrackerId] = useState<number | null>(null);
  const [isFormPending, startFormTransition] = useTransition();
  const [isAuthPending, startAuthTransition] = useTransition();

  const categories = useMemo(() => {
    const set = new Set(DEFAULT_CATEGORIES);
    trackers.forEach((tracker) => set.add(tracker.category));

    return Array.from(set);
  }, [trackers]);

  const visibleCategories = useMemo(
    () =>
      categories.filter((item) =>
        trackers.some((tracker) => tracker.category === item),
      ),
    [categories, trackers],
  );

  const filteredTrackers = useMemo(() => {
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
  }, [category, query, trackers]);

  const stats = useMemo<TrackerStats>(() => {
    const topTracker =
      [...trackers].sort((a, b) => b.clickCount - a.clickCount)[0] ?? null;

    return {
      totalTrackers: trackers.length,
      totalXp: trackers.reduce((sum, tracker) => sum + tracker.xp, 0),
      totalLaunches: trackers.reduce(
        (sum, tracker) => sum + tracker.clickCount,
        0,
      ),
      categoryCount: new Set(trackers.map((tracker) => tracker.category)).size,
      topTracker,
    };
  }, [trackers]);

  const playerLevel = levelFromXp(stats.totalXp);
  const profileName =
    currentUser.profile.displayName ??
    currentUser.profile.username ??
    currentUser.email ??
    "Trackio user";

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
    if (isFormPending) return;

    setFormOpen(false);
    setEditing(null);
  };

  const handleSubmit = (input: TrackerFormInput) => {
    setFeedback(null);

    startFormTransition(async () => {
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

  const handleArchive = (tracker: Tracker) => {
    if (!window.confirm(`Archive ${tracker.title}?`)) {
      return;
    }

    setFeedback(null);
    setPendingTrackerId(tracker.id);

    startFormTransition(async () => {
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

  const handleLaunch = (tracker: Tracker) => {
    const previous = trackers;
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

    startFormTransition(async () => {
      const result = await recordTrackerClickAction(tracker.id);

      if (!result.ok) {
        setTrackers(previous);
        setFeedback(result.error);
        return;
      }

      setTrackers((current) =>
        current.map((item) => (item.id === result.data.id ? result.data : item)),
      );
      router.refresh();
    });
  };

  const handleSignOut = () => {
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
    <PageShell>
      <SiteHeader
        innerClassName="flex-wrap"
        sticky
        leading={
          <div>
            <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-accent text-glow-accent">
              &gt; tracker.hud <span className="animate-blink">_</span>
            </div>
            <BrandMark size="lg" />
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
            <Button
              onClick={openCreateForm}
              size="lg"
            >
              <Plus className="h-4 w-4" />
              New Tracker
            </Button>
            <Button
              aria-label="Sign out"
              disabled={isAuthPending}
              onClick={handleSignOut}
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

      <PageMain className="py-8">
        <section className="relative mb-8 overflow-hidden rounded-lg border-2 border-primary/40 bg-card p-6 shadow-card">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                * {profileName}
              </div>
              <div className="flex items-end gap-4">
                <div className="font-display text-4xl leading-none text-glow-primary md:text-5xl">
                  LV.{playerLevel.level}
                </div>
                <div className="pb-1 font-mono text-xs text-muted-foreground">
                  {stats.totalXp.toLocaleString()} XP
                </div>
              </div>
              <div className="mt-3 w-full md:w-80">
                <div className="h-2 overflow-hidden rounded-full border border-border bg-surface-elevated">
                  <div
                    className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all"
                    style={{
                      backgroundSize: "200% 100%",
                      width: `${playerLevel.percent}%`,
                    }}
                  />
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {playerLevel.percent}% to LV.{playerLevel.level + 1}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <StatBox
                icon={<Target className="h-3.5 w-3.5" />}
                label="Trackers"
                tone="pink"
                value={stats.totalTrackers}
              />
              <StatBox
                icon={<LayoutGrid className="h-3.5 w-3.5" />}
                label="Realms"
                tone="cyan"
                value={stats.categoryCount}
              />
              <StatBox
                icon={<Trophy className="h-3.5 w-3.5" />}
                label="Top"
                small
                tone="amber"
                value={stats.topTracker?.title ?? "-"}
              />
            </div>
          </div>
        </section>

        {feedback ? (
          <div className="mb-5 rounded-sm border border-destructive/40 bg-destructive/10 px-3 py-2 font-mono text-xs text-destructive">
            {feedback}
          </div>
        ) : null}

        <section className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-11 border-2 border-border bg-card pl-9 font-mono text-sm focus-visible:border-accent"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search trackers, URLs, notes..."
              value={query}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 font-display text-[9px] uppercase tracking-wider text-accent">
              &gt; Realm
            </span>
            <CategoryChip
              active={category === "all"}
              onClick={() => setCategory("all")}
            >
              All
            </CategoryChip>
            {visibleCategories.map((item) => (
              <CategoryChip
                active={category === item}
                key={item}
                onClick={() => setCategory(item)}
              >
                {item}
              </CategoryChip>
            ))}
          </div>
        </section>

        {filteredTrackers.length === 0 ? (
          <DashboardEmptyState
            hasTrackers={trackers.length > 0}
            onCreate={openCreateForm}
          />
        ) : (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTrackers.map((tracker) => (
              <div className="relative" key={tracker.id}>
                <TrackerCard
                  onArchive={handleArchive}
                  onEdit={openEditForm}
                  onLaunch={handleLaunch}
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
        )}

        <footer className="mt-16 flex justify-between border-t-2 border-dashed border-border pt-8 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>* private rows - {trackers.length} trackers</span>
          <span className="text-accent">trackio - v1</span>
        </footer>
      </PageMain>

      <TrackerForm
        categories={categories}
        editing={editing}
        onClose={closeForm}
        onSubmit={handleSubmit}
        open={formOpen}
        pending={isFormPending}
      />
    </PageShell>
  );
}
