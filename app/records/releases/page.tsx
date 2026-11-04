"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { listReleases, Release, RELEASE_STATUS_LABELS } from "@/lib/records";

export default function ReleasesPage() {
  const [releases, setReleases] = useState<Release[]>([]);
  useEffect(() => { setReleases(listReleases()); }, []);

  const live = releases.filter(r => r.status === "live");
  const upcoming = releases.filter(r => r.status === "approved" || r.status === "pending-approval");

  return (
    <div className="records-page">
      <div className="records-container" style={{ padding: "48px 24px" }}>
        <Link href="/records" className="records-back">← Back to GRID Records</Link>
        <h1 className="records-h2">Discography</h1>
        <p className="records-subtitle" style={{ fontSize: 14, marginBottom: 32 }}>
          {live.length} releases live. {upcoming.length} upcoming.
        </p>

        <h2 className="records-h3">Live</h2>
        <div className="records-release-grid">
          {live.map(r => (
            <Link key={r.id} href={`/records/artist/${r.artistHandle}`} className="records-release-card">
              <div className="records-release-cover" style={{ background: r.coverColor }}>
                <div className="records-release-cover-inner">
                  <div className="records-release-cover-title">{r.title}</div>
                  <div className="records-release-cover-artist">{r.artistName}</div>
                </div>
              </div>
              <div className="records-release-title">{r.title}</div>
              <div className="records-release-meta">{r.artistName} · {r.genre}</div>
            </Link>
          ))}
        </div>

        {upcoming.length > 0 && (
          <>
            <h2 className="records-h3" style={{ marginTop: 48 }}>Upcoming</h2>
            <div className="records-release-grid">
              {upcoming.map(r => (
                <div key={r.id} className="records-release-card">
                  <div className="records-release-cover" style={{ background: r.coverColor, opacity: 0.6 }}>
                    <div className="records-release-cover-inner">
                      <div className="records-release-cover-title">{r.title}</div>
                    </div>
                  </div>
                  <div className="records-release-title">{r.title}</div>
                  <div className="records-release-meta">{r.artistName} · {RELEASE_STATUS_LABELS[r.status]}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
