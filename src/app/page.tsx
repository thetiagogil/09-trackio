import Link from "next/link";
import { ArrowRight, LayoutGrid, LockKeyhole, Trophy, Zap } from "lucide-react";

import { SetupMissing } from "@/components/shared/setup-missing";
import { isSupabaseConfigured } from "@/lib/env";

export default function Home() {
  if (!isSupabaseConfigured()) {
    return <SetupMissing />;
  }

  return (
    <div className="min-h-screen scanline">
      <header className="border-b-2 border-border/60 bg-background/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">
          <div className="font-display text-sm tracking-tight md:text-base">
            <span className="text-glow-pink">TRACK</span>
            <span className="mx-2 text-accent">IO</span>
            <span className="text-glow-cyan">HUD</span>
          </div>
          <nav className="flex items-center gap-2">
            <Link
              className="inline-flex h-8 shrink-0 items-center justify-center rounded-sm border-2 border-transparent bg-transparent px-3 font-display text-[10px] uppercase tracking-wider text-muted-foreground transition-all hover:bg-surface-elevated hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              href="/auth?next=/dashboard"
            >
              Sign in
            </Link>
            <Link
              className="inline-flex h-8 shrink-0 items-center justify-center rounded-sm border-2 border-primary bg-primary px-3 font-display text-[10px] uppercase tracking-wider text-primary-foreground transition-all hover:shadow-neon-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              href="/auth?mode=signup&next=/dashboard"
            >
              Start
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <section className="mx-auto max-w-3xl text-center">
          <div className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-accent text-glow-cyan">
            private tracker directory
          </div>
          <h1 className="mb-6 font-display text-3xl leading-tight tracking-tight md:text-5xl">
            <span className="text-glow-pink">LAUNCH</span>
            <br />
            <span className="text-foreground">YOUR TRACKERS FROM ONE HUD</span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl font-mono text-base text-muted-foreground md:text-lg">
            Save the external apps, sites, profiles, pages, spreadsheets, and
            custom URLs where you already track things. Every launch from
            Trackio gives that tracker one XP.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-sm border-2 border-primary bg-primary px-5 font-display text-[10px] uppercase tracking-wider text-primary-foreground transition-all hover:shadow-neon-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              href="/auth?mode=signup&next=/dashboard"
            >
              Create account
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-sm border-2 border-accent/60 bg-transparent px-5 font-display text-[10px] uppercase tracking-wider text-foreground transition-all hover:border-accent hover:shadow-neon-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              href="/auth?next=/dashboard"
            >
              <Zap className="h-4 w-4" />
              Enter HUD
            </Link>
          </div>
        </section>

        <section className="mt-20 grid gap-4 sm:grid-cols-3">
          <Feature
            body="Add Letterboxd, AniList, Last.fm, Goodreads, Notion pages, spreadsheets, or any custom URL."
            icon={<LayoutGrid className="h-4 w-4" />}
            title="Directory"
            tone="pink"
          />
          <Feature
            body="Trackio stores your tracker links and private notes. It does not track movies, episodes, habits, streaks, or goals."
            icon={<LockKeyhole className="h-4 w-4" />}
            title="Private"
            tone="cyan"
          />
          <Feature
            body="Launching a tracker from Trackio awards one XP to that tracker. Levels and rarity are derived from usage."
            icon={<Trophy className="h-4 w-4" />}
            title="XP"
            tone="lime"
          />
        </section>
      </main>

      <footer className="mx-auto flex max-w-7xl justify-between border-t-2 border-dashed border-border px-6 py-8 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>private by default</span>
        <span className="text-accent">trackio - v1</span>
      </footer>
    </div>
  );
}

function Feature({
  body,
  icon,
  title,
  tone,
}: {
  body: string;
  icon: React.ReactNode;
  title: string;
  tone: "pink" | "cyan" | "lime";
}) {
  const toneClass =
    tone === "pink"
      ? "text-primary"
      : tone === "cyan"
        ? "text-accent"
        : "text-neon-lime";

  return (
    <div className="rounded-lg border-2 border-border bg-card p-5 shadow-card">
      <div
        className={`mb-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider ${toneClass}`}
      >
        {icon} {title}
      </div>
      <p className="font-mono text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
    </div>
  );
}
