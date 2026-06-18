"use server";

import { revalidatePath } from "next/cache";

import { normalizeTrackerInput } from "@/features/trackers/lib/trackers";
import {
  formatCaughtTrackerActionError,
  formatTrackerMutationError,
} from "@/features/trackers/server/action-errors";
import {
  buildCreateTrackerArgs,
  buildRecordTrackerClickArgs,
  buildUpdateTrackerArgs,
  validateTrackerId,
} from "@/features/trackers/server/action-inputs";
import { mapTracker } from "@/features/trackers/server/mappers";
import type { Tracker, TrackerFormInput } from "@/features/trackers/types";
import { trackio, type AppSupabaseClient } from "@/lib/supabase/schemas";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/shared/server/action-result";
import {
  ensureProfileForAuthUser,
  requireAuthUser,
} from "@/shared/server/auth";

export const createTrackerAction = async (
  input: TrackerFormInput,
): Promise<ActionResult<Tracker>> => {
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
};

export const updateTrackerAction = async (
  trackerId: number,
  input: TrackerFormInput,
): Promise<ActionResult<Tracker>> => {
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
};

type DeletedTracker = {
  id: number;
};

export const deleteTrackerAction = async (
  trackerId: number,
): Promise<ActionResult<DeletedTracker>> => {
  const idResult = validateTrackerId(trackerId);

  if (!idResult.ok) {
    return idResult;
  }

  try {
    const client = await createClient();
    const user = await requireAuthUser(client);

    const { data, error } = await deleteTrackerRecord(
      client,
      idResult.id,
      user.id,
    );

    if (isForeignKeyViolation(error)) {
      const { error: clicksError } = await trackio(client)
        .from("tracker_clicks")
        .delete()
        .eq("tracker_id", idResult.id)
        .eq("user_id", user.id);

      if (clicksError) {
        return {
          ok: false,
          error: formatTrackerMutationError(clicksError.message),
        };
      }

      const retry = await deleteTrackerRecord(client, idResult.id, user.id);

      if (retry.error) {
        return {
          ok: false,
          error: formatTrackerMutationError(retry.error?.message),
        };
      }

      if (!retry.data) {
        return {
          ok: false,
          error: formatTrackerMutationError("Tracker not found"),
        };
      }

      revalidatePath("/dashboard");

      return { ok: true, data: { id: retry.data.id } };
    }

    if (error) {
      return { ok: false, error: formatTrackerMutationError(error?.message) };
    }

    if (!data) {
      return {
        ok: false,
        error: formatTrackerMutationError("Tracker not found"),
      };
    }

    revalidatePath("/dashboard");

    return { ok: true, data: { id: data.id } };
  } catch (error) {
    return { ok: false, error: formatCaughtTrackerActionError(error) };
  }
};

export const recordTrackerClickAction = async (
  trackerId: number,
): Promise<ActionResult<Tracker>> => {
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
};

const deleteTrackerRecord = async (
  client: AppSupabaseClient,
  trackerId: number,
  userId: string,
) => {
  return trackio(client)
    .from("trackers")
    .delete()
    .eq("id", trackerId)
    .eq("user_id", userId)
    .select("id")
    .maybeSingle();
};

const isForeignKeyViolation = (
  error: { code?: string; message?: string } | null,
) => {
  return (
    error?.code === "23503" ||
    error?.message?.toLowerCase().includes("foreign key") === true
  );
};
