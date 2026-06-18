"use client";

import { Loader2, LogOut } from "lucide-react";

import { AppHeader } from "@/shared/components/layout/app-header";
import { AppLogo } from "@/shared/components/layout/app-logo";
import { AppMain } from "@/shared/components/layout/app-main";
import { AppShell } from "@/shared/components/layout/app-shell";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { TrackerForm } from "@/features/trackers/components/tracker-form";
import { TrackerList } from "@/features/trackers/components/tracker-list";
import { getDashboardProfileName } from "../_lib/dashboard-view-model";
import { useDashboardTrackers } from "../_hooks/use-dashboard-trackers";
import type { Tracker } from "@/features/trackers/types";
import type { CurrentUser } from "@/shared/types";
import { DashboardActionFeedback } from "./dashboard-action-feedback";
import { DashboardControls } from "./dashboard-controls";
import { DashboardSummary } from "./dashboard-summary";

type DashboardViewProps = {
  initialTrackers: Tracker[];
  currentUser: CurrentUser;
};

export const DashboardView = ({
  currentUser,
  initialTrackers,
}: DashboardViewProps) => {
  const dashboard = useDashboardTrackers(initialTrackers);
  const profileName = getDashboardProfileName(currentUser);

  return (
    <AppShell>
      <AppHeader
        innerClassName="flex-wrap"
        leading={
          <div>
            <AppLogo />
          </div>
        }
        actions={
          <>
            <div className="mr-2 hidden flex-col items-end sm:flex">
              <span className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
                signed in
              </span>
              <span className="font-display text-glow-accent max-w-44 truncate text-[11px]">
                {profileName}
              </span>
            </div>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    aria-label="Sign out"
                    disabled={dashboard.isAuthPending}
                    onClick={dashboard.signOut}
                    size="lg"
                    variant="outline"
                  >
                    {dashboard.isAuthPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Sign out</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        }
      />

      <AppMain className="pb-8">
        <DashboardSummary
          playerLevel={dashboard.playerLevel}
          profileName={profileName}
          stats={dashboard.stats}
        />
        <DashboardActionFeedback message={dashboard.feedback} />
        <DashboardControls
          categories={dashboard.visibleRealms}
          category={dashboard.activeCategory}
          onCategoryChange={dashboard.setCategory}
          onCreate={dashboard.openCreateForm}
          onQueryChange={dashboard.setQuery}
          onResetFilters={dashboard.resetFilters}
          onSortChange={dashboard.setSort}
          query={dashboard.query}
          sort={dashboard.sort}
        />
        <TrackerList
          allTrackerCount={dashboard.trackers.length}
          hasActiveFilters={dashboard.hasActiveFilters}
          onCreate={dashboard.openCreateForm}
          onDelete={dashboard.requestDeleteTracker}
          onEdit={dashboard.openEditForm}
          onLaunch={dashboard.launchTracker}
          onResetFilters={dashboard.resetFilters}
          pendingTrackerIds={dashboard.pendingTrackerIds}
          trackers={dashboard.filteredTrackers}
        />
      </AppMain>

      <TrackerForm
        categories={dashboard.categories}
        editing={dashboard.editing}
        key={`${dashboard.formOpen ? "open" : "closed"}-${dashboard.editing?.id ?? "new"}`}
        onClose={dashboard.closeForm}
        onSubmit={dashboard.submitTracker}
        open={dashboard.formOpen}
        pending={dashboard.isTrackerPending}
      />

      <AlertDialog
        onOpenChange={(open) => {
          if (!open) {
            dashboard.setDeleteCandidate(null);
          }
        }}
        open={Boolean(dashboard.deleteCandidate)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tracker</AlertDialogTitle>
            <AlertDialogDescription>
              {dashboard.deleteCandidate
                ? `Delete ${dashboard.deleteCandidate.title}? This removes the tracker and its launch history.`
                : "Delete this tracker? This removes the tracker and its launch history."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={dashboard.isTrackerPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={dashboard.isTrackerPending}
              onClick={dashboard.confirmDeleteTracker}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
};
