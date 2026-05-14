import { mapTracker } from "@/features/dashboard/server/mappers";
import type { Tracker } from "@/features/dashboard/types";
import { trackio, type AppSupabaseClient } from "@/lib/supabase/schemas";

export async function getActiveTrackers(
  client: AppSupabaseClient,
): Promise<Tracker[]> {
  const { data, error } = await trackio(client)
    .from("trackers")
    .select(
      "id, title, url, category, username, notes, status, xp, click_count, last_clicked_at, archived_at, created_at, updated_at, user_id",
    )
    .eq("status", "active")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapTracker);
}
