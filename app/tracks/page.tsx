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
    <div className="tracks-page">
      <header className="tracks-hero">
        <div className="tracks-container">
          <p className="tracks-eyebrow">GRID TRACKS</p>
          <h1 className="tracks-title">Buy, sell, collaborate.</h1>
          <p className="tracks-subtitle">
            The marketplace for beats, full tracks, loops and stems. Buy from producers.
            Sell your work. Collaborate with splits.
          </p>
          <div className="tracks-hero-actions">
            <Link href="/tracks/new" className="btn btn-primary">List a track</Link>
            <Link href="/tracks/collab" className="btn">Collaboration board</Link>
            <Link href="/tracks/purchases" className="btn">My purchases</Link>
          </div>
        </div>
      </header>

      <section className="tracks-section">
        <div className="tracks-container">
          <div className="tracks-filter-row">
            <input
              className="tracks-search"
              placeholder="Search tracks, producers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="tracks-filters">
              <button className={"tracks-filter" + (filter === "all" ? " active" : "")} onClick={() => setFilter("all")}>All</button>
              {(Object.keys(KIND_LABELS) as TrackKind[]).map(k => (
                <button key={k} className={"tracks-filter" + (filter === k ? " active" : "")} onClick={() => setFilter(k)}>
                  {KIND_LABELS[k]}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="tracks-empty">No tracks found.</div>
          ) : (
            <div className="tracks-grid">
              {filtered.map(t => (
                <Link key={t.id} href={`/tracks/${t.id}`} className="tracks-card">
                  <div className="tracks-card-cover" style={{ background: t.coverColor }}>
                    <span className="tracks-card-kind">{KIND_LABELS[t.kind]}</span>
                    {t.splitAvailable && <span className="tracks-card-split">SPLIT</span>}
                  </div>
                  <div className="tracks-card-body">
                    <div className="tracks-card-title">{t.title}</div>
                    <div className="tracks-card-artist">{t.producerName}</div>
                    <div className="tracks-card-meta">
                      {t.bpm} BPM · {t.key} · {t.genres.slice(0, 2).join(" / ")}
                    </div>
                    <div className="tracks-card-footer">
                      <span className="tracks-card-price">
                        {t.pricing === "split-only" ? "Split only" : `£${t.price}`}
                      </span>
                      <span className="tracks-card-stats">{t.views} views</span>
                    </div>
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
