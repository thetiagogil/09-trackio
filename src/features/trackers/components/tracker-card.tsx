"use client";

import {
  Archive,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Zap,
} from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { buttonVariants } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { ProgressBar } from "@/shared/components/ui/progress-bar";
import { cn } from "@/shared/utils/cn";
import {
  formatDomain,
  levelFromXp,
  rarityFromXp,
  relativeTime,
} from "@/features/trackers/lib/trackers";
import {
  RARITY_BADGE_CLASS,
  RARITY_BORDER_CLASS,
  RARITY_GLOW_CLASS,
  RARITY_TEXT_CLASS,
} from "@/features/trackers/constants";
import type { Tracker } from "@/features/trackers/types";

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
  const domain = formatDomain(tracker.url);
  const favicon = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
    domain,
  )}&sz=64`;
  const level = levelFromXp(tracker.xp);
  const rarity = rarityFromXp(tracker.xp);

  const handleEdit = () => {
    onEdit(tracker);
  };

  const handleArchive = () => {
    onArchive(tracker);
  };

  return (
    <Card
      as="article"
      interactive
      className={cn(
        "flex flex-col",
        RARITY_BORDER_CLASS[rarity.rarity],
        RARITY_GLOW_CLASS[rarity.rarity],
      )}
      cornerClassName={RARITY_TEXT_CLASS[rarity.rarity]}
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label={`Open menu for ${tracker.title}`}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              type="button"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={handleEdit}>
              <Pencil className="h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleArchive} tone="danger">
              <Archive className="h-4 w-4" />
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {tracker.notes ? (
        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-foreground/80">
          {tracker.notes}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge variant="accent">{tracker.category}</Badge>
        <Badge className={RARITY_BADGE_CLASS[rarity.rarity]}>
          {rarity.label}
        </Badge>
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
