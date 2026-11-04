// ============================================================
// GRID Radar — personalized discovery
// ============================================================
import { listStreamItems } from "./stream";
import { listTracks } from "./tracks";
import { listReleases } from "./records";
import { listPlaylists } from "./playlists";

export type RadarSection = "live" | "new" | "rising" | "playlists" | "near-you";

export type RadarItem = {
  id: string;
  kind: RadarSection;
  title: string;
  subtitle: string;
  href: string;
  color: string;
  meta?: string;
};

export function buildRadarFeed(): { section: RadarSection; label: string; items: RadarItem[] }[] {
  const streams = listStreamItems();
  const tracks = listTracks();
  const releases = listReleases();
  const playlists = listPlaylists();

  const live = streams.filter(s => s.kind === "live").slice(0, 3).map(s => ({
    id: s.id, kind: "live" as RadarSection,
    title: s.title, subtitle: s.artistName + " · LIVE NOW",
    href: `/stream/watch/${s.id}`,
    color: "#ef4444",
    meta: `${s.viewerCount ?? 0} watching`,
  }));

  const newReleases = releases.filter(r => r.status === "live").slice(0, 4).map(r => ({
    id: r.id, kind: "new" as RadarSection,
    title: r.title, subtitle: r.artistName + " · " + r.genre,
    href: `/records/artist/${r.artistHandle}`,
    color: r.coverColor,
    meta: new Date(r.releaseDate).toLocaleDateString(),
  }));

  const rising = tracks.filter(t => t.views > 500).slice(0, 3).map(t => ({
    id: t.id, kind: "rising" as RadarSection,
    title: t.title, subtitle: t.producerName,
    href: `/tracks/${t.id}`,
    color: t.coverColor,
    meta: `${t.views.toLocaleString()} views`,
  }));

  const pls = playlists.slice(0, 3).map(p => ({
    id: p.id, kind: "playlists" as RadarSection,
    title: p.title, subtitle: "By " + p.ownerName,
    href: `/playlists/${p.id}`,
    color: p.coverColor,
    meta: `${p.tracks.length} tracks · ${p.followers} followers`,
  }));

  return [
    { section: "live", label: "Live now", items: live },
    { section: "new", label: "New for you", items: newReleases },
    { section: "rising", label: "Rising artists", items: rising },
    { section: "playlists", label: "Playlists for you", items: pls },
  ];
}
