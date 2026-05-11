"use client";

import {
  Archive,
  ExternalLink,
  Pencil,
  RadioTower,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import {
  formatDomain,
  levelFromXp,
  rarityFromXp,
  relativeTime,
  trackerInitials,
} from "@/lib/trackers";
import type { Tracker } from "@/types/trackio";

type TrackerCardProps = {
  tracker: Tracker;
  onArchive: (tracker: Tracker) => void;
  onEdit: (tracker: Tracker) => void;
  onLaunch: (tracker: Tracker) => void;
};

const rarityClasses = {
  common: "border-rarity-common/45 text-rarity-common",
  uncommon: "border-rarity-uncommon/55 text-rarity-uncommon",
  rare: "border-rarity-rare/60 text-rarity-rare hover:shadow-[0_0_34px_-12px_var(--rarity-rare)]",
  epic: "border-rarity-epic/65 text-rarity-epic hover:shadow-[0_0_34px_-12px_var(--rarity-epic)]",
  legendary:
    "border-rarity-legendary/75 text-rarity-legendary hover:shadow-[0_0_42px_-12px_var(--rarity-legendary)]",
};

export function TrackerCard({
  onArchive,
  onEdit,
  onLaunch,
  tracker,
}: TrackerCardProps) {
  const domain = formatDomain(tracker.url);
  const level = levelFromXp(tracker.xp);
  const rarity = rarityFromXp(tracker.xp);

  return (
    <article
      className={cn(
        "panel-corners group flex min-h-[292px] flex-col rounded-lg border-2 bg-card p-4 shadow-card transition-all hover:-translate-y-0.5",
        rarityClasses[rarity.tone],
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-sm border-2 border-current/45 bg-surface-elevated">
            <span className="font-display text-[12px] uppercase tracking-wider text-foreground">
              {trackerInitials(tracker.title)}
            </span>
            <span className="absolute -bottom-2 -right-2 rounded-sm border border-current bg-background px-1.5 py-0.5 font-mono text-[10px] text-foreground">
              L{level.level}
            </span>
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold leading-tight text-foreground">
              {tracker.title}
            </h3>
            <p className="mt-1 truncate font-mono text-[11px] text-muted-foreground">
              {domain}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
          <Button
            aria-label={`Edit ${tracker.title}`}
            onClick={() => onEdit(tracker)}
            size="icon"
            title="Edit tracker"
            variant="ghost"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            aria-label={`Archive ${tracker.title}`}
            onClick={() => onArchive(tracker)}
            size="icon"
            title="Archive tracker"
            variant="ghost"
          >
            <Archive className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-sm border border-border bg-surface-elevated px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-foreground">
          {tracker.category}
        </span>
        <span className="rounded-sm border border-current bg-background/50 px-2 py-1 font-display text-[9px] uppercase tracking-wider">
          {rarity.label}
        </span>
        {tracker.username ? (
          <span className="rounded-sm border border-border bg-background/50 px-2 py-1 font-mono text-[10px] text-muted-foreground">
            {tracker.username}
          </span>
        ) : null}
      </div>

      {tracker.notes ? (
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-foreground/78">
          {tracker.notes}
        </p>
      ) : (
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          No private notes yet.
        </p>
      )}

      <div className="mt-auto pt-5">
        <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>XP level {level.level}</span>
          <span>{level.percent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full border border-border bg-surface-elevated">
          <div
            className="h-full bg-gradient-to-r from-primary via-accent to-neon-lime transition-all"
            style={{ width: `${level.percent}%` }}
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-dashed border-border pt-4">
          <div className="min-w-0 font-mono text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5 text-foreground">
              <Zap className="h-3.5 w-3.5 text-accent" />
              {tracker.xp.toLocaleString()} XP
              <span className="text-muted-foreground">
                / {tracker.clickCount.toLocaleString()} launches
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <RadioTower className="h-3.5 w-3.5" />
              last: {relativeTime(tracker.lastClickedAt)}
            </div>
          </div>

          <a
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-sm border-2 border-primary bg-primary px-3 font-display text-[11px] uppercase tracking-wider text-primary-foreground transition-all hover:shadow-neon-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            href={tracker.url}
            onClick={() => onLaunch(tracker)}
            rel="noreferrer"
            target="_blank"
          >
            Launch
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}
