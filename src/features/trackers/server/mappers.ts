import type { Tracker, TrackerRecord } from "@/features/trackers/types";

export const mapTracker = (row: TrackerRecord): Tracker => {
  return {
    id: row.id,
    title: row.title,
    url: row.url,
    category: row.category,
    username: row.username,
    notes: row.notes,
    xp: row.xp,
    clickCount: row.click_count,
    lastClickedAt: row.last_clicked_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};
