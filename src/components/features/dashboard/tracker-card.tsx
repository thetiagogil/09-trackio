"use client";

import {
  Archive,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Zap,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/cn";
import {
  formatDomain,
  levelFromXp,
  rarityFromXp,
  relativeTime,
} from "@/lib/trackers";
import { RARITY_GLOW_CLASS, RARITY_TEXT_CLASS } from "@/lib/rarity";
import type { Tracker } from "@/types/trackio";

type TrackerCardProps = {
  tracker: Tracker;
  onArchive: (tracker: Tracker) => void;
  onEdit: (tracker: Tracker) => void;
  onLaunch: (tracker: Tracker) => void;
};

export function TrackerCard({
  onArchive,
  onEdit,
  onLaunch,
  tracker,
}: TrackerCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const domain = formatDomain(tracker.url);
  const favicon = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
    domain,
  )}&sz=64`;
  const level = levelFromXp(tracker.xp);
  const rarity = rarityFromXp(tracker.xp);

  const handleEdit = () => {
    setMenuOpen(false);
    onEdit(tracker);
  };

  const handleArchive = () => {
    setMenuOpen(false);
    onArchive(tracker);
  };

  return (
    <Card
      as="article"
      interactive
      className={cn("flex flex-col", RARITY_GLOW_CLASS[rarity.rarity])}
      rarity={rarity.rarity}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border-2 border-current/40 bg-surface-elevated",
              RARITY_TEXT_CLASS[rarity.rarity],
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              className="h-7 w-7"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
              src={favicon}
            />
            <span className="absolute -bottom-1 -right-1 rounded border border-current bg-background px-1 py-0.5 font-display text-[8px] text-foreground">
              L{level.level}
            </span>
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold leading-tight tracking-tight text-foreground">
              {tracker.title}
            </h3>
            <p className="truncate font-mono text-[11px] text-muted-foreground">
              {domain}
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            aria-expanded={menuOpen}
            aria-label={`Open menu for ${tracker.title}`}
            className="rounded-md p-1.5 opacity-100 transition-opacity hover:bg-surface-elevated sm:opacity-0 sm:group-hover:opacity-100"
            onClick={() => setMenuOpen((current) => !current)}
            type="button"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {menuOpen ? (
            <div className="absolute right-0 top-9 z-20 min-w-36 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md">
              <button
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                onClick={handleEdit}
                type="button"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
              <div className="-mx-1 my-1 h-px bg-muted" />
              <button
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm text-destructive outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                onClick={handleArchive}
                type="button"
              >
                <Archive className="h-4 w-4" />
                Archive
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {tracker.notes ? (
        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-foreground/80">
          {tracker.notes}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge variant="accent">{tracker.category}</Badge>
        <Badge rarity={rarity.rarity}>{rarity.label}</Badge>
        {tracker.username ? (
          <Badge variant="surface">{tracker.username}</Badge>
        ) : null}
      </div>

      <div className="mt-4">
        <div className="mb-1 flex justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>XP - LVL {level.level}</span>
          <span>{level.percent}%</span>
        </div>
        <ProgressBar size="sm" value={level.percent} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-dashed border-border pt-3">
        <div className="font-mono text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1 text-foreground">
            <Zap className="h-3 w-3 text-accent" />
            {tracker.xp.toLocaleString()} XP
          </div>
          <div className="mt-0.5 opacity-60">
            last: {relativeTime(tracker.lastClickedAt)}
          </div>
        </div>
        <a
          className={buttonVariants({
            className: "rounded-sm",
            size: "sm",
          })}
          href={tracker.url}
          onClick={() => onLaunch(tracker)}
          rel="noreferrer"
          target="_blank"
        >
          Launch
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </Card>
  );
}
