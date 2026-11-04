"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { listPlaylists, GRIDPlaylist } from "@/lib/playlists";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<GRIDPlaylist[]>([]);
  useEffect(() => { setPlaylists(listPlaylists()); }, []);

  return (
    <div className="meta-page">
      <div className="meta-container" style={{ padding: "48px 24px" }}>
        <h1 className="meta-h1">Playlists</h1>
        <p className="meta-sub">Cross-platform playlists — one list, every streaming service.</p>

        <div className="playlist-grid">
          {playlists.map(p => (
            <Link key={p.id} href={`/playlists/${p.id}`} className="playlist-card">
              <div className="playlist-cover" style={{ background: p.coverColor }}>
                <div className="playlist-cover-title">{p.title}</div>
                <div className="playlist-cover-owner">{p.ownerName}</div>
              </div>
              <div className="playlist-title">{p.title}</div>
              <div className="playlist-meta">{p.tracks.length} tracks · {p.followers.toLocaleString()} followers</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
