// ============================================================
// GRID Radio — AzuraCast API client + demo fallback
// ============================================================

export type RadioNowPlaying = {
  isOnline: boolean;
  isLive: boolean;
  streamerName: string;
  songText: string;
  artist: string;
  title: string;
  elapsed: number;
  duration: number;
  listeners: number;
  nextSong: string;
  artworkUrl?: string;
};

export type RadioShow = {
  id: string;
  title: string;
  host: string;
  day: string;
  time: string;
  genre: string;
};

export type RadioStation = {
  name: string;
  shortcode: string;
  description: string;
  streamUrl: string;
  publicUrl: string;
};

// Configuration from environment
const AZURACAST_URL = process.env.NEXT_PUBLIC_AZURACAST_URL || "";
const AZURACAST_STATION = process.env.NEXT_PUBLIC_AZURACAST_STATION || "grid_radio";

export function getStation(): RadioStation {
  return {
    name: "GRID Radio",
    shortcode: AZURACAST_STATION,
    description: "The sound of the underground — 24/7 live from GRID",
    streamUrl: AZURACAST_URL
      ? `${AZURACAST_URL}/listen/${AZURACAST_STATION}/stream`
      : "",
    publicUrl: AZURACAST_URL
      ? `${AZURACAST_URL}/public/${AZURACAST_STATION}`
      : "",
  };
}

// Demo fallback — used when AzuraCast is not configured
const DEMO_NOW_PLAYING: RadioNowPlaying = {
  isOnline: true,
  isLive: true,
  streamerName: "DJ Poxy",
  songText: "DJ Poxy — Late Night Set",
  artist: "DJ Poxy",
  title: "Late Night Set",
  elapsed: 180,
  duration: 3600,
  listeners: 142,
  nextSong: "Sonya Alexander — Analog Dreams",
};

const DEMO_SCHEDULE: RadioShow[] = [
  { id: "s1", title: "House Sessions", host: "DJ Poxy", day: "Mon", time: "20:00", genre: "House" },
  { id: "s2", title: "Live from London", host: "Sonya Alexander", day: "Tue", time: "19:00", genre: "R&B / Neo-Soul" },
  { id: "s3", title: "Synthwave Show", host: "Late Night Drive", day: "Wed", time: "21:00", genre: "Synthwave" },
  { id: "s4", title: "Brazilian Funk Hour", host: "Ulisses", day: "Thu", time: "20:00", genre: "Brazilian Funk" },
  { id: "s5", title: "Weekend Warmup", host: "Paper Lions", day: "Fri", time: "18:00", genre: "Indie / Rock" },
];

export async function fetchNowPlaying(): Promise<RadioNowPlaying> {
  if (!AZURACAST_URL) {
    return DEMO_NOW_PLAYING;
  }

  try {
    const res = await fetch(
      `${AZURACAST_URL}/api/nowplaying/${AZURACAST_STATION}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const songText = data?.now_playing?.song?.text || "Unknown track";
    const parts = songText.split(" - ");
    const artist = parts.length > 1 ? parts[0].trim() : "";
    const title = parts.length > 1 ? parts.slice(1).join(" - ").trim() : songText;

    return {
      isOnline: data?.is_online ?? false,
      isLive: data?.live?.is_live ?? false,
      streamerName: data?.live?.streamer_name || "",
      songText,
      artist,
      title,
      elapsed: data?.now_playing?.elapsed ?? 0,
      duration: data?.now_playing?.duration ?? 0,
      listeners: data?.listeners?.current ?? 0,
      nextSong: data?.playing_next?.song?.text || "",
      artworkUrl: data?.now_playing?.song?.art || undefined,
    };
  } catch (err) {
    console.error("AzuraCast fetch failed:", err);
    return { ...DEMO_NOW_PLAYING, isOnline: false };
  }
}

export async function fetchSchedule(): Promise<RadioShow[]> {
  // For demo, return static schedule. For production, fetch from AzuraCast API:
  // GET /api/station/{shortcode}/schedule
  return DEMO_SCHEDULE;
}

// Check if a stream URL is configured
export function isLiveStreamAvailable(): boolean {
  return AZURACAST_URL.length > 0;
}
