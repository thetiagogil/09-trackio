import { DEFAULT_CATEGORIES, TRACKER_FIELD_LIMITS } from "@/lib/constants";
import type { RarityInfo, TrackerFormInput } from "@/types/trackio";

export type NormalizedTrackerInput = {
  title: string;
  url: string;
  category: string;
  username: string | null;
  notes: string | null;
};

export function normalizeTrackerInput(input: TrackerFormInput):
  | { ok: true; data: NormalizedTrackerInput }
  | { ok: false; error: string } {
  const title = input.title.trim();
  const category = input.category.trim();
  const username = normalizeOptionalText(input.username);
  const notes = normalizeOptionalText(input.notes);

  if (!title || title.length > TRACKER_FIELD_LIMITS.title) {
    return {
      ok: false,
      error: `Title must be between 1 and ${TRACKER_FIELD_LIMITS.title} characters.`,
    };
  }

  const normalizedUrl = normalizeTrackerUrl(input.url);

  if (!normalizedUrl.ok) {
    return normalizedUrl;
  }

  if (!category || category.length > TRACKER_FIELD_LIMITS.category) {
    return {
      ok: false,
      error: `Category must be between 1 and ${TRACKER_FIELD_LIMITS.category} characters.`,
    };
  }

  if (username && username.length > TRACKER_FIELD_LIMITS.username) {
    return {
      ok: false,
      error: `Username must be ${TRACKER_FIELD_LIMITS.username} characters or less.`,
    };
  }

  if (notes && notes.length > TRACKER_FIELD_LIMITS.notes) {
    return {
      ok: false,
      error: `Notes must be ${TRACKER_FIELD_LIMITS.notes} characters or less.`,
    };
  }

  return {
    ok: true,
    data: {
      title,
      url: normalizedUrl.url,
      category,
      username,
      notes,
    },
  };
}

export function formatDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function trackerInitials(title: string) {
  const words = title.trim().split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
  }

  return title.slice(0, 2).toUpperCase();
}

export function relativeTime(isoDate: string | null) {
  if (!isoDate) {
    return "never";
  }

  const timestamp = new Date(isoDate).getTime();

  if (Number.isNaN(timestamp)) {
    return "unknown";
  }

  const diffMs = Date.now() - timestamp;
  const minute = 60_000;
  const hour = minute * 60;
  const day = hour * 24;

  if (diffMs < minute) {
    return "just now";
  }

  if (diffMs < hour) {
    return `${Math.floor(diffMs / minute)}m ago`;
  }

  if (diffMs < day) {
    return `${Math.floor(diffMs / hour)}h ago`;
  }

  const days = Math.floor(diffMs / day);

  if (days < 30) {
    return `${days}d ago`;
  }

  const months = Math.floor(days / 30);

  if (months < 12) {
    return `${months}mo ago`;
  }

  return `${Math.floor(months / 12)}y ago`;
}

export function levelFromXp(xp: number) {
  let level = 1;
  let remaining = Math.max(0, xp);
  let cost = 25;

  while (remaining >= cost) {
    remaining -= cost;
    level += 1;
    cost = 25 * level;
  }

  return {
    level,
    percent: Math.min(100, Math.round((remaining / cost) * 100)),
    next: cost - remaining,
  };
}

export function rarityFromXp(xp: number): RarityInfo {
  if (xp >= 1000) {
    return { label: "Legendary", rarity: "legendary" };
  }

  if (xp >= 500) {
    return { label: "Epic", rarity: "epic" };
  }

  if (xp >= 200) {
    return { label: "Rare", rarity: "rare" };
  }

  if (xp >= 50) {
    return { label: "Uncommon", rarity: "uncommon" };
  }

  return { label: "Common", rarity: "common" };
}

export { DEFAULT_CATEGORIES, TRACKER_FIELD_LIMITS };

function normalizeTrackerUrl(value: string):
  | { ok: true; url: string }
  | { ok: false; error: string } {
  const trimmed = value.trim();

  if (!trimmed || trimmed.length > TRACKER_FIELD_LIMITS.url) {
    return {
      ok: false,
      error: `URL must be between 1 and ${TRACKER_FIELD_LIMITS.url} characters.`,
    };
  }

  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const parsed = new URL(candidate);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { ok: false, error: "URL must start with http:// or https://." };
    }

    if (!parsed.hostname) {
      return { ok: false, error: "URL must include a hostname." };
    }

    return { ok: true, url: parsed.toString() };
  } catch {
    return { ok: false, error: "Enter a valid URL." };
  }
}

function normalizeOptionalText(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}
