export const APP_NAME = "Trackio";

export const DEFAULT_CATEGORIES = [
  "Films",
  "TV Shows",
  "Anime",
  "Music",
  "Books",
  "Manga",
  "Video Games",
];

export const TRACKER_FIELD_LIMITS = {
  title: 120,
  url: 2048,
  category: 60,
  username: 100,
  notes: 1000,
} as const;
