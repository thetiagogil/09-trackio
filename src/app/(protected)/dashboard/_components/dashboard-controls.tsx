import { Search, X } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import type { DashboardTrackerSort } from "../_lib/dashboard-view-model";

const DASHBOARD_SORT_OPTIONS = [
  { label: "Name A-Z", value: "name" },
  { label: "Recent launch", value: "recent" },
  { label: "Most launches", value: "launches" },
  { label: "Newest", value: "newest" },
];

type DashboardControlsProps = {
  categories: string[];
  category: string;
  query: string;
  sort: DashboardTrackerSort;
  onCategoryChange: (category: string) => void;
  onCreate: () => void;
  onQueryChange: (query: string) => void;
  onResetFilters: () => void;
  onSortChange: (sort: DashboardTrackerSort) => void;
};

export const DashboardControls = ({
  categories,
  category,
  onCategoryChange,
  onCreate,
  onQueryChange,
  onResetFilters,
  onSortChange,
  query,
  sort,
}: DashboardControlsProps) => {
  const hasQuery = query.trim().length > 0;
  const hasActiveControls = hasQuery || category !== "all" || sort !== "name";
  const realmOptions = [
    { label: "All realms", value: "all" },
    ...categories.map((item) => ({ label: item, value: item })),
  ];

  return (
    <section aria-label="Tracker controls" className="mb-6 space-y-3">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(10rem,13rem)_minmax(10rem,13rem)_auto] md:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            aria-label="Search trackers"
            className="bg-card h-11 pr-10 pl-9 text-sm"
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search trackers, URLs, notes..."
            value={query}
          />
          {hasQuery ? (
            <button
              aria-label="Clear tracker search"
              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring absolute top-1/2 right-3 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
              onClick={() => onQueryChange("")}
              type="button"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>

        <Select
          aria-label="Filter trackers by realm"
          className="bg-card h-11 rounded-sm text-xs tracking-wider uppercase"
          clearable={false}
          onValueChange={onCategoryChange}
          options={realmOptions}
          value={category}
        />

        <Select
          aria-label="Sort trackers"
          className="bg-card h-11 rounded-sm text-xs tracking-wider uppercase"
          clearable={false}
          onValueChange={(value) => {
            if (isDashboardTrackerSort(value)) {
              onSortChange(value);
            }
          }}
          options={DASHBOARD_SORT_OPTIONS}
          value={sort}
        />

        <div className="flex gap-2 md:justify-end">
          {hasActiveControls ? (
            <Button
              className="h-11 flex-1 md:flex-none"
              onClick={onResetFilters}
              size="lg"
              variant="ghost"
            >
              Reset
            </Button>
          ) : null}
          <Button
            className="h-11 flex-1 md:flex-none"
            onClick={onCreate}
            size="lg"
          >
            New Tracker
          </Button>
        </div>
      </div>
    </section>
  );
};

const isDashboardTrackerSort = (
  value: string,
): value is DashboardTrackerSort => {
  return DASHBOARD_SORT_OPTIONS.some((option) => option.value === value);
};
