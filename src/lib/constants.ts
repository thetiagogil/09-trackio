export const APP_NAME = "Trackio";

export const DEFAULT_CATEGORIES = [
  "Anime & Manga",
  "Films",
  "TV Shows",
  "Music",
  "Books",
  "Events",
  "Notion",
  "Spreadsheets",
  "Custom URLs",
];

export const TRACKER_FIELD_LIMITS = {
  title: 120,
  url: 2048,
  category: 60,
  username: 100,
  notes: 1000,
} as const;
