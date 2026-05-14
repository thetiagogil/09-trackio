import { Search } from "lucide-react";

import { DashboardRealmFilterChip } from "@/features/dashboard/components/dashboard-realm-filter-chip";
import { Input } from "@/shared/components/ui/input";

type DashboardControlsProps = {
  categories: string[];
  category: string;
  query: string;
  onCategoryChange: (category: string) => void;
  onQueryChange: (query: string) => void;
};

export function DashboardControls({
  categories,
  category,
  onCategoryChange,
  onQueryChange,
  query,
}: DashboardControlsProps) {
  const hasMultipleRealms = categories.length > 1;

  return (
    <section className="mb-6 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="h-11 bg-card pl-9 text-sm"
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search trackers, URLs, notes..."
          value={query}
        />
      </div>

      {hasMultipleRealms ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 font-display text-[9px] uppercase tracking-wider text-accent">
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
      ) : null}
    </section>
  );
}
