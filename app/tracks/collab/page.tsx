"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { listTracks, TrackListing } from "@/lib/tracks";

export default function CollabBoard() {
  const [tracks, setTracks] = useState<TrackListing[]>([]);
  useEffect(() => { setTracks(listTracks().filter(t => t.splitAvailable)); }, []);

  return (
    <div className="tracks-page">
      <div className="tracks-container" style={{ padding: "48px 24px" }}>
        <Link href="/tracks" className="tracks-back">← Back to marketplace</Link>
        <h1 className="tracks-title" style={{ fontSize: 28 }}>Collaboration board</h1>
        <p className="tracks-subtitle" style={{ fontSize: 14, marginBottom: 24 }}>
          Tracks open to split collaborations. Propose a split, send a request, meet in GRID Meet.
        </p>

        {tracks.length === 0 ? (
          <div className="tracks-empty">No open collaborations right now.</div>
        ) : (
          <div className="tracks-grid">
            {tracks.map(t => (
              <Link key={t.id} href={`/tracks/${t.id}`} className="tracks-card">
                <div className="tracks-card-cover" style={{ background: t.coverColor }}>
                  <span className="tracks-card-kind">SPLIT OPEN</span>
                </div>
                <div className="tracks-card-body">
                  <div className="tracks-card-title">{t.title}</div>
                  <div className="tracks-card-artist">{t.producerName}</div>
                  <div className="tracks-card-meta">{t.genres.join(" / ")}</div>
                  <div className="tracks-card-footer">
                    <span className="tracks-card-price">Split available</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
