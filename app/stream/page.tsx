"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  listStreamItems, listChannels, CATEGORY_LABELS,
  StreamItem, StreamChannel, StreamCategory,
} from "@/lib/stream";

export default function StreamHome() {
  const [items, setItems] = useState<StreamItem[]>([]);
  const [channels, setChannels] = useState<StreamChannel[]>([]);
  const [filter, setFilter] = useState<StreamCategory | "all">("all");

  useEffect(() => {
    setItems(listStreamItems());
    setChannels(listChannels());
  }, []);

  const live = items.filter(i => i.kind === "live");
  const filtered = filter === "all" ? items.filter(i => i.kind !== "live") : items.filter(i => i.category === filter && i.kind !== "live");

  return (
    <div className="stream-page">
      <header className="stream-hero">
        <div className="stream-container">
          <p className="stream-eyebrow">GRID STREAM</p>
          <h1 className="stream-title">Music video. Live shows. Studio sessions.</h1>
          <p className="stream-subtitle">
            Watch music videos, DJ sets, live performances and behind-the-scenes from artists across the UK.
          </p>
          <div className="stream-hero-actions">
            <Link href="/stream/upload" className="btn btn-primary">Upload video</Link>
            <Link href="/stream/live" className="btn">Go live</Link>
          </div>
        </div>
      </header>

      {live.length > 0 && (
        <section className="stream-section">
          <div className="stream-container">
            <div className="stream-section-head">
              <h2 className="stream-h2">
                <span className="live-dot" /> Live now
              </h2>
              <Link href="/stream/live" className="stream-see-all">See all →</Link>
            </div>
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
          </div>
        </section>
      )}

      <section className="stream-section">
        <div className="stream-container">
          <div className="stream-section-head">
            <h2 className="stream-h2">Channels</h2>
          </div>
          <div className="stream-channel-grid">
            {channels.map(c => (
              <Link key={c.handle} href={`/stream/${c.handle}`} className="stream-channel-card">
                <div className="stream-channel-avatar">{c.name[0]}</div>
                <div className="stream-channel-info">
                  <div className="stream-channel-name">
                    {c.name}
                    {c.verified && <span className="stream-verified">✓</span>}
                    {c.isLive && <span className="stream-live-badge-small">LIVE</span>}
                  </div>
                  <div className="stream-channel-meta">
                    {c.followers.toLocaleString()} followers · {c.videos} videos
                  </div>
                  <div className="stream-channel-desc">{c.description}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="stream-section">
        <div className="stream-container">
          <div className="stream-section-head">
            <h2 className="stream-h2">Browse videos</h2>
            <div className="stream-filters">
              <button
                className={"stream-filter" + (filter === "all" ? " active" : "")}
                onClick={() => setFilter("all")}
              >All</button>
              {(Object.keys(CATEGORY_LABELS) as StreamCategory[]).map(cat => (
                <button
                  key={cat}
                  className={"stream-filter" + (filter === cat ? " active" : "")}
                  onClick={() => setFilter(cat)}
                >{CATEGORY_LABELS[cat]}</button>
              ))}
            </div>
          </div>
          {filtered.length === 0 ? (
            <div className="stream-empty">No videos in this category yet.</div>
          ) : (
            <div className="stream-video-grid">
              {filtered.map(item => (
                <Link key={item.id} href={`/stream/watch/${item.id}`} className="stream-video-card">
                  <div className="stream-video-thumb">
                    {item.isExclusive && <span className="stream-exclusive">EXCLUSIVE</span>}
                    <div className="stream-video-placeholder">{item.artistName}</div>
                  </div>
                  <div className="stream-video-title">{item.title}</div>
                  <div className="stream-video-meta">
                    {item.artistName} · {CATEGORY_LABELS[item.category]}
                  </div>
                  <div className="stream-video-stats">
                    {item.viewerCount?.toLocaleString() ?? 0} views · {item.likeCount?.toLocaleString() ?? 0} likes
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

