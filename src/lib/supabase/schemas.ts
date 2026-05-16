import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@thetiagogil/shared-db-types";

export type AppSupabaseClient = SupabaseClient<Database>;

export function core(client: AppSupabaseClient) {
  return client.schema("core");
}

export function trackio(client: AppSupabaseClient) {
  return client.schema("trackio");
}
