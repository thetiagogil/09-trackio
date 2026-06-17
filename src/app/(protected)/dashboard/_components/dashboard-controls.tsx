import { Search, X } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { DashboardRealmFilterChip } from "./dashboard-realm-filter-chip";

type DashboardControlsProps = {
  categories: string[];
  category: string;
  query: string;
  totalCount: number;
  visibleCount: number;
  onCategoryChange: (category: string) => void;
  onCreate: () => void;
  onQueryChange: (query: string) => void;
  onResetFilters: () => void;
};

export const DashboardControls = ({
  categories,
  category,
  onCategoryChange,
  onCreate,
  onQueryChange,
  onResetFilters,
  query,
  totalCount,
  visibleCount,
}: DashboardControlsProps) => {
  const hasMultipleRealms = categories.length > 1;
  const hasQuery = query.trim().length > 0;
  const hasActiveFilters = hasQuery || category !== "all";

  return (
    <section aria-label="Tracker controls" className="mb-6 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
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
        <Button className="h-11 w-full sm:w-auto" onClick={onCreate} size="lg">
          New Tracker
        </Button>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        {hasMultipleRealms ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-accent mr-1 text-[9px] tracking-wider uppercase">
              &gt; Realm
            </span>
            <DashboardRealmFilterChip
              active={category === "all"}
              onClick={() => onCategoryChange("all")}
            >
              All
            </DashboardRealmFilterChip>
            {categories.map((item) => (
              <DashboardRealmFilterChip
                active={category === item}
                key={item}
                onClick={() => onCategoryChange(item)}
              >
                {item}
              </DashboardRealmFilterChip>
            ))}
          </div>
        ) : (
          <div />
        )}

        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <div
            aria-live="polite"
            className="text-muted-foreground font-mono text-[11px] tracking-wider uppercase"
          >
            {visibleCount.toLocaleString()} / {totalCount.toLocaleString()}{" "}
            trackers
          </div>
          {hasActiveFilters ? (
            <Button onClick={onResetFilters} size="sm" variant="ghost">
              Reset
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
};
