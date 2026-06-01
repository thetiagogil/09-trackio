import type { NormalizedTrackerInput } from "@/features/trackers/lib/trackers";
import type { Database } from "@/types/database.types";

type CreateTrackerArgs =
  Database["trackio"]["Functions"]["create_tracker"]["Args"];
type UpdateTrackerArgs =
  Database["trackio"]["Functions"]["update_tracker"]["Args"];
type ArchiveTrackerArgs =
  Database["trackio"]["Functions"]["archive_tracker"]["Args"];
type RecordTrackerClickArgs =
  Database["trackio"]["Functions"]["record_tracker_click"]["Args"];

export function buildCreateTrackerArgs(
  input: NormalizedTrackerInput,
): CreateTrackerArgs {
  return {
    p_title: input.title,
    p_url: input.url,
    p_category: input.category,
    ...(input.username ? { p_username: input.username } : {}),
    ...(input.notes ? { p_notes: input.notes } : {}),
  };
}

export function buildUpdateTrackerArgs(
  trackerId: number,
  input: NormalizedTrackerInput,
): UpdateTrackerArgs {
  return {
    p_tracker_id: trackerId,
    p_title: input.title,
    p_url: input.url,
    p_category: input.category,
    ...(input.username ? { p_username: input.username } : {}),
    ...(input.notes ? { p_notes: input.notes } : {}),
  };
}

export function buildArchiveTrackerArgs(trackerId: number): ArchiveTrackerArgs {
  return { p_tracker_id: trackerId };
}

export function buildRecordTrackerClickArgs(
  trackerId: number,
): RecordTrackerClickArgs {
  return { p_tracker_id: trackerId };
}

export function validateTrackerId(
  trackerId: number,
): { ok: true; id: number } | { ok: false; error: string } {
  if (!Number.isSafeInteger(trackerId) || trackerId <= 0) {
    return { ok: false, error: "Invalid tracker id." };
  }

  return { ok: true, id: trackerId };
}
