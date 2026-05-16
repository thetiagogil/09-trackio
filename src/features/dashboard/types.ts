import type { CurrentUser } from "@/shared/types";
import type { Tables } from "@thetiagogil/shared-db-types";

export type TrackerRow = Tables<{ schema: "trackio" }, "trackers">;
export type TrackerClickRow = Tables<{ schema: "trackio" }, "tracker_clicks">;

export type TrackerStatus = "active" | "archived";

export type Tracker = {
  id: number;
  title: string;
  url: string;
  category: string;
  username: string | null;
  notes: string | null;
  status: TrackerStatus;
  xp: number;
  clickCount: number;
  lastClickedAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TrackerFormInput = {
  title: string;
  url: string;
  category: string;
  username?: string | null;
  notes?: string | null;
};

export type TrackerStats = {
  totalTrackers: number;
  totalXp: number;
  totalLaunches: number;
  categoryCount: number;
  topTracker: Tracker | null;
};

export type DashboardHydration = {
  currentUser: CurrentUser;
  trackers: Tracker[];
};
