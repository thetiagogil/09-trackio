import { DEFAULT_CATEGORIES } from "@/features/trackers/constants";
import type { Tracker, TrackerStats } from "@/features/trackers/types";
import type { CurrentUser } from "@/shared/types";

const TRACKER_NAME_COLLATOR = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

export const getDashboardProfileName = (currentUser: CurrentUser) => {
  return (
    currentUser.profile.displayName ??
    currentUser.profile.username ??
    currentUser.email ??
    "Trackio user"
  );
};

export const getDashboardCategories = (trackers: Tracker[]) => {
  const categories = new Set(DEFAULT_CATEGORIES);
  trackers.forEach((tracker) => categories.add(tracker.category));

  return Array.from(categories);
};

export const getDashboardVisibleRealms = (trackers: Tracker[]) => {
  const realms = new Set<string>();
  trackers.forEach((tracker) => realms.add(tracker.category));

  return Array.from(realms);
};

export const getDashboardFilteredTrackers = (
  trackers: Tracker[],
  query: string,
  category: string,
) => {
  const normalizedQuery = query.trim().toLowerCase();

  return sortDashboardTrackersByName(
    trackers.filter((tracker) => {
      if (category !== "all" && tracker.category !== category) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const searchable = [
        tracker.title,
        tracker.url,
        tracker.category,
        tracker.notes ?? "",
        tracker.username ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedQuery);
    }),
  );
};

export const getDashboardStats = (trackers: Tracker[]): TrackerStats => {
  let totalXp = 0;
  let totalLaunches = 0;
  let topTracker: Tracker | null = null;
  const categories = new Set<string>();

  trackers.forEach((tracker) => {
    totalXp += tracker.xp;
    totalLaunches += tracker.clickCount;
    categories.add(tracker.category);

    if (!topTracker || tracker.clickCount > topTracker.clickCount) {
      topTracker = tracker;
    }
  });

  return {
    totalTrackers: trackers.length,
    totalXp,
    totalLaunches,
    categoryCount: categories.size,
    topTracker,
  };
};

export function sortDashboardTrackersByName(trackers: Tracker[]) {
  return [...trackers].sort((left, right) => {
    const titleComparison = TRACKER_NAME_COLLATOR.compare(
      left.title,
      right.title,
    );

    if (titleComparison !== 0) {
      return titleComparison;
    }

    return left.id - right.id;
  });
}
