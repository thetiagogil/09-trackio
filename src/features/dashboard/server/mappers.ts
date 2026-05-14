import type {
  Tracker,
  TrackerRow,
  TrackerStatus,
} from "@/features/dashboard/types";

export function mapTracker(row: TrackerRow): Tracker {
  return {
    id: row.id,
    title: row.title,
    url: row.url,
    category: row.category,
    username: row.username,
    notes: row.notes,
    status: normalizeTrackerStatus(row.status),
    xp: row.xp,
    clickCount: row.click_count,
    lastClickedAt: row.last_clicked_at,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function normalizeTrackerStatus(value: string): TrackerStatus {
  return value === "archived" ? "archived" : "active";
}
