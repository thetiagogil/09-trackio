"use server";

import { revalidatePath } from "next/cache";

import { normalizeTrackerInput } from "@/features/trackers/lib/trackers";
import {
  formatCaughtTrackerActionError,
  formatTrackerMutationError,
} from "@/features/trackers/server/action-errors";
import {
  buildArchiveTrackerArgs,
  buildCreateTrackerArgs,
  buildRecordTrackerClickArgs,
  buildUpdateTrackerArgs,
  validateTrackerId,
} from "@/features/trackers/server/action-inputs";
import { mapTracker } from "@/features/trackers/server/mappers";
import type { Tracker, TrackerFormInput } from "@/features/trackers/types";
import { trackio } from "@/lib/supabase/schemas";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/shared/server/action-result";
import {
  ensureProfileForAuthUser,
  requireAuthUser,
} from "@/shared/server/auth";

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
      return { ok: false, error: formatTrackerMutationError(error?.message) };
    }

    revalidatePath("/dashboard");

    return { ok: true, data: mapTracker(data) };
  } catch (error) {
    return { ok: false, error: formatCaughtTrackerActionError(error) };
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
      return { ok: false, error: formatTrackerMutationError(error?.message) };
    }

    revalidatePath("/dashboard");

    return { ok: true, data: mapTracker(data) };
  } catch (error) {
    return { ok: false, error: formatCaughtTrackerActionError(error) };
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

    const { data, error } = await trackio(client).rpc(
      "archive_tracker",
      buildArchiveTrackerArgs(idResult.id),
    );

    if (error || !data) {
      return { ok: false, error: formatTrackerMutationError(error?.message) };
    }

    revalidatePath("/dashboard");

    return { ok: true, data: mapTracker(data) };
  } catch (error) {
    return { ok: false, error: formatCaughtTrackerActionError(error) };
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

    const { data, error } = await trackio(client).rpc(
      "record_tracker_click",
      buildRecordTrackerClickArgs(idResult.id),
    );

    if (error || !data) {
      return { ok: false, error: formatTrackerMutationError(error?.message) };
    }

    revalidatePath("/dashboard");

    return { ok: true, data: mapTracker(data) };
  } catch (error) {
    return { ok: false, error: formatCaughtTrackerActionError(error) };
  }
}
