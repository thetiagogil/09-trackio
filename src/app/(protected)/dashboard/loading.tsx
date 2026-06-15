import { AppHeader } from "@/shared/components/layout/app-header";
import { AppLogo } from "@/shared/components/layout/app-logo";
import { AppMain } from "@/shared/components/layout/app-main";
import { AppShell } from "@/shared/components/layout/app-shell";
import { Card } from "@/shared/components/ui/card";

const trackerPlaceholders = Array.from({ length: 6 }, (_, index) => index);

export default function DashboardLoading() {
  return (
    <AppShell>
      <AppHeader
        innerClassName="flex-wrap"
        leading={
          <div>
            <AppLogo />
          </div>
        }
      />

      <AppMain aria-label="Loading dashboard" className="pb-8">
        <Card as="section" className="mb-8 p-6" gradient tone="primary">
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <div className="bg-muted mb-4 h-3 w-40 animate-pulse rounded-sm" />
              <div className="bg-muted h-12 w-44 animate-pulse rounded-sm" />
              <div className="bg-muted mt-4 h-3 max-w-80 animate-pulse rounded-sm" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-muted h-24 w-24 animate-pulse rounded-md" />
              <div className="bg-muted h-24 w-24 animate-pulse rounded-md" />
              <div className="bg-muted h-24 w-24 animate-pulse rounded-md" />
            </div>
          </div>
        </Card>

        <div className="mb-6 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="bg-muted h-11 min-w-0 flex-1 animate-pulse rounded-md" />
            <div className="bg-muted h-11 w-full animate-pulse rounded-md sm:w-36" />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="bg-muted h-8 w-16 animate-pulse rounded-sm" />
            <div className="bg-muted h-8 w-24 animate-pulse rounded-sm" />
            <div className="bg-muted h-8 w-20 animate-pulse rounded-sm" />
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trackerPlaceholders.map((item) => (
            <Card
              aria-hidden="true"
              as="article"
              className="min-h-72 p-5"
              key={item}
            >
              <div className="flex items-start gap-3">
                <div className="bg-muted h-12 w-12 animate-pulse rounded-md" />
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="bg-muted h-4 w-3/4 animate-pulse rounded-sm" />
                  <div className="bg-muted h-3 w-1/2 animate-pulse rounded-sm" />
                </div>
              </div>
              <div className="bg-muted mt-8 h-16 animate-pulse rounded-sm" />
              <div className="bg-muted mt-6 h-3 animate-pulse rounded-sm" />
              <div className="bg-muted mt-8 h-9 animate-pulse rounded-md" />
            </Card>
          ))}
        </section>
      </AppMain>
    </AppShell>
  );
}
