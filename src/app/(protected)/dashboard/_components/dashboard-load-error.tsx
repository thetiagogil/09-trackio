"use client";

import { AppHeader } from "@/shared/components/layout/app-header";
import { AppMain } from "@/shared/components/layout/app-main";
import { AppShell } from "@/shared/components/layout/app-shell";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";

type DashboardLoadErrorProps = {
  error: unknown;
  reset?: () => void;
};

export function DashboardLoadError({ error, reset }: DashboardLoadErrorProps) {
  return (
    <AppShell>
      <AppHeader />
      <AppMain className="flex flex-1 items-center justify-center pb-12">
        <Card
          as="section"
          className="min-w-0 p-6"
          style={{ width: "min(42rem, calc(100vw - 5rem))" }}
          tone="danger"
        >
          <p className="text-destructive mb-3 font-mono text-[11px] tracking-[0.28em] uppercase">
            database error
          </p>
          <h1 className="font-display text-glow-primary text-xl leading-relaxed">
            Trackers could not load
          </h1>
          <p className="text-muted-foreground mt-4 text-sm leading-6">
            {formatDashboardLoadError(error)}
          </p>
          {reset ? (
            <Button className="mt-6" onClick={reset}>
              Retry dashboard
            </Button>
          ) : null}
        </Card>
      </AppMain>
    </AppShell>
  );
}

function formatDashboardLoadError(error: unknown) {
  const message = readErrorMessage(error) ?? "";

  if (message.includes("Invalid schema: trackio")) {
    return "The shared Supabase project is reachable, but the Trackio schema is not exposed through the Data API. Add `trackio` to the project's exposed schemas, then reload the PostgREST schema cache.";
  }

  return message || "Something went wrong while loading Trackio.";
}

function readErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return null;
}
