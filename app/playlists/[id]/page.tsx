"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPlaylist, GRIDPlaylist } from "@/lib/playlists";
import { PLATFORMS, PLATFORM_ORDER } from "@/lib/platforms";

export default function PlaylistDetail() {
  const params = useParams();
  const id = params?.id as string;
  const [playlist, setPlaylist] = useState<GRIDPlaylist | null>(null);

  useEffect(() => {
    if (id) setPlaylist(getPlaylist(id));
  }, [id]);

  if (!playlist) return <div className="meta-page meta-container" style={{ padding: 48 }}>Playlist not found.</div>;

  return (
    <div className="meta-page">
      <div className="meta-container" style={{ padding: "48px 24px" }}>
        <Link href="/playlists" className="meta-back">← All playlists</Link>

        <div className="playlist-detail-header">
          <div className="playlist-detail-cover" style={{ background: playlist.coverColor }}>
            <div className="playlist-cover-title">{playlist.title}</div>
          </div>
          <div className="playlist-detail-info">
            <h1 className="meta-h1">{playlist.title}</h1>
            <p className="meta-sub">{playlist.description}</p>
            <div className="playlist-detail-meta">
              By {playlist.ownerName} · {playlist.tracks.length} tracks · {playlist.followers.toLocaleString()} followers
            </div>
          </div>
        </div>

        <div className="playlist-tracks">
          {playlist.tracks.map((track, i) => (
            <div key={track.id + i} className="playlist-track-row">
              <div className="playlist-track-num">{i + 1}</div>
              <div className="playlist-track-info">
                <div className="playlist-track-title">{track.title}</div>
                <div className="playlist-track-artist">{track.artistName}</div>
              </div>
              <div className="playlist-track-platforms">
                {PLATFORM_ORDER.filter(p => track.links[p]).map(p => (
                  <a
                    key={p}
                    href={track.links[p]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="playlist-track-platform"
                    style={{ borderColor: PLATFORMS[p].color }}
                    title={PLATFORMS[p].name}
                  >
                    {PLATFORMS[p].name[0]}
                  </a>
                ))}
                {track.grdcTrackId && (
                  <Link href={`/tracks/${track.grdcTrackId}`} className="playlist-track-platform" style={{ borderColor: "#4f8cff" }} title="Buy on GRID">
                    £
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
