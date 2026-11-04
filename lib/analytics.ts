// ============================================================
// GRID Streaming Analytics
// ============================================================
import { PlatformId } from "./platforms";

export type PlatformStats = {
  platform: PlatformId;
  streams: number;
  monthlyListeners: number;
  countries: number;
};

export type ArtistAnalytics = {
  artistHandle: string;
  artistName: string;
  totalStreams: number;
  monthlyListeners: number;
  countries: number;
  growth: number;
  perPlatform: PlatformStats[];
  topCountries: { code: string; name: string; flag: string; pct: number }[];
  topPlaylists: { name: string; tracks: number; platform: PlatformId }[];
  connected: { platform: PlatformId; connected: boolean }[];
  lastUpdated: number;
};

const ANALYTICS_KEY = "grid:analytics";

export const SEED_ANALYTICS: ArtistAnalytics[] = [
  {
    artistHandle: "sonyalex",
    artistName: "Sonya Alexander",
    totalStreams: 1240000,
    monthlyListeners: 45200,
    countries: 89,
    growth: 12,
    perPlatform: [
      { platform: "spotify", streams: 890000, monthlyListeners: 32000, countries: 89 },
      { platform: "apple", streams: 210000, monthlyListeners: 8500, countries: 45 },
      { platform: "youtube", streams: 120000, monthlyListeners: 3800, countries: 34 },
      { platform: "tidal", streams: 20000, monthlyListeners: 900, countries: 12 },
    ],
    topCountries: [
      { code: "GB", name: "United Kingdom", flag: "🇬🇧", pct: 24 },
      { code: "BR", name: "Brazil", flag: "🇧🇷", pct: 18 },
      { code: "US", name: "United States", flag: "🇺🇸", pct: 15 },
      { code: "DE", name: "Germany", flag: "🇩🇪", pct: 8 },
      { code: "PT", name: "Portugal", flag: "🇵🇹", pct: 6 },
    ],
    topPlaylists: [
      { name: "New Music Friday UK", tracks: 2, platform: "spotify" },
      { name: "Fresh Finds", tracks: 1, platform: "spotify" },
      { name: "Neo-Soul Now", tracks: 3, platform: "apple" },
    ],
    connected: [
      { platform: "spotify", connected: true },
      { platform: "apple", connected: true },
      { platform: "youtube", connected: false },
      { platform: "deezer", connected: false },
    ],
    lastUpdated: Date.now() - 3600000,
  },
  {
    artistHandle: "ulisses",
    artistName: "Ulisses",
    totalStreams: 124000,
    monthlyListeners: 8400,
    countries: 34,
    growth: 28,
    perPlatform: [
      { platform: "spotify", streams: 89000, monthlyListeners: 6200, countries: 34 },
      { platform: "apple", streams: 24000, monthlyListeners: 1500, countries: 18 },
      { platform: "youtube", streams: 11000, monthlyListeners: 700, countries: 12 },
    ],
    topCountries: [
      { code: "BR", name: "Brazil", flag: "🇧🇷", pct: 62 },
      { code: "PT", name: "Portugal", flag: "🇵🇹", pct: 12 },
      { code: "GB", name: "United Kingdom", flag: "🇬🇧", pct: 9 },
      { code: "US", name: "United States", flag: "🇺🇸", pct: 7 },
    ],
    topPlaylists: [
      { name: "Brazilian Funk Now", tracks: 3, platform: "spotify" },
    ],
    connected: [
      { platform: "spotify", connected: true },
      { platform: "apple", connected: true },
      { platform: "youtube", connected: false },
      { platform: "deezer", connected: false },
    ],
    lastUpdated: Date.now() - 7200000,
  },
];

export function listAnalytics(): ArtistAnalytics[] {
  if (typeof window === "undefined") return SEED_ANALYTICS;
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    return raw ? JSON.parse(raw) : SEED_ANALYTICS;
  } catch { return SEED_ANALYTICS; }
}

export function getAnalytics(handle: string): ArtistAnalytics | null {
  return listAnalytics().find(a => a.artistHandle === handle) ?? null;
}

export function saveAnalytics(data: ArtistAnalytics) {
  if (typeof window === "undefined") return;
  const all = listAnalytics();
  const idx = all.findIndex(a => a.artistHandle === data.artistHandle);
  if (idx >= 0) all[idx] = data;
  else all.unshift(data);
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(all));
}
