import { unstable_rethrow } from "next/navigation";

import { Dashboard } from "@/components/features/dashboard/dashboard";
import { AppHeader } from "@/components/shared/app-header";
import { AppMain } from "@/components/shared/app-main";
import { AppShell } from "@/components/shared/app-shell";
import { hydrateDashboard } from "@/lib/server/data";
import type { DashboardHydration } from "@/lib/server/data";

export default async function DashboardPage() {
  let dashboard: DashboardHydration;

  try {
    dashboard = await hydrateDashboard();
  } catch (error) {
    unstable_rethrow(error);

    return (
      <AppShell>
        <AppHeader />
        <AppMain className="flex flex-1 items-center justify-center pb-12">
          <section
            className="panel-corners min-w-0 rounded-lg border-2 border-destructive/50 bg-card p-6 shadow-card"
            style={{ width: "min(42rem, calc(100vw - 5rem))" }}
          >
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-destructive">
              database error
            </p>
            <h1 className="font-display text-xl leading-relaxed text-glow-primary">
              Trackers could not load
            </h1>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {formatDashboardError(error)}
            </p>
          </section>
        </AppMain>
      </AppShell>
    );
  }

  return (
    <Dashboard
      currentUser={dashboard.currentUser}
      initialTrackers={dashboard.trackers}
    />
  );
}

function formatDashboardError(error: unknown) {
  const message = readMessage(error) ?? "";

  if (message.includes("Invalid schema: trackio")) {
    return "The shared Supabase project is reachable, but the Trackio schema is not exposed through the Data API. Add `trackio` to the project's exposed schemas, then reload the PostgREST schema cache.";
  }

  return message || "Something went wrong while loading Trackio.";
}

function readMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return null;
}
