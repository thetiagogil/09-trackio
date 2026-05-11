import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { CurrentUser, Tracker } from "@/types/trackio";
import { mapProfile } from "../mappers";
import { ensureProfileForAuthUser, getCurrentAuthUser } from "./auth";
import { getActiveTrackers } from "./trackers";

export type DashboardHydration = {
  currentUser: CurrentUser;
  trackers: Tracker[];
};

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
