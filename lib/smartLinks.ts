// ============================================================
// GRID Smart Links — one link, every platform
// ============================================================
import { PlatformId } from "./platforms";

export type SmartLink = {
  id: string;
  trackId: string;
  artistHandle: string;
  artistName: string;
  title: string;
  coverColor: string;
  platforms: Partial<Record<PlatformId, string>>;
  grdcTrackId?: string;
  grdcStreamId?: string;
  createdAt: number;
  clicks: Record<PlatformId, number>;
};

const LINKS_KEY = "grid:smartlinks";

export const SEED_LINKS: SmartLink[] = [
  {
    id: "sl1",
    trackId: "safada",
    artistHandle: "ulisses",
    artistName: "Ulisses",
    title: "Safada de Berço",
    coverColor: "#4f8cff",
    platforms: {
      spotify: "https://open.spotify.com/track/example",
      apple: "https://music.apple.com/track/example",
      youtube: "https://music.youtube.com/watch?v=example",
      deezer: "https://deezer.com/track/example",
    },
    grdcTrackId: undefined,
    grdcStreamId: undefined,
    createdAt: Date.now() - 86400000 * 5,
    clicks: { spotify: 1240, apple: 320, youtube: 180, amazon: 0, tidal: 0, deezer: 45, soundcloud: 0, bandcamp: 0, qobuz: 0 },
  },
  {
    id: "sl2",
    trackId: "midnight",
    artistHandle: "nightdrive",
    artistName: "Late Night Drive",
    title: "Midnight Drive",
    coverColor: "#00ff87",
    platforms: {
      spotify: "https://open.spotify.com/track/example2",
      apple: "https://music.apple.com/track/example2",
      bandcamp: "https://nightdrive.bandcamp.com/track/midnight",
    },
    grdcTrackId: "t1",
    grdcStreamId: "s1",
    createdAt: Date.now() - 86400000 * 12,
    clicks: { spotify: 890, apple: 220, youtube: 0, amazon: 0, tidal: 0, deezer: 0, soundcloud: 0, bandcamp: 145, qobuz: 0 },
  },
  {
    id: "sl3",
    trackId: "analog",
    artistHandle: "sonyalex",
    artistName: "Sonya Alexander",
    title: "Analog Dreams (EP)",
    coverColor: "#a855f7",
    platforms: {
      spotify: "https://open.spotify.com/album/example",
      apple: "https://music.apple.com/album/example",
      youtube: "https://music.youtube.com/playlist?list=example",
      tidal: "https://tidal.com/album/example",
    },
    grdcTrackId: undefined,
    grdcStreamId: undefined,
    createdAt: Date.now() - 86400000 * 30,
    clicks: { spotify: 2340, apple: 540, youtube: 320, amazon: 0, tidal: 45, deezer: 0, soundcloud: 0, bandcamp: 0, qobuz: 12 },
  },
];

export function listSmartLinks(): SmartLink[] {
  if (typeof window === "undefined") return SEED_LINKS;
  try {
    const raw = localStorage.getItem(LINKS_KEY);
    return raw ? JSON.parse(raw) : SEED_LINKS;
  } catch { return SEED_LINKS; }
}

export function getSmartLink(id: string): SmartLink | null {
  return listSmartLinks().find(l => l.id === id) ?? null;
}

export function getSmartLinksByArtist(handle: string): SmartLink[] {
  return listSmartLinks().filter(l => l.artistHandle === handle);
}

export function saveSmartLink(link: SmartLink) {
  if (typeof window === "undefined") return;
  const all = listSmartLinks();
  const idx = all.findIndex(l => l.id === link.id);
  if (idx >= 0) all[idx] = link;
  else all.unshift(link);
  localStorage.setItem(LINKS_KEY, JSON.stringify(all));
}

export function trackClick(linkId: string, platform: any) {
  if (typeof window === "undefined") return;
  const all = listSmartLinks();
  const link = all.find(l => l.id === linkId);
  if (!link) return;
  link.clicks[platform] = (link.clicks[platform] ?? 0) + 1;
  localStorage.setItem(LINKS_KEY, JSON.stringify(all));
}
