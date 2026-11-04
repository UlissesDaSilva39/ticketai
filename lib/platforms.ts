// ============================================================
// GRID Meta-Layer — streaming platform catalog
// ============================================================

export type PlatformId =
  | "spotify" | "apple" | "youtube" | "amazon"
  | "tidal" | "deezer" | "soundcloud" | "bandcamp" | "qobuz";

export type PlatformMeta = {
  id: PlatformId;
  name: string;
  color: string;
  officialApi: boolean;
  notes: string;
  searchUrl: (query: string) => string;
};

export const PLATFORMS: Record<PlatformId, PlatformMeta> = {
  spotify: {
    id: "spotify", name: "Spotify", color: "#1DB954", officialApi: true,
    notes: "Official Web API. Dev mode restricted to 5 users, Premium required.",
    searchUrl: q => `https://open.spotify.com/search/${encodeURIComponent(q)}`,
  },
  apple: {
    id: "apple", name: "Apple Music", color: "#FA243C", officialApi: true,
    notes: "MusicKit. iOS/macOS only.",
    searchUrl: q => `https://music.apple.com/us/search?term=${encodeURIComponent(q)}`,
  },
  youtube: {
    id: "youtube", name: "YouTube Music", color: "#FF0000", officialApi: false,
    notes: "No official API. Community reverse-engineered.",
    searchUrl: q => `https://music.youtube.com/search?q=${encodeURIComponent(q)}`,
  },
  amazon: {
    id: "amazon", name: "Amazon Music", color: "#FF9900", officialApi: true,
    notes: "Partial — playback sessions, not full catalog.",
    searchUrl: q => `https://music.amazon.com/search/${encodeURIComponent(q)}`,
  },
  tidal: {
    id: "tidal", name: "Tidal", color: "#000000", officialApi: false,
    notes: "No public API. Community libs only.",
    searchUrl: q => `https://listen.tidal.com/search?q=${encodeURIComponent(q)}`,
  },
  deezer: {
    id: "deezer", name: "Deezer", color: "#A238FF", officialApi: true,
    notes: "Official API. OAuth required.",
    searchUrl: q => `https://www.deezer.com/search/${encodeURIComponent(q)}`,
  },
  soundcloud: {
    id: "soundcloud", name: "SoundCloud", color: "#FF5500", officialApi: true,
    notes: "Official API. Good for indie discovery.",
    searchUrl: q => `https://soundcloud.com/search?q=${encodeURIComponent(q)}`,
  },
  bandcamp: {
    id: "bandcamp", name: "Bandcamp", color: "#1DA0C3", officialApi: false,
    notes: "Seller-side API only. Not for streaming.",
    searchUrl: q => `https://bandcamp.com/search?q=${encodeURIComponent(q)}`,
  },
  qobuz: {
    id: "qobuz", name: "Qobuz", color: "#00B2FF", officialApi: false,
    notes: "No public API. Scraping only.",
    searchUrl: q => `https://www.qobuz.com/gb-en/search?q=${encodeURIComponent(q)}`,
  },
};

export const PLATFORM_ORDER: PlatformId[] = [
  "spotify", "apple", "youtube", "deezer",
  "tidal", "amazon", "soundcloud", "bandcamp", "qobuz"
];

// Detect user's preferred platform based on UA (no GPS, privacy-friendly)
export function detectPreferredPlatform(): PlatformId {
  if (typeof window === "undefined") return "spotify";
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "apple";
  if (/android/.test(ua)) return "spotify";
  return "spotify";
}
