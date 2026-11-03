"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { listStreamItems, StreamItem } from "@/lib/stream";

export default function LivePage() {
  const [items, setItems] = useState<StreamItem[]>([]);
  useEffect(() => { setItems(listStreamItems()); }, []);
  const live = items.filter(i => i.kind === "live");

  return (
    <div className="stream-page">
      <div className="stream-container" style={{ padding: "48px 24px" }}>
        <h1 className="stream-h2"><span className="live-dot" /> Live now</h1>
        {live.length === 0 ? <div className="stream-empty">Nothing live right now.</div> : (
          <div className="stream-live-grid">
            {live.map(item => (
              <Link key={item.id} href={`/stream/watch/${item.id}`} className="stream-live-card">
                <div className="stream-live-thumb">
                  <span className="stream-live-badge">LIVE</span>
                  <div className="stream-live-placeholder">{item.artistName}</div>
                </div>
                <div className="stream-live-info">
                  <div className="stream-live-title">{item.title}</div>
                  <div className="stream-live-meta">{item.artistName} · {item.viewerCount ?? 0} watching</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
