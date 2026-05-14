import { unstable_rethrow } from "next/navigation";

import { DashboardLoadError } from "@/features/dashboard/components/dashboard-load-error";
import { DashboardView } from "@/features/dashboard/components/dashboard-view";
import { hydrateDashboard } from "@/features/dashboard/server/hydrate";
import type { DashboardHydration } from "@/features/dashboard/types";

export default async function DashboardPage() {
  let dashboard: DashboardHydration;

  try {
    dashboard = await hydrateDashboard();
  } catch (error) {
    unstable_rethrow(error);

    return <DashboardLoadError error={error} />;
  }

  return (
    <DashboardView
      currentUser={dashboard.currentUser}
      initialTrackers={dashboard.trackers}
    />
  );
}
