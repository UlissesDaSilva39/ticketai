"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { listStreamItems, listChannels, CATEGORY_LABELS, StreamItem, StreamChannel, StreamCategory } from "@/lib/stream";

export default function StreamHome() {
  const [items, setItems] = useState<StreamItem[]>([]);
  const [channels, setChannels] = useState<StreamChannel[]>([]);
  const [filter, setFilter] = useState<StreamCategory | "all">("all");

  useEffect(() => { 
    setItems(listStreamItems()); 
    setChannels(listChannels()); 
  }, []);

  const live = items.filter(i => i.kind === "live");
  const filtered = filter === "all"
    ? items.filter(i => i.kind !== "live")
    : items.filter(i => i.category === filter && i.kind !== "live");

  return (
    <div className="page-container">
      <div className="page-header" style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <p style={{ color: "#16A36A", fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "16px" }}>
          GRID STREAM
        </p>
        <h1 className="page-title">Music video. Live shows. Studio sessions.</h1>
        <p className="page-subtitle" style={{ maxWidth: "800px" }}>
          Watch music videos, DJ sets, live performances and behind-the-scenes from artists across the UK.
        </p>
        <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
          <Link href="/stream/upload" className="btn-primary">Upload video</Link>
          <Link href="/stream/live" className="btn-secondary">Go live</Link>
        </div>
      </div>

      {live.length > 0 && (
        <div style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#EF4444", display: "inline-block" }} />
              Live now
            </h2>
            <Link href="/stream/live" style={{ color: "#16A36A", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}>See all →</Link>
          </div>
          <div className="grid-cards">
            {live.map(item => (
              <Link key={item.id} href={`/stream/watch/${item.id}`} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, background: "#EF4444", color: "#fff", padding: "4px 8px", borderRadius: "4px" }}>LIVE</span>
                  <span style={{ fontSize: "12px", color: "#94A3B8" }}>{item.viewerCount} watching</span>
                </div>
                <div className="card-title">{item.title}</div>
                <div className="card-subtitle">{item.artistName}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "24px" }}>Channels</h2>
        <div className="grid-cards">
          {channels.map(c => (
            <Link key={c.handle} href={`/stream/${c.handle}`} className="card">
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#1D2940", color: "#16A36A", display: "grid", placeItems: "center", fontSize: "20px", fontWeight: 700, flexShrink: 0 }}>
                  {c.name[0]}
                </div>
                <div>
                  <div className="card-title">
                    {c.name}
                    {c.verified && <span style={{ color: "#16A36A", marginLeft: "4px", fontSize: "14px" }}>✓</span>}
                  </div>
                  <div className="card-subtitle">{c.followers.toLocaleString()} followers</div>
                </div>
              </div>
              <p style={{ fontSize: "13px", color: "#94A3B8", lineHeight: 1.5, margin: 0 }}>
                {c.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, margin: 0 }}>Browse videos</h2>
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px" }}>
            <button 
              onClick={() => setFilter("all")}
              style={{ padding: "6px 12px", borderRadius: "999px", background: filter === "all" ? "#16A36A" : "transparent", color: filter === "all" ? "#fff" : "#94A3B8", border: "1px solid #293548", cursor: "pointer", fontSize: "12px", whiteSpace: "nowrap" }}
            >
              All
            </button>
            {(Object.keys(CATEGORY_LABELS) as StreamCategory[]).map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                style={{ padding: "6px 12px", borderRadius: "999px", background: filter === cat ? "#16A36A" : "transparent", color: filter === cat ? "#fff" : "#94A3B8", border: "1px solid #293548", cursor: "pointer", fontSize: "12px", whiteSpace: "nowrap" }}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>
        
        {filtered.length === 0 ? (
          <div style={{ padding: "64px", textAlign: "center", color: "#64748B", border: "1px dashed #293548", borderRadius: "12px" }}>
            No videos in this category yet.
          </div>
        ) : (
          <div className="grid-cards">
            {filtered.map(item => (
              <Link key={item.id} href={`/stream/watch/${item.id}`} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, background: "#293548", color: "#F8FAFC", padding: "4px 8px", borderRadius: "4px", textTransform: "uppercase" }}>
                    {CATEGORY_LABELS[item.category]}
                  </span>
                  {item.isExclusive && <span style={{ fontSize: "10px", fontWeight: 700, background: "rgba(168, 85, 247, 0.15)", color: "#a855f7", padding: "4px 8px", borderRadius: "4px" }}>EXCLUSIVE</span>}
                </div>
                <div className="card-title">{item.title}</div>
                <div className="card-subtitle" style={{ marginBottom: "16px" }}>{item.artistName}</div>
                <div style={{ fontSize: "12px", color: "#64748B", marginTop: "auto", paddingTop: "16px", borderTop: "1px solid #293548" }}>
                  {item.viewerCount?.toLocaleString() ?? 0} views · {item.likeCount?.toLocaleString() ?? 0} likes
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
