"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { listSmartLinks, SmartLink } from "@/lib/smartLinks";
import { listAnalytics } from "@/lib/analytics";
import { listPlaylists } from "@/lib/playlists";
import { listStreamItems } from "@/lib/stream";
import { listTracks } from "@/lib/tracks";
import { listReleases } from "@/lib/records";

export default function DiscoverPage() {
  const [links, setLinks] = useState<SmartLink[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [streams, setStreams] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const [releases, setReleases] = useState<any[]>([]);

  useEffect(() => {
    setLinks(listSmartLinks());
    setAnalytics(listAnalytics());
    setPlaylists(listPlaylists());
    setStreams(listStreamItems());
    setTracks(listTracks());
    setReleases(listReleases());
  }, []);

  return (
    <div className="page-container">
      <div className="page-header" style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <h1 className="page-title">Discover</h1>
        <p className="page-subtitle">One place to see everything. Trending across every platform, every section of GRID.</p>
        
        <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
          <Link href="/radar" className="btn-primary">Open GRID Radar</Link>
          <Link href="/playlists" className="btn-secondary">Browse playlists</Link>
          <Link href="/import/spotify" className="btn-secondary">Import from Spotify</Link>
        </div>
      </div>

      {/* Top smart links */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>Top smart links</h2>
        <p style={{ fontSize: "14px", color: "#94A3B8", marginBottom: "24px" }}>Tracks with the most clicks — across all streaming platforms.</p>
        
        <div className="grid-cards">
          {links.slice(0, 4).map(link => {
            const totalClicks = Object.values(link.clicks).reduce((a, b) => a + b, 0);
            return (
              <Link key={link.id} href={`/smart/${link.id}`} className="card">
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: link.coverColor, flexShrink: 0 }} />
                  <div>
                    <div className="card-title">{link.title}</div>
                    <div className="card-subtitle">{link.artistName}</div>
                  </div>
                </div>
                <div style={{ fontSize: "13px", color: "#F8FAFC" }}>
                  {totalClicks.toLocaleString()} clicks · {Object.keys(link.platforms).length} platforms
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Rising artists */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>Rising artists</h2>
        <p style={{ fontSize: "14px", color: "#94A3B8", marginBottom: "24px" }}>Fastest growing in the last 30 days.</p>
        
        <div className="grid-cards">
          {analytics.map(a => (
            <Link key={a.artistHandle} href={`/analytics/${a.artistHandle}`} className="card">
              <div className="card-title">{a.artistName}</div>
              <div className="card-subtitle">
                {a.totalStreams.toLocaleString()} streams · <span style={{ color: "#16A36A", fontWeight: 600 }}>+{a.growth}%</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Live on GRID */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "24px" }}>Live on GRID</h2>
        <div className="grid-cards">
          {streams.filter(s => s.kind === "live").map(s => (
            <Link key={s.id} href={`/stream/watch/${s.id}`} className="card">
              <div className="card-title">{s.title}</div>
              <div className="card-subtitle" style={{ color: "#EF4444" }}>🔴 {s.viewerCount} watching</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Latest releases */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "24px" }}>Latest releases</h2>
        <div className="grid-cards">
          {releases.filter(r => r.status === "live").map(r => (
            <Link key={r.id} href={`/records/artist/${r.artistHandle}`} className="card">
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: r.coverColor, flexShrink: 0 }} />
                <div>
                  <div className="card-title">{r.title}</div>
                  <div className="card-subtitle">{r.artistName}</div>
                </div>
              </div>
              <div style={{ fontSize: "12px", color: "#64748B" }}>{r.genre}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Playlists */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "24px" }}>Playlists</h2>
        <div className="grid-cards">
          {playlists.map(p => (
            <Link key={p.id} href={`/playlists/${p.id}`} className="card">
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: p.coverColor, flexShrink: 0 }} />
                <div>
                  <div className="card-title">{p.title}</div>
                  <div className="card-subtitle">By {p.ownerName}</div>
                </div>
              </div>
              <div style={{ fontSize: "12px", color: "#64748B" }}>{p.tracks.length} tracks · {p.followers} followers</div>
            </Link>
          ))}
        </div>
      </div>

      {/* On GRID Tracks */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "24px" }}>On GRID Tracks</h2>
        <div className="grid-cards">
          {tracks.slice(0, 4).map(t => (
            <Link key={t.id} href={`/tracks/${t.id}`} className="card">
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: t.coverColor, flexShrink: 0 }} />
                <div>
                  <div className="card-title">{t.title}</div>
                  <div className="card-subtitle">{t.producerName}</div>
                </div>
              </div>
              <div style={{ fontSize: "12px", color: "#64748B" }}>£{t.price} · {t.views} views</div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
