import { LayoutGrid, LockKeyhole, Trophy } from "lucide-react";

import { HomeFeatureCard } from "./home-feature-card";

export function HomeFeatureGrid() {
  return (
    <section className="grid gap-4 sm:grid-cols-3">
      <HomeFeatureCard
        body="Trackio is a directory of trackers. You can search for and launch your favorite trackers from one place."
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
        body="Each launch awards you with points. The more you launch, the more points you earn."
        icon={<Trophy className="h-4 w-4" />}
        title="Loot"
        tone="amber"
      />
    </section>
  );
}
