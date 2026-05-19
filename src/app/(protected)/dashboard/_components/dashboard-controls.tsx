import { Plus, Search } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { DashboardRealmFilterChip } from "./dashboard-realm-filter-chip";

type DashboardControlsProps = {
  categories: string[];
  category: string;
  query: string;
  onCategoryChange: (category: string) => void;
  onCreate: () => void;
  onQueryChange: (query: string) => void;
};

export function DashboardControls({
  categories,
  category,
  onCategoryChange,
  onCreate,
  onQueryChange,
  query,
}: DashboardControlsProps) {
  const hasMultipleRealms = categories.length > 1;

  return (
    <section className="mb-6 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            className="bg-card h-11 pl-9 text-sm"
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search trackers, URLs, notes..."
            value={query}
          />
        </div>
        <Button className="h-11 w-full sm:w-auto" onClick={onCreate} size="lg">
          <Plus className="h-4 w-4" />
          New Tracker
        </Button>
      </div>

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
      ) : null}
    </section>
  );
}
