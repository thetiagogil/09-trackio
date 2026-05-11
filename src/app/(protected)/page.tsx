import { SetupMissing } from "@/components/shared/setup-missing";
import { TrackioDashboard } from "@/components/trackers/dashboard";
import { isSupabaseConfigured } from "@/lib/env";
import { hydrateDashboard } from "@/lib/server/data";
import type { DashboardHydration } from "@/lib/server/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  if (!isSupabaseConfigured()) {
    return <SetupMissing />;
  }

  let dashboard: DashboardHydration;

  try {
    dashboard = await hydrateDashboard();
  } catch (error) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center px-0 py-12">
        <section
          className="panel-corners min-w-0 rounded-lg border-2 border-destructive/50 bg-card p-6 shadow-card"
          style={{ width: "min(42rem, calc(100vw - 5rem))" }}
        >
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-destructive">
            database error
          </p>
          <h1 className="font-display text-xl leading-relaxed text-glow-pink">
            Trackers could not load
          </h1>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading Trackio."}
          </p>
        </section>
      </main>
    );
  }

  return (
    <TrackioDashboard
      currentUser={dashboard.currentUser}
      initialTrackers={dashboard.trackers}
    />
  );
}
