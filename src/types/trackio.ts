import type { Tables } from "./database.types";

export type ProfileRow = Tables<{ schema: "core" }, "profiles">;
export type TrackerRow = Tables<{ schema: "trackio" }, "trackers">;
export type TrackerClickRow = Tables<{ schema: "trackio" }, "tracker_clicks">;

export type Profile = {
  id: string;
  displayName: string;
  username: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CurrentUser = {
  id: string;
  email: string | null;
  profile: Profile;
};

export type TrackerStatus = "active" | "archived";

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type RarityInfo = {
  label: string;
  rarity: Rarity;
};

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
