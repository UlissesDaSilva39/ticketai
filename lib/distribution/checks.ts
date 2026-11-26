// GRID Distribution: release types and store-readiness checks.
// Shared by the editor (live checklist) and the server (decides draft vs ready).
// These follow common store rules; a delivery partner may add more at launch.

export const RELEASE_TYPES = ["single", "ep", "album"] as const;
export type ReleaseType = (typeof RELEASE_TYPES)[number];
export const isReleaseType = (v: unknown): v is ReleaseType => typeof v === "string" && (RELEASE_TYPES as readonly string[]).includes(v);

export const RELEASE_TYPE_LABEL: Record<ReleaseType, string> = { single: "Single", ep: "EP", album: "Album" };

export const ISRC_RE = /^[A-Z]{2}[A-Z0-9]{3}[0-9]{7}$/;
export const UPC_RE = /^[0-9]{12,13}$/;
export const MIN_ARTWORK_PX = 3000;
export const DISTRIBUTION_BUCKET = "distribution-files";

export type ReleaseTrackInput = {
  title: string;
  version: string | null;
  featuredArtists: string | null;
  composers: string | null;
  producers: string | null;
  isrc: string | null;
  explicit: boolean;
  audioPath: string | null;
  audioName: string | null;
};

export type ReleaseInput = {
  title: string;
  primaryArtist: string;
  releaseType: ReleaseType;
  genre: string | null;
  language: string | null;
  labelName: string | null;
  copyrightLine: string | null;
  releaseDate: string | null; // YYYY-MM-DD
  upc: string | null;
  explicit: boolean;
  artworkPath: string | null;
  artworkWidth: number | null;
  artworkHeight: number | null;
  rightsConfirmed: boolean;
  tracks: ReleaseTrackInput[];
};

export type Check = { id: string; ok: boolean; level: "error" | "warning"; label: string; fix?: string };

const FEAT_IN_TITLE = /\b(feat\.?|ft\.?|featuring)\b/i;
const PROMO_IN_TITLE = /\b(official (music )?video|out now|free download|lyrics?|explicit|clean version)\b/i;
const EMOJI = /\p{Extended_Pictographic}/u;
const allCaps = (s: string) => s.length > 3 && /[A-Z]/.test(s) && s === s.toUpperCase();

const daysUntil = (ymd: string) => {
  const d = new Date(`${ymd}T00:00:00Z`).getTime();
  const today = new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z").getTime();
  return Math.round((d - today) / 86_400_000);
};

/** Store checks for a release. Errors block "ready"; warnings are advice. */
export function checkRelease(r: ReleaseInput): Check[] {
  const c: Check[] = [];
  const add = (id: string, ok: boolean, label: string, fix?: string, level: "error" | "warning" = "error") =>
    c.push({ id, ok, level, label, fix: ok ? undefined : fix });

  const n = r.tracks.length;
  add("title", r.title.trim().length > 0, "Release title", "Add a release title.");
  add("title-format", !r.title || (!FEAT_IN_TITLE.test(r.title) && !PROMO_IN_TITLE.test(r.title) && !EMOJI.test(r.title)),
    "Title has no 'feat.', promo words or emoji", "Put featured artists in each track's 'Featured artists' field, and remove words like 'Official Video' or emoji.");
  add("title-caps", !allCaps(r.title.trim()), "Title isn't in ALL CAPS", "Stores usually reject all-caps titles unless it's the artist's real styling.", "warning");
  add("artist", r.primaryArtist.trim().length > 0, "Primary artist", "Add the main artist name exactly as it appears on streaming services.");
  add("genre", !!r.genre?.trim(), "Genre", "Choose a genre.");
  add("copyright", !!r.copyrightLine?.trim(), "Copyright (℗) line", "Add the year and owner of the recording, e.g. '2026 Your Name'.");

  add("artwork", !!r.artworkPath, "Cover art uploaded", "Upload square cover art (JPG or PNG).");
  if (r.artworkPath) {
    const w = r.artworkWidth ?? 0;
    const h = r.artworkHeight ?? 0;
    add("artwork-square", w > 0 && w === h, "Cover art is square", `Your image is ${w}×${h}. Crop it to a perfect square.`);
    add("artwork-size", Math.min(w, h) >= MIN_ARTWORK_PX, `Cover art is at least ${MIN_ARTWORK_PX}×${MIN_ARTWORK_PX}px`, `Your image is ${w}×${h}. Export it at ${MIN_ARTWORK_PX}×${MIN_ARTWORK_PX}px or larger.`);
  }

  add("tracks", n > 0, "At least one track", "Add your first track.");
  if (n > 0) {
    const fits = r.releaseType === "single" ? n <= 3 : r.releaseType === "ep" ? n >= 2 && n <= 6 : n >= 5;
    add("type-count", fits, `Track count suits a ${RELEASE_TYPE_LABEL[r.releaseType]}`,
      r.releaseType === "single" ? "Singles usually have 1–3 tracks. Switch to EP or Album." : r.releaseType === "ep" ? "EPs usually have 2–6 tracks." : "Albums usually have 5 or more tracks.", "warning");
    const missingAudio = r.tracks.filter((t) => !t.audioPath).length;
    add("audio", missingAudio === 0, "Every track has audio", `${missingAudio} track${missingAudio === 1 ? " is" : "s are"} missing audio.`);
    const lossy = r.tracks.filter((t) => t.audioName && /\.mp3$/i.test(t.audioName)).length;
    add("audio-quality", lossy === 0, "Audio is lossless (WAV or FLAC)", "Stores prefer 16-bit/44.1 kHz WAV or FLAC. Replace MP3 uploads if you can.", "warning");
    const untitled = r.tracks.filter((t) => !t.title.trim()).length;
    add("track-titles", untitled === 0, "Every track has a title", `${untitled} track${untitled === 1 ? " has" : "s have"} no title.`);
    const featTitles = r.tracks.filter((t) => FEAT_IN_TITLE.test(t.title)).length;
    add("track-feat", featTitles === 0, "Track titles have no 'feat.'", "Move featured artists into the 'Featured artists' field.");
    const noComposer = r.tracks.filter((t) => !t.composers?.trim()).length;
    add("composers", noComposer === 0, "Composers listed for every track", "Stores and collecting societies need the songwriters' real names.");
    const badIsrc = r.tracks.filter((t) => t.isrc && !ISRC_RE.test(t.isrc)).length;
    add("isrc", badIsrc === 0, "ISRCs are valid (or left empty)", "An ISRC looks like GBABC2600001. Leave it empty and one will be assigned at delivery.");
    const isrcs = r.tracks.map((t) => t.isrc).filter(Boolean);
    add("isrc-unique", new Set(isrcs).size === isrcs.length, "No duplicate ISRCs", "Each recording needs its own ISRC.");
  }

  add("upc", !r.upc || UPC_RE.test(r.upc), "UPC is valid (or left empty)", "A UPC is 12 or 13 digits. Leave it empty and one will be assigned at delivery.");
  if (!r.releaseDate) add("date", false, "Release date", "Pick a release date.");
  else {
    const d = daysUntil(r.releaseDate);
    add("date-future", d >= 7, "Release date at least 7 days away", "Stores need time to process. Pick a date at least a week away.");
    add("date-pitch", d >= 28, "4+ weeks away (time to pitch to playlists)", "Releasing 4 weeks out gives you time to pitch to editorial playlists.", "warning");
  }
  add("rights", r.rightsConfirmed, "Rights confirmed", "Confirm you own or control the recordings, songs and artwork.");
  return c;
}

export const isReady = (checks: Check[]) => checks.every((x) => x.ok || x.level === "warning");
