import { ISRC_RE, UPC_RE, isReleaseType, type ReleaseInput, type ReleaseTrackInput } from "./checks";

// Server-only helpers for the release builder.

export const EDITABLE_STATUSES = ["draft", "ready"];

export type ReleaseRow = {
  id: string;
  owner_id: string;
  title: string;
  primary_artist: string;
  release_type: string;
  genre: string | null;
  language: string | null;
  label_name: string | null;
  copyright_line: string | null;
  release_date: string | null;
  upc: string | null;
  explicit: boolean;
  artwork_path: string | null;
  artwork_width: number | null;
  artwork_height: number | null;
  status: string;
  notify_on_launch: boolean;
  rights_confirmed_at: string | null;
  updated_at: string;
};

export type TrackRow = {
  position: number;
  title: string;
  version: string | null;
  featured_artists: string | null;
  composers: string | null;
  producers: string | null;
  isrc: string | null;
  explicit: boolean;
  audio_path: string | null;
  audio_name: string | null;
};

export const RELEASE_COLUMNS =
  "id, owner_id, title, primary_artist, release_type, genre, language, label_name, copyright_line, release_date, upc, explicit, artwork_path, artwork_width, artwork_height, status, notify_on_launch, rights_confirmed_at, updated_at";
export const TRACK_COLUMNS = "position, title, version, featured_artists, composers, producers, isrc, explicit, audio_path, audio_name";

export function toInput(r: ReleaseRow, tracks: TrackRow[]): ReleaseInput {
  return {
    title: r.title,
    primaryArtist: r.primary_artist,
    releaseType: isReleaseType(r.release_type) ? r.release_type : "single",
    genre: r.genre,
    language: r.language,
    labelName: r.label_name,
    copyrightLine: r.copyright_line,
    releaseDate: r.release_date,
    upc: r.upc,
    explicit: r.explicit,
    artworkPath: r.artwork_path,
    artworkWidth: r.artwork_width,
    artworkHeight: r.artwork_height,
    rightsConfirmed: !!r.rights_confirmed_at,
    tracks: [...tracks]
      .sort((a, b) => a.position - b.position)
      .map((t) => ({
        title: t.title,
        version: t.version,
        featuredArtists: t.featured_artists,
        composers: t.composers,
        producers: t.producers,
        isrc: t.isrc,
        explicit: t.explicit,
        audioPath: t.audio_path,
        audioName: t.audio_name,
      })),
  };
}

const str = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
const opt = (v: unknown, max: number) => str(v, max) || null;
const ownPath = (v: unknown, userId: string) => (typeof v === "string" && v.startsWith(`${userId}/`) && !v.includes("..") ? v.slice(0, 500) : null);
const posInt = (v: unknown) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) && n > 0 && n < 100_000 ? n : null;
};

/**
 * Cleans an editor payload. Invalid codes are dropped to null only when they are
 * completely malformed in a way the database would reject; the checks still flag them.
 */
export function sanitizeInput(b: Record<string, unknown>, userId: string): { input: ReleaseInput; invalidCodes: boolean } {
  const rawTracks = Array.isArray(b.tracks) ? b.tracks.slice(0, 100) : [];
  let invalidCodes = false;
  const code = (v: unknown, re: RegExp, max: number) => {
    const c = str(v, max).toUpperCase().replace(/[-\s]/g, "");
    if (!c) return null;
    if (!re.test(c)) {
      invalidCodes = true;
      return null;
    }
    return c;
  };
  const tracks: ReleaseTrackInput[] = rawTracks.map((t) => {
    const o = (t ?? {}) as Record<string, unknown>;
    return {
      title: str(o.title, 200),
      version: opt(o.version, 100),
      featuredArtists: opt(o.featuredArtists, 300),
      composers: opt(o.composers, 300),
      producers: opt(o.producers, 300),
      isrc: code(o.isrc, ISRC_RE, 15),
      explicit: o.explicit === true,
      audioPath: ownPath(o.audioPath, userId),
      audioName: opt(o.audioName, 200),
    };
  });
  const date = str(b.releaseDate, 10);
  return {
    invalidCodes,
    input: {
      title: str(b.title, 200),
      primaryArtist: str(b.primaryArtist, 200),
      releaseType: isReleaseType(b.releaseType) ? b.releaseType : "single",
      genre: opt(b.genre, 60),
      language: opt(b.language, 40),
      labelName: opt(b.labelName, 200),
      copyrightLine: opt(b.copyrightLine, 200),
      releaseDate: /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null,
      upc: code(b.upc, UPC_RE, 13),
      explicit: b.explicit === true,
      artworkPath: ownPath(b.artworkPath, userId),
      artworkWidth: posInt(b.artworkWidth),
      artworkHeight: posInt(b.artworkHeight),
      rightsConfirmed: b.rightsConfirmed === true,
      tracks,
    },
  };
}
