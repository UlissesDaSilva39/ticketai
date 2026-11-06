"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { listPlaylists, GRIDPlaylist } from "@/lib/playlists";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<GRIDPlaylist[]>([]);
  
  useEffect(() => { 
    setPlaylists(listPlaylists()); 
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Playlists</h1>
          <p className="page-subtitle">Cross-platform playlists — one list, every streaming service.</p>
        </div>
      </div>

      <div className="grid-cards">
        {playlists.map(p => (
          <Link key={p.id} href={`/playlists/${p.id}`} className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
              {/* Small colored square instead of giant background */}
              <div style={{ 
                width: "48px", 
                height: "48px", 
                borderRadius: "8px", 
                background: p.coverColor,
                flexShrink: 0 
              }} />
              <div>
                <div className="card-title">{p.title}</div>
                <div className="card-subtitle">By {p.ownerName}</div>
              </div>
            </div>
            
            <div style={{ 
              fontSize: "13px", 
              color: "#64748B", 
              marginTop: "auto",
              paddingTop: "12px",
              borderTop: "1px solid #293548"
            }}>
              {p.tracks.length} tracks · {p.followers.toLocaleString()} followers
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
