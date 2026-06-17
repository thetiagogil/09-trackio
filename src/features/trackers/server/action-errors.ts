import { AuthRequiredError } from "@/shared/server/auth";

export const formatCaughtTrackerActionError = (error: unknown) => {
  if (error instanceof AuthRequiredError) {
    return "Your session expired. Sign in again to continue.";
  }

  if (error instanceof Error) {
    return formatTrackerMutationError(error.message);
  }

  return "Something went wrong. Try again.";
};

export const formatTrackerMutationError = (message: string | undefined) => {
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
};
