import { LayoutGrid, LockKeyhole, Trophy } from "lucide-react";

import { HomeFeatureCard } from "./home-feature-card";

export function HomeFeatureGrid() {
  return (
    <section className="grid gap-4 sm:grid-cols-3">
      <HomeFeatureCard
        body="Add Letterboxd, AniList, Last.fm, Goodreads, Notion pages, spreadsheets, and custom URLs."
        icon={<LayoutGrid className="h-4 w-4" />}
        title="Directory"
        tone="pink"
      />
      <HomeFeatureCard
        body="Trackio stores private tracker links and notes. It does not track movies, songs, habits, goals, or streaks."
        icon={<LockKeyhole className="h-4 w-4" />}
        title="Private"
        tone="cyan"
      />
      <HomeFeatureCard
        body="Each launch awards that tracker 1 XP. Levels and rarity are derived from usage."
        icon={<Trophy className="h-4 w-4" />}
        title="Loot"
        tone="amber"
      />
    </section>
  );
}
