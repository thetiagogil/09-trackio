"use client";

import { Archive, MoreHorizontal, Pencil, Zap } from "lucide-react";
import { useState } from "react";

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
  trackerInitials,
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

export const TrackerCard = ({
  onArchive,
  onEdit,
  onLaunch,
  tracker,
}: TrackerCardProps) => {
  const domain = formatDomain(tracker.url);
  const favicon = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
    domain,
  )}&sz=64`;
  const initials = trackerInitials(tracker.title);
  const level = levelFromXp(tracker.xp);
  const rarity = rarityFromXp(tracker.xp);
  const [failedFavicon, setFailedFavicon] = useState<string | null>(null);
  const faviconFailed = failedFavicon === favicon;

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
              "bg-surface-elevated relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border-2 border-current/40",
              RARITY_TEXT_CLASS[rarity.rarity],
            )}
          >
            {faviconFailed ? (
              <span
                aria-hidden="true"
                className="font-display text-foreground text-[10px]"
              >
                {initials}
              </span>
            ) : (
              // Google S2 favicons are external and intentionally tiny; next/image
              // would require allowing a third-party host for no layout benefit here.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt=""
                className="h-7 w-7"
                onError={() => setFailedFavicon(favicon)}
                src={favicon}
              />
            )}
            <span className="bg-background font-display text-foreground absolute -right-1 -bottom-1 rounded border border-current px-1 py-0.5 text-[8px]">
              L{level.level}
            </span>
          </div>
          <div className="min-w-0">
            <h3 className="text-foreground truncate text-lg leading-tight font-bold tracking-tight">
              {tracker.title}
            </h3>
            <p className="text-muted-foreground truncate font-mono text-[11px]">
              {domain}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label={`Open menu for ${tracker.title}`}
              className="text-muted-foreground hover:bg-surface-elevated hover:text-foreground focus-visible:ring-ring rounded-md p-1.5 transition-colors focus-visible:ring-1 focus-visible:outline-none"
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
        <p className="text-foreground/80 mt-4 line-clamp-2 text-sm leading-relaxed">
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
        <div className="text-muted-foreground mb-1 flex justify-between font-mono text-[10px] tracking-wider uppercase">
          <span>XP - LVL {level.level}</span>
          <span>{level.percent}%</span>
        </div>
        <ProgressBar size="sm" value={level.percent} />
      </div>

      <div className="border-border mt-4 flex items-center justify-between border-t border-dashed pt-3">
        <div className="text-muted-foreground font-mono text-[11px]">
          <div className="text-foreground flex items-center gap-1">
            <Zap className="text-accent h-3 w-3" />
            {tracker.xp.toLocaleString()} XP
          </div>
          <div className="mt-0.5 opacity-70">
            Last launch: {relativeTime(tracker.lastClickedAt)}
          </div>
        </div>
        <a
          aria-label={`Launch ${tracker.title} in a new tab`}
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
        </a>
      </div>
    </Card>
  );
};
