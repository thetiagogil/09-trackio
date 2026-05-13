"use client";

import {
  Archive,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Zap,
} from "lucide-react";
import { useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import {
  formatDomain,
  levelFromXp,
  rarityFromXp,
  relativeTime,
} from "@/lib/trackers";
import type { Tracker } from "@/types/trackio";

type TrackerCardProps = {
  tracker: Tracker;
  onArchive: (tracker: Tracker) => void;
  onEdit: (tracker: Tracker) => void;
  onLaunch: (tracker: Tracker) => void;
};

const rarityClass = {
  common: "border-rarity-common/40 text-rarity-common",
  uncommon: "border-rarity-uncommon/60 text-rarity-uncommon",
  rare: "border-rarity-rare/60 text-rarity-rare",
  epic: "border-rarity-epic/60 text-rarity-epic",
  legendary: "border-rarity-legendary/70 text-rarity-legendary",
};

const rarityGlow = {
  common: "",
  uncommon: "",
  rare: "hover:shadow-[0_0_30px_-8px_var(--color-rarity-rare)]",
  epic: "hover:shadow-[0_0_30px_-8px_var(--color-rarity-epic)]",
  legendary:
    "animate-pulse-glow hover:shadow-[0_0_40px_-8px_var(--color-rarity-legendary)]",
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
    <article
      className={cn(
        "group relative flex flex-col rounded-lg border-2 bg-card p-5 shadow-card transition-all hover:-translate-y-1",
        rarityClass[rarity.tone],
        rarityGlow[rarity.tone],
      )}
    >
      <span className="absolute left-1.5 top-1.5 h-2 w-2 border-l-2 border-t-2 border-current opacity-60" />
      <span className="absolute right-1.5 top-1.5 h-2 w-2 border-r-2 border-t-2 border-current opacity-60" />
      <span className="absolute bottom-1.5 left-1.5 h-2 w-2 border-b-2 border-l-2 border-current opacity-60" />
      <span className="absolute bottom-1.5 right-1.5 h-2 w-2 border-b-2 border-r-2 border-current opacity-60" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border-2 border-current/40 bg-surface-elevated">
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
        <span className="rounded-sm border border-border bg-surface-elevated px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-foreground">
          {tracker.category}
        </span>
        <span
          className={cn(
            "rounded-sm border bg-background/50 px-2 py-1 font-display text-[9px] uppercase tracking-wider",
            rarityClass[rarity.tone],
          )}
        >
          * {rarity.label}
        </span>
        {tracker.username ? (
          <span className="rounded-sm border border-border bg-background/50 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
            {tracker.username}
          </span>
        ) : null}
      </div>

      <div className="mt-4">
        <div className="mb-1 flex justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>XP - LVL {level.level}</span>
          <span>{level.percent}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full border border-border bg-surface-elevated">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all"
            style={{ width: `${level.percent}%` }}
          />
        </div>
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
    </article>
  );
}
