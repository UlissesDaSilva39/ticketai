"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { listArtists, SignedArtist, CONTRACT_LABELS } from "@/lib/records";

export default function RosterPage() {
  const [artists, setArtists] = useState<SignedArtist[]>([]);
  useEffect(() => { setArtists(listArtists()); }, []);

  return (
    <div className="records-page">
      <div className="records-container" style={{ padding: "48px 24px" }}>
        <Link href="/records" className="records-back">← Back to GRID Records</Link>
        <h1 className="records-h2">Our roster</h1>
        <p className="records-subtitle" style={{ fontSize: 14, marginBottom: 32 }}>
          {artists.length} artists signed. 50/50 standard split.
        </p>

        <div className="records-roster-grid">
          {artists.map(a => (
            <Link key={a.id} href={`/records/artist/${a.handle}`} className="records-roster-card">
              <div className="records-roster-avatar" style={{ background: a.color }}>
                {a.name[0]}
              </div>
              <div className="records-roster-info">
                <div className="records-roster-name">{a.name}</div>
                <div className="records-roster-genres">{a.genres.join(" · ")}</div>
                <div className="records-roster-meta">
                  {a.totalReleases} releases · {(a.totalStreams / 1000).toFixed(0)}k streams
                </div>
                <div className="records-roster-contract">
                  {CONTRACT_LABELS[a.contractType]} · {a.artistSplit}% artist
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
