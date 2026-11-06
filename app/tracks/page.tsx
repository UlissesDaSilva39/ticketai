"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { listTracks, TrackListing, KIND_LABELS, TrackKind } from "@/lib/tracks";

export default function TracksHome() {
  const [tracks, setTracks] = useState<TrackListing[]>([]);
  const [filter, setFilter] = useState<TrackKind | "all">("all");
  const [search, setSearch] = useState("");

  useEffect(() => { setTracks(listTracks()); }, []);

  const filtered = tracks.filter(t => {
    if (filter !== "all" && t.kind !== filter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) &&
        !t.producerName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <p style={{ color: "#16A36A", fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "8px" }}>
            GRID TRACKS
          </p>
          <h1 className="page-title">Buy, sell, collaborate.</h1>
          <p className="page-subtitle">
            The marketplace for beats, full tracks, loops and stems. Buy from producers. Sell your work. Collaborate with splits.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link href="/tracks/new" className="btn-primary">List a track</Link>
          <Link href="/tracks/collab" className="btn-secondary">Collaboration board</Link>
          <Link href="/tracks/purchases" className="btn-secondary">My purchases</Link>
        </div>
      </div>

      {/* Filter Row */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search tracks, producers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: "12px 16px", background: "#172033", border: "1px solid #293548", borderRadius: "8px", color: "#F8FAFC", outline: "none", minWidth: "250px" }}
        />
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button 
            onClick={() => setFilter("all")}
            style={{ padding: "8px 16px", borderRadius: "999px", background: filter === "all" ? "#16A36A" : "#172033", color: filter === "all" ? "#fff" : "#94A3B8", border: "1px solid #293548", cursor: "pointer", fontSize: "13px" }}
          >
            All
          </button>
          {(Object.keys(KIND_LABELS) as TrackKind[]).map(k => (
            <button 
              key={k}
              onClick={() => setFilter(k)}
              style={{ padding: "8px 16px", borderRadius: "999px", background: filter === k ? "#16A36A" : "#172033", color: filter === k ? "#fff" : "#94A3B8", border: "1px solid #293548", cursor: "pointer", fontSize: "13px" }}
            >
              {KIND_LABELS[k]}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      {filtered.length === 0 ? (
        <div style={{ padding: "64px", textAlign: "center", color: "#64748B", border: "1px dashed #293548", borderRadius: "12px" }}>
          No tracks found.
        </div>
      ) : (
        <div className="grid-cards">
          {filtered.map(t => (
            <Link key={t.id} href={`/tracks/${t.id}`} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <div style={{ 
                    width: "48px", 
                    height: "48px", 
                    borderRadius: "8px", 
                    background: t.coverColor,
                    flexShrink: 0 
                  }} />
                  <div>
                    <div className="card-title">{t.title}</div>
                    <div className="card-subtitle">{t.producerName}</div>
                  </div>
                </div>
                {t.splitAvailable && (
                  <span style={{ fontSize: "10px", fontWeight: 700, background: "rgba(168, 85, 247, 0.15)", color: "#a855f7", padding: "4px 8px", borderRadius: "4px" }}>
                    SPLIT
                  </span>
                )}
              </div>
              
              <div style={{ fontSize: "12px", color: "#94A3B8", marginBottom: "16px" }}>
                {t.bpm} BPM · {t.key} · {t.genres.slice(0, 2).join(" / ")}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "16px", borderTop: "1px solid #293548" }}>
                <span style={{ fontSize: "16px", fontWeight: 700, color: "#16A36A" }}>
                  {t.pricing === "split-only" ? "Split only" : `£${t.price}`}
                </span>
                <span style={{ fontSize: "12px", color: "#64748B" }}>
                  {t.views.toLocaleString()} views
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
