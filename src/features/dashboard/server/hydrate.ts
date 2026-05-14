import { redirect } from "next/navigation";

import { getActiveTrackers } from "@/features/dashboard/server/trackers";
import type { DashboardHydration } from "@/features/dashboard/types";
import { createClient } from "@/lib/supabase/server";
import {
  ensureProfileForAuthUser,
  getCurrentAuthUser,
} from "@/shared/server/auth";
import { mapProfile } from "@/shared/server/mappers";

export async function hydrateDashboard(): Promise<DashboardHydration> {
  const client = await createClient();
  const user = await getCurrentAuthUser(client);

  if (!user) {
    redirect("/auth");
  }

  const [profile, trackers] = await Promise.all([
    ensureProfileForAuthUser(client, user),
    getActiveTrackers(client),
  ]);

  return {
    currentUser: {
      id: user.id,
      email: user.email ?? null,
      profile: mapProfile(profile),
    },
    trackers,
  };
}
