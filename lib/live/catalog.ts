// GRID LIVE: gifts, coin packs, categories and stream-link parsing.
// Shared by the browser (live room) and the server (prices are always
// re-checked on the server from this list, never trusted from the browser).

/** Share of a gift's value the host earns (the rest is GRID's fee). */
export const HOST_SHARE = 0.7;

/** 1 coin = 1p of gift value. */
export const GIFTS = [
  { id: "clap", name: "Applause", coins: 10 },
  { id: "mic", name: "Mic drop", coins: 50 },
  { id: "headphones", name: "Headphones", coins: 100 },
  { id: "vinyl", name: "Gold vinyl", coins: 300 },
  { id: "encore", name: "Encore!", coins: 500 },
  { id: "headliner", name: "Headliner", coins: 1000 },
  { id: "soldout", name: "Sold out", coins: 5000 },
] as const;
export type Gift = (typeof GIFTS)[number];
export const giftById = (id: string) => GIFTS.find((g) => g.id === id);

/** Coin packs bought by card. Bigger packs give bonus coins. */
export const COIN_PACKS = [
  { id: "c150", coins: 150, pence: 199, label: "" },
  { id: "c400", coins: 400, pence: 499, label: "" },
  { id: "c900", coins: 900, pence: 999, label: "Most popular" },
  { id: "c2000", coins: 2000, pence: 1999, label: "+10% bonus" },
  { id: "c5500", coins: 5500, pence: 4999, label: "+20% bonus" },
] as const;
export type CoinPack = (typeof COIN_PACKS)[number];
export const packById = (id: string) => COIN_PACKS.find((p) => p.id === id);

export const LIVE_CATEGORIES = [
  { id: "performance", label: "Live performance" },
  { id: "dj-set", label: "DJ set" },
  { id: "studio", label: "Studio session" },
  { id: "listening-party", label: "Listening party" },
  { id: "q-and-a", label: "Q&A" },
  { id: "other", label: "Other" },
] as const;
export type LiveCategory = (typeof LIVE_CATEGORIES)[number]["id"];
export const isLiveCategory = (v: unknown): v is LiveCategory => LIVE_CATEGORIES.some((c) => c.id === v);
export const liveCategoryLabel = (id: string) => LIVE_CATEGORIES.find((c) => c.id === id)?.label ?? "Live";

export const formatGbp = (pence: number) => `£${(pence / 100).toFixed(2)}`;
export const coinsLabel = (n: number) => `${n.toLocaleString("en-GB")} coin${n === 1 ? "" : "s"}`;

export type StreamSource = { provider: "youtube" | "twitch"; ref: string };

/** Accepts a YouTube Live / video link or a Twitch channel link. */
export function parseStreamLink(input: string): StreamSource | null {
  const u = input.trim();
  let m = u.match(/^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|live\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (m) return { provider: "youtube", ref: m[1] };
  m = u.match(/^https?:\/\/(?:www\.|m\.)?twitch\.tv\/([A-Za-z0-9_]{3,25})\/?(?:[?#].*)?$/);
  if (m && !["videos", "directory", "settings", "downloads", "p"].includes(m[1].toLowerCase())) return { provider: "twitch", ref: m[1].toLowerCase() };
  return null;
}

/** The player URL for the live room. Twitch requires the page's host name. */
export function playerSrc(s: StreamSource, host: string): string {
  if (s.provider === "youtube") return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(s.ref)}?autoplay=1&mute=1&playsinline=1&rel=0`;
  return `https://player.twitch.tv/?channel=${encodeURIComponent(s.ref)}&parent=${encodeURIComponent(host)}&muted=true`;
}

export const watchUrl = (s: StreamSource) =>
  s.provider === "youtube" ? `https://www.youtube.com/watch?v=${s.ref}` : `https://www.twitch.tv/${s.ref}`;

/**
 * A still snapshot of the stream for cards. YouTube refreshes the "_live" frame while
 * a stream is on air; Twitch serves a live preview (changes every few minutes, so the
 * `bucket` cache-buster keeps it fresh). Returns null when there's no source.
 */
export function snapshotUrl(s: StreamSource | null, bucket = 0): string | null {
  if (!s) return null;
  if (s.provider === "youtube") return `https://i.ytimg.com/vi/${encodeURIComponent(s.ref)}/hqdefault_live.jpg`;
  return `https://static-cdn.jtvnw.net/previews-ttv/live_user_${encodeURIComponent(s.ref)}-640x360.jpg${bucket ? `?t=${bucket}` : ""}`;
}

/** Changes every 5 minutes: used as a cache-buster so stream snapshots stay fresh. */
export const snapshotBucket = () => Math.floor(Date.now() / (5 * 60 * 1000));
