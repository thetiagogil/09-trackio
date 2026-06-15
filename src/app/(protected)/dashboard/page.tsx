import { DashboardView } from "./_components/dashboard-view";
import { hydrateDashboard } from "./_lib/hydrate-dashboard";

export default async function DashboardPage() {
  const dashboard = await hydrateDashboard();

  return (
    <DashboardView
      currentUser={dashboard.currentUser}
      initialTrackers={dashboard.trackers}
    />
  );
}
