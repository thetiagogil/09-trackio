import type { Tables } from "@/types/database.types";

export type TrackerRow = Tables<{ schema: "trackio" }, "trackers">;
export type TrackerRecord = Pick<
  TrackerRow,
  | "category"
  | "click_count"
  | "created_at"
  | "id"
  | "last_clicked_at"
  | "notes"
  | "title"
  | "updated_at"
  | "url"
  | "username"
  | "xp"
>;

export type Tracker = {
  id: number;
  title: string;
  url: string;
  category: string;
  username: string | null;
  notes: string | null;
  xp: number;
  clickCount: number;
  lastClickedAt: string | null;
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

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type RarityInfo = {
  label: string;
  rarity: Rarity;
};
