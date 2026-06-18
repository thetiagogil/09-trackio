import { redirect } from "next/navigation";

import { getTrackers } from "@/features/trackers/server/queries";
import type { Tracker } from "@/features/trackers/types";
import { createClient } from "@/lib/supabase/server";
import {
  ensureProfileForAuthUser,
  getCurrentAuthUser,
} from "@/shared/server/auth";
import { mapProfile } from "@/shared/server/mappers";
import type { CurrentUser } from "@/shared/types";

export type DashboardHydration = {
  currentUser: CurrentUser;
  trackers: Tracker[];
};

export const hydrateDashboard = async (): Promise<DashboardHydration> => {
  const client = await createClient();
  const user = await getCurrentAuthUser(client);

  if (!user) {
    redirect("/auth");
  }

  const [profile, trackers] = await Promise.all([
    ensureProfileForAuthUser(client, user),
    getTrackers(client),
  ]);

  return {
    currentUser: {
      id: user.id,
      email: user.email ?? null,
      profile: mapProfile(profile),
    },
    trackers,
  };
};
