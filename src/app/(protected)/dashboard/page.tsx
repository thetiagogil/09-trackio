import { unstable_rethrow } from "next/navigation";

import { DashboardLoadError } from "./_components/dashboard-load-error";
import { DashboardView } from "./_components/dashboard-view";
import {
  hydrateDashboard,
  type DashboardHydration,
} from "./_lib/hydrate-dashboard";

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
