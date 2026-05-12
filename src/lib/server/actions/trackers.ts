"use server";

import { revalidatePath } from "next/cache";

import { normalizeTrackerInput } from "@/lib/trackers";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";
import type { Tracker, TrackerFormInput } from "@/types/trackio";
import { AuthRequiredError, ensureProfileForAuthUser, requireAuthUser } from "../data";
import { mapTracker } from "../mappers";
import { trackio } from "../schemas";
import type { ActionResult } from "./types";

type CreateTrackerArgs = Database["trackio"]["Functions"]["create_tracker"]["Args"];
type UpdateTrackerArgs = Database["trackio"]["Functions"]["update_tracker"]["Args"];

export async function createTrackerAction(
  input: TrackerFormInput,
): Promise<ActionResult<Tracker>> {
  const normalized = normalizeTrackerInput(input);

  if (!normalized.ok) {
    return { ok: false, error: normalized.error };
  }

  try {
    const client = await createClient();
    const user = await requireAuthUser(client);
    await ensureProfileForAuthUser(client, user);

    const { data, error } = await trackio(client).rpc(
      "create_tracker",
      buildCreateTrackerArgs(normalized.data),
    );

    if (error || !data) {
      return { ok: false, error: formatMutationError(error?.message) };
    }

    revalidatePath("/dashboard");

    return { ok: true, data: mapTracker(data) };
  } catch (error) {
    return { ok: false, error: formatCaughtError(error) };
  }
}

export async function updateTrackerAction(
  trackerId: number,
  input: TrackerFormInput,
): Promise<ActionResult<Tracker>> {
  const idResult = validateTrackerId(trackerId);

  if (!idResult.ok) {
    return idResult;
  }

  const normalized = normalizeTrackerInput(input);

  if (!normalized.ok) {
    return { ok: false, error: normalized.error };
  }

  try {
    const client = await createClient();
    await requireAuthUser(client);

    const { data, error } = await trackio(client).rpc(
      "update_tracker",
      buildUpdateTrackerArgs(idResult.id, normalized.data),
    );

    if (error || !data) {
      return { ok: false, error: formatMutationError(error?.message) };
    }

    revalidatePath("/dashboard");

    return { ok: true, data: mapTracker(data) };
  } catch (error) {
    return { ok: false, error: formatCaughtError(error) };
  }
}

export async function archiveTrackerAction(
  trackerId: number,
): Promise<ActionResult<Tracker>> {
  const idResult = validateTrackerId(trackerId);

  if (!idResult.ok) {
    return idResult;
  }

  try {
    const client = await createClient();
    await requireAuthUser(client);

    const { data, error } = await trackio(client).rpc("archive_tracker", {
      p_tracker_id: idResult.id,
    });

    if (error || !data) {
      return { ok: false, error: formatMutationError(error?.message) };
    }

    revalidatePath("/dashboard");

    return { ok: true, data: mapTracker(data) };
  } catch (error) {
    return { ok: false, error: formatCaughtError(error) };
  }
}

export async function recordTrackerClickAction(
  trackerId: number,
): Promise<ActionResult<Tracker>> {
  const idResult = validateTrackerId(trackerId);

  if (!idResult.ok) {
    return idResult;
  }

  try {
    const client = await createClient();
    await requireAuthUser(client);

    const { data, error } = await trackio(client).rpc("record_tracker_click", {
      p_tracker_id: idResult.id,
    });

    if (error || !data) {
      return { ok: false, error: formatMutationError(error?.message) };
    }

    revalidatePath("/dashboard");

    return { ok: true, data: mapTracker(data) };
  } catch (error) {
    return { ok: false, error: formatCaughtError(error) };
  }
}

function buildCreateTrackerArgs(input: {
  title: string;
  url: string;
  category: string;
  username: string | null;
  notes: string | null;
}): CreateTrackerArgs {
  return {
    p_title: input.title,
    p_url: input.url,
    p_category: input.category,
    ...(input.username ? { p_username: input.username } : {}),
    ...(input.notes ? { p_notes: input.notes } : {}),
  };
}

function buildUpdateTrackerArgs(
  trackerId: number,
  input: {
    title: string;
    url: string;
    category: string;
    username: string | null;
    notes: string | null;
  },
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

function validateTrackerId(trackerId: number):
  | { ok: true; id: number }
  | { ok: false; error: string } {
  if (!Number.isSafeInteger(trackerId) || trackerId <= 0) {
    return { ok: false, error: "Invalid tracker id." };
  }

  return { ok: true, id: trackerId };
}

function formatCaughtError(error: unknown) {
  if (error instanceof AuthRequiredError) {
    return "Your session expired. Sign in again to continue.";
  }

  if (error instanceof Error) {
    return formatMutationError(error.message);
  }

  return "Something went wrong. Try again.";
}

function formatMutationError(message: string | undefined) {
  if (!message) {
    return "Something went wrong. Try again.";
  }

  if (message.includes("Authentication required")) {
    return "Your session expired. Sign in again to continue.";
  }

  if (message.includes("Tracker not found")) {
    return "This tracker is no longer available.";
  }

  if (message.includes("violates check constraint")) {
    return "The tracker fields do not meet the database constraints.";
  }

  return message;
}
