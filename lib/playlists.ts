// ============================================================
// GRID Cross-Platform Playlists
// ============================================================
import { PlatformId } from "./platforms";

export type PlaylistTrack = {
  id: string;
  title: string;
  artistName: string;
  artistHandle: string;
  links: Partial<Record<PlatformId, string>>;
  grdcTrackId?: string;
};

export type GRIDPlaylist = {
  id: string;
  title: string;
  description: string;
  ownerName: string;
  ownerHandle: string;
  coverColor: string;
  tracks: PlaylistTrack[];
  createdAt: number;
  followers: number;
};

const PLAYLISTS_KEY = "grid:playlists";

export const SEED_PLAYLISTS: GRIDPlaylist[] = [
  {
    id: "pl1",
    title: "Late Night GRID",
    description: "House, disco, and after-hours grooves. Updated weekly.",
    ownerName: "Ulisses",
    ownerHandle: "ulisses",
    coverColor: "#4f8cff",
    tracks: [
      { id: "t1", title: "Safada de Berço", artistName: "Ulisses", artistHandle: "ulisses", links: { spotify: "https://open.spotify.com/track/example", apple: "https://music.apple.com/track/example" } },
      { id: "t2", title: "Midnight Drive", artistName: "Late Night Drive", artistHandle: "nightdrive", links: { spotify: "https://open.spotify.com/track/example2", bandcamp: "https://nightdrive.bandcamp.com/track/midnight" }, grdcTrackId: "t1" },
      { id: "t3", title: "Analog Dreams", artistName: "Sonya Alexander", artistHandle: "sonyalex", links: { spotify: "https://open.spotify.com/album/example", apple: "https://music.apple.com/album/example" } },
    ],
    createdAt: Date.now() - 86400000 * 7,
    followers: 1240,
  },
  {
    id: "pl2",
    title: "Brazilian Funk Essentials",
    description: "The best of Brazilian funk, baile, and funk carioca.",
    ownerName: "GRID Editorial",
    ownerHandle: "grid",
    coverColor: "#00ff87",
    tracks: [
      { id: "t1", title: "Safada de Berço", artistName: "Ulisses", artistHandle: "ulisses", links: { spotify: "https://open.spotify.com/track/example", apple: "https://music.apple.com/track/example" } },
      { id: "t4", title: "Aquecimento do Neyo", artistName: "Ulisses", artistHandle: "ulisses", links: { spotify: "https://open.spotify.com/track/example" } },
    ],
    createdAt: Date.now() - 86400000 * 14,
    followers: 3890,
  },
];

export function listPlaylists(): GRIDPlaylist[] {
  if (typeof window === "undefined") return SEED_PLAYLISTS;
  try {
    const raw = localStorage.getItem(PLAYLISTS_KEY);
    return raw ? JSON.parse(raw) : SEED_PLAYLISTS;
  } catch { return SEED_PLAYLISTS; }
}

export function getPlaylist(id: string): GRIDPlaylist | null {
  return listPlaylists().find(p => p.id === id) ?? null;
}

export function savePlaylist(p: GRIDPlaylist) {
  if (typeof window === "undefined") return;
  const all = listPlaylists();
  const idx = all.findIndex(x => x.id === p.id);
  if (idx >= 0) all[idx] = p;
  else all.unshift(p);
  localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(all));
}
