export const isInvalidRefreshTokenError = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const candidate = error as { code?: unknown; message?: unknown };
  const code = typeof candidate.code === "string" ? candidate.code : null;
  const message =
    error instanceof Error
      ? error.message
      : typeof candidate.message === "string"
        ? candidate.message
        : "";
  const normalizedMessage = message.toLowerCase();

  return (
    code === "refresh_token_not_found" ||
    normalizedMessage.includes("invalid refresh token") ||
    normalizedMessage.includes("refresh token not found")
  );
};
