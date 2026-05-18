import type { Tables } from "@thetiagogil/shared-db-types";

export type ProfileRow = Tables<{ schema: "core" }, "profiles">;

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
