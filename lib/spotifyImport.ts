// ============================================================
// GRID Spotify Import — parse Spotify's exported JSON
// ============================================================
import { saveAnalytics, ArtistAnalytics } from "./analytics";
import { saveSmartLink, SmartLink } from "./smartLinks";

export type SpotifyImportResult = {
  tracksImported: number;
  playlistsImported: number;
  topArtist: string;
  errors: string[];
};

export function parseSpotifyJSON(json: any, artistHandle: string, artistName: string): SpotifyImportResult {
  const result: SpotifyImportResult = {
    tracksImported: 0,
    playlistsImported: 0,
    topArtist: "",
    errors: [],
  };

  try {
    // Spotify "StreamingHistory" is an array of { endTime, artistName, trackName, msPlayed }
    const history = json.StreamingHistory || json["StreamingHistory_music"] || [];
    if (Array.isArray(history)) {
      result.tracksImported = history.length;
      // Count most played artist
      const artistCounts: Record<string, number> = {};
      for (const h of history) {
        const name = h.artistName;
        if (name) artistCounts[name] = (artistCounts[name] || 0) + 1;
      }
      const top = Object.entries(artistCounts).sort((a, b) => b[1] - a[1])[0];
      result.topArtist = top ? top[0] : "";
    }

    // Spotify "Playlist1.json" etc
    const playlistData = json.playlists;
    if (Array.isArray(playlistData)) {
      result.playlistsImported = playlistData.length;
    }

    // Also accept "StreamingHistory0" through "StreamingHistoryN"
    for (const key of Object.keys(json)) {
      if (/^StreamingHistory\d+$/.test(key) && Array.isArray(json[key])) {
        result.tracksImported += json[key].length;
      }
    }

    // Save placeholder analytics (real data comes from Spotify API, not export)
    const existing = {
      artistHandle,
      artistName,
      totalStreams: result.tracksImported * 1000,
      monthlyListeners: Math.floor(result.tracksImported / 3),
      countries: 20,
      growth: 5,
      perPlatform: [{ platform: "spotify" as const, streams: result.tracksImported * 1000, monthlyListeners: Math.floor(result.tracksImported / 3), countries: 20 }],
      topCountries: [
        { code: "GB", name: "United Kingdom", flag: "🇬🇧", pct: 40 },
        { code: "US", name: "United States", flag: "🇺🇸", pct: 30 },
        { code: "BR", name: "Brazil", flag: "🇧🇷", pct: 20 },
      ],
      topPlaylists: [],
      connected: [{ platform: "spotify" as const, connected: true }],
      lastUpdated: Date.now(),
    };
    saveAnalytics(existing as ArtistAnalytics);
  } catch (e: any) {
    result.errors.push(e?.message || "Parse error");
  }

  return result;
}
