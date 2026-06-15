"use client";

import { DashboardLoadError } from "./_components/dashboard-load-error";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  return <DashboardLoadError error={error} reset={reset} />;
}
