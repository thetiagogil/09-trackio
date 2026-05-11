"use client";

import {
  Grid2X2,
  LayoutList,
  Loader2,
  LogOut,
  Plus,
  Search,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { TrackerForm } from "@/components/forms/tracker-form";
import { TrackerCard } from "@/components/trackers/tracker-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { cn } from "@/lib/cn";
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

type ViewMode = "grid" | "list";

export function TrackioDashboard({
  currentUser,
  initialTrackers,
}: TrackioDashboardProps) {
  const router = useRouter();
  const [trackers, setTrackers] = useState(initialTrackers);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Tracker | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [pendingTrackerId, setPendingTrackerId] = useState<number | null>(null);
  const [isFormPending, startFormTransition] = useTransition();
  const [isAuthPending, startAuthTransition] = useTransition();

  const categories = useMemo(() => {
    const unique = new Set([
      ...DEFAULT_CATEGORIES,
      ...trackers.map((tracker) => tracker.category),
    ]);

    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [trackers]);

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
    const topTracker = [...trackers].sort((a, b) => b.xp - a.xp)[0] ?? null;

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
    if (isFormPending) {
      return;
    }

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

      router.replace("/auth");
      router.refresh();
    });
  };

  return (
    <div className="scanline min-h-screen">
      <header className="sticky top-0 z-30 border-b-2 border-border/70 bg-background/76 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-accent text-glow-cyan">
              tracker directory
            </p>
            <h1 className="font-display text-xl leading-relaxed text-glow-pink sm:text-2xl">
              TRACKIO
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="mr-1 hidden text-right sm:block">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                signed in
              </p>
              <p className="max-w-44 truncate font-mono text-xs text-foreground">
                {profileName}
              </p>
            </div>
            <Button onClick={openCreateForm} size="lg">
              <Plus className="h-4 w-4" />
              New tracker
            </Button>
            <Button
              aria-label="Sign out"
              disabled={isAuthPending}
              onClick={handleSignOut}
              size="icon"
              title="Sign out"
              variant="secondary"
            >
              {isAuthPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-7 sm:px-6">
        <section className="mb-7 rounded-lg border-2 border-primary/40 bg-card p-5 shadow-card">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                {profileName}
              </p>
              <div className="mt-3 flex flex-wrap items-end gap-4">
                <div className="font-display text-4xl leading-none text-glow-cyan sm:text-5xl">
                  LV.{playerLevel.level}
                </div>
                <div className="pb-1 font-mono text-sm text-muted-foreground">
                  {stats.totalXp.toLocaleString()} XP from tracker launches
                </div>
              </div>
              <div className="mt-4 max-w-md">
                <div className="h-2 overflow-hidden rounded-full border border-border bg-surface-elevated">
                  <div
                    className="h-full bg-gradient-to-r from-primary via-accent to-neon-lime transition-all"
                    style={{ width: `${playerLevel.percent}%` }}
                  />
                </div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {playerLevel.next} XP to level {playerLevel.level + 1}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <StatCell
                icon={<Target className="h-4 w-4" />}
                label="Trackers"
                value={stats.totalTrackers.toLocaleString()}
              />
              <StatCell
                icon={<Zap className="h-4 w-4" />}
                label="Launches"
                value={stats.totalLaunches.toLocaleString()}
              />
              <StatCell
                icon={<Grid2X2 className="h-4 w-4" />}
                label="Categories"
                value={stats.categoryCount.toLocaleString()}
              />
              <StatCell
                compact
                icon={<Trophy className="h-4 w-4" />}
                label="Top tracker"
                value={stats.topTracker?.title ?? "None"}
              />
            </div>
          </div>
        </section>

        {feedback ? (
          <div className="mb-5 rounded-sm border border-destructive/50 bg-destructive/10 px-3 py-2 font-mono text-xs text-destructive">
            {feedback}
          </div>
        ) : null}

        <section className="mb-6 space-y-4">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-10"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search title, URL, category, or notes..."
                value={query}
              />
            </div>

            <div className="flex rounded-sm border-2 border-border bg-card p-1">
              <ViewButton
                active={viewMode === "grid"}
                label="Grid view"
                onClick={() => setViewMode("grid")}
              >
                <Grid2X2 className="h-4 w-4" />
              </ViewButton>
              <ViewButton
                active={viewMode === "list"}
                label="List view"
                onClick={() => setViewMode("list")}
              >
                <LayoutList className="h-4 w-4" />
              </ViewButton>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
              filter
            </span>
            <CategoryChip
              active={category === "all"}
              onClick={() => setCategory("all")}
            >
              All
            </CategoryChip>
            {categories.map((item) => (
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
          <EmptyState
            hasTrackers={trackers.length > 0}
            onCreate={openCreateForm}
          />
        ) : (
          <section
            className={cn(
              viewMode === "grid"
                ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                : "grid gap-4",
            )}
          >
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
      </main>

      <TrackerForm
        categories={categories}
        editing={editing}
        onClose={closeForm}
        onSubmit={handleSubmit}
        open={formOpen}
        pending={isFormPending}
      />
    </div>
  );
}

function StatCell({
  compact,
  icon,
  label,
  value,
}: {
  compact?: boolean;
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 border-l-2 border-accent/50 bg-background/35 px-3 py-2">
      <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-accent">
        {icon}
        {label}
      </div>
      <div
        className={cn(
          "mt-2 truncate font-display uppercase tracking-wider text-foreground",
          compact ? "text-[11px]" : "text-xl",
        )}
        title={value}
      >
        {value}
      </div>
    </div>
  );
}

function ViewButton({
  active,
  children,
  label,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className={cn(
        "grid h-9 w-10 place-items-center rounded-sm transition-colors",
        active
          ? "bg-accent text-accent-foreground shadow-neon-cyan"
          : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground",
      )}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

function CategoryChip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "rounded-sm border-2 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all",
        active
          ? "border-accent bg-accent text-accent-foreground shadow-neon-cyan"
          : "border-border bg-card text-muted-foreground hover:border-accent/60 hover:text-foreground",
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function EmptyState({
  hasTrackers,
  onCreate,
}: {
  hasTrackers: boolean;
  onCreate: () => void;
}) {
  return (
    <section className="grid min-h-[320px] place-items-center rounded-lg border-2 border-dashed border-border bg-card/50 px-6 py-12 text-center">
      <div>
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-sm border-2 border-accent/55 bg-accent/10 text-accent">
          <Zap className="h-6 w-6" />
        </div>
        <h2 className="font-display text-sm uppercase tracking-wider text-glow-pink">
          {hasTrackers ? "No matching trackers" : "No trackers yet"}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          {hasTrackers
            ? "Try another search or category filter."
            : "Add the external places where you already track things, then launch them from Trackio when you use them."}
        </p>
        {!hasTrackers ? (
          <Button className="mt-6" onClick={onCreate}>
            <Plus className="h-4 w-4" />
            Add first tracker
          </Button>
        ) : null}
      </div>
    </section>
  );
}
