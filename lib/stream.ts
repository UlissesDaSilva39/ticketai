// ============================================================
// GRID Stream — video + live broadcast data model
// ============================================================

export type StreamKind = "video" | "live" | "scheduled";
export type StreamCategory = "music-video" | "dj-set" | "studio-session" | "interview" | "documentary" | "concert" | "behind-the-scenes";

export type StreamItem = {
  id: string;
  title: string;
  description: string;
  artistHandle: string;
  artistName: string;
  kind: StreamKind;
  category: StreamCategory;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  scheduledFor?: number;
  viewerCount?: number;
  likeCount?: number;
  isExclusive?: boolean;
  ticketPrice?: number;
  createdAt: number;
};

export type StreamChannel = {
  handle: string;
  name: string;
  avatarUrl?: string;
  description: string;
  followers: number;
  videos: number;
  isLive: boolean;
  liveTitle?: string;
  verified: boolean;
};

const STREAM_KEY = "grid:stream:items";
const CHANNEL_KEY = "grid:stream:channels";

export const SEED_CHANNELS: StreamChannel[] = [
  { handle: "djpoxy", name: "DJ Poxy", description: "House, disco, and late-night grooves.", followers: 12400, videos: 47, isLive: false, verified: true },
  { handle: "paperslions", name: "Paper Lions", description: "Indie four-piece from Bristol.", followers: 8300, videos: 32, isLive: true, liveTitle: "Live from the rehearsal room", verified: true },
  { handle: "nightdrive", name: "Late Night Drive", description: "Synthwave producer. Behind-the-scenes production videos.", followers: 5600, videos: 28, isLive: false, verified: false },
  { handle: "sonyalex", name: "Sonya Alexander", description: "Vocalist and songwriter. Interviews, covers, original sessions.", followers: 15200, videos: 64, isLive: false, verified: true },
];

export const SEED_ITEMS: StreamItem[] = [
  { id: "s1", title: "Late Night Drive — Live at Printworks", description: "Full DJ set from the Printworks main room.", artistHandle: "djpoxy", artistName: "DJ Poxy", kind: "video", category: "dj-set", duration: 3600, viewerCount: 8400, likeCount: 1240, createdAt: Date.now() - 86400000 * 3 },
  { id: "s2", title: "Paper Lions — Studio Session #12", description: "Writing and recording the new single.", artistHandle: "paperslions", artistName: "Paper Lions", kind: "video", category: "studio-session", duration: 2100, viewerCount: 2100, likeCount: 380, createdAt: Date.now() - 86400000 * 7 },
  { id: "s3", title: "LIVE: Paper Lions rehearsal", description: "Live from the rehearsal room.", artistHandle: "paperslions", artistName: "Paper Lions", kind: "live", category: "studio-session", viewerCount: 142, likeCount: 28, createdAt: Date.now() - 3600000 },
  { id: "s4", title: "Sonya Alexander — Interview + live session", description: "30-minute conversation plus three tracks.", artistHandle: "sonyalex", artistName: "Sonya Alexander", kind: "video", category: "interview", duration: 2700, viewerCount: 6200, likeCount: 890, createdAt: Date.now() - 86400000 * 14 },
  { id: "s5", title: "Late Night Drive — Behind the scenes", description: "How 'Analog Dreams' was produced.", artistHandle: "nightdrive", artistName: "Late Night Drive", kind: "video", category: "behind-the-scenes", duration: 1200, viewerCount: 3400, likeCount: 520, createdAt: Date.now() - 86400000 * 21 },
  { id: "s6", title: "Sonya Alexander — Live at Village Underground", description: "Full concert from the sold-out London show.", artistHandle: "sonyalex", artistName: "Sonya Alexander", kind: "video", category: "concert", duration: 4800, viewerCount: 3200, likeCount: 1400, isExclusive: true, ticketPrice: 8, createdAt: Date.now() - 86400000 * 30 },
];

export function listStreamItems(): StreamItem[] {
  if (typeof window === "undefined") return SEED_ITEMS;
  try {
    const raw = localStorage.getItem(STREAM_KEY);
    if (!raw) return SEED_ITEMS;
    return JSON.parse(raw);
  } catch { return SEED_ITEMS; }
}

export function getStreamItem(id: string): StreamItem | null {
  return listStreamItems().find(i => i.id === id) ?? null;
}

export function addStreamItem(item: StreamItem) {
  if (typeof window === "undefined") return;
  const all = listStreamItems();
  all.unshift(item);
  localStorage.setItem(STREAM_KEY, JSON.stringify(all));
}

export function listChannels(): StreamChannel[] {
  if (typeof window === "undefined") return SEED_CHANNELS;
  try {
    const raw = localStorage.getItem(CHANNEL_KEY);
    if (!raw) return SEED_CHANNELS;
    return JSON.parse(raw);
  } catch { return SEED_CHANNELS; }
}

export function getChannel(handle: string): StreamChannel | null {
  return listChannels().find(c => c.handle === handle) ?? null;
}

export function getItemsByChannel(handle: string): StreamItem[] {
  return listStreamItems().filter(i => i.artistHandle === handle);
}

export const CATEGORY_LABELS: Record<StreamCategory, string> = {
  "music-video": "Music video",
  "dj-set": "DJ set",
  "studio-session": "Studio session",
  "interview": "Interview",
  "documentary": "Documentary",
  "concert": "Concert",
  "behind-the-scenes": "Behind the scenes",
};
