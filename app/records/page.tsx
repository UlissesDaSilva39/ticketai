"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { listArtists, listReleases, SignedArtist, Release, RELEASE_STATUS_LABELS } from "@/lib/records";

export default function RecordsHome() {
  const [artists, setArtists] = useState<SignedArtist[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);

  useEffect(() => {
    setArtists(listArtists());
    setReleases(listReleases());
  }, []);

  const liveReleases = releases.filter(r => r.status === "live");

  return (
    <div className="records-page">
      <header className="records-hero">
        <div className="records-container">
          <p className="records-eyebrow">GRID RECORDS</p>
          <h1 className="records-title">
            The label that runs on GRID.
          </h1>
          <p className="records-subtitle">
            A virtual record label for independent artists. We sign, release, distribute, and pay.
            No physical office. No middlemen. Just the infrastructure you need to build a career.
          </p>
          <div className="records-hero-actions">
            <Link href="/records/apply" className="btn btn-primary">Apply to sign</Link>
            <Link href="/records/roster" className="btn">View roster</Link>
            <Link href="/records/dashboard" className="btn">Label dashboard</Link>
          </div>
        </div>
      </header>

      <section className="records-section">
        <div className="records-container">
          <div className="records-stats">
            <div className="records-stat">
              <div className="records-stat-value">{artists.length}</div>
              <div className="records-stat-label">Signed artists</div>
            </div>
            <div className="records-stat">
              <div className="records-stat-value">{releases.length}</div>
              <div className="records-stat-label">Releases</div>
            </div>
            <div className="records-stat">
              <div className="records-stat-value">
                {Math.round(artists.reduce((s, a) => s + a.totalStreams, 0) / 1000)}k
              </div>
              <div className="records-stat-label">Total streams</div>
            </div>
            <div className="records-stat">
              <div className="records-stat-value">50/50</div>
              <div className="records-stat-label">Standard split</div>
            </div>
          </div>
        </div>
      </section>

      <section className="records-section">
        <div className="records-container">
          <div className="records-section-head">
            <h2 className="records-h2">Recent releases</h2>
            <Link href="/records/releases" className="records-see-all">See all</Link>
          </div>
          <div className="records-release-grid">
            {liveReleases.map(r => (
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
        </div>
      </section>

      <section className="records-section">
        <div className="records-container">
          <div className="records-section-head">
            <h2 className="records-h2">How GRID Records works</h2>
          </div>
          <div className="records-steps">
            <div className="records-step">
              <div className="records-step-num">01</div>
              <h3 className="records-step-title">Apply</h3>
              <p className="records-step-body">Submit a demo. A&R listens within 7 days.</p>
            </div>
            <div className="records-step">
              <div className="records-step-num">02</div>
              <h3 className="records-step-title">Sign</h3>
              <p className="records-step-body">50/50 split, exclusive or non-exclusive, transparent terms.</p>
            </div>
            <div className="records-step">
              <div className="records-step-num">03</div>
              <h3 className="records-step-title">Release</h3>
              <p className="records-step-body">Distribution to 150+ platforms, promotion, playlist pitching.</p>
            </div>
            <div className="records-step">
              <div className="records-step-num">04</div>
              <h3 className="records-step-title">Get paid</h3>
              <p className="records-step-body">Monthly statements, splits tracked, payouts on the 15th.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="records-section">
        <div className="records-container">
          <div className="records-cta">
            <h2 className="records-h2">Ready to sign?</h2>
            <p className="records-subtitle" style={{ margin: "0 auto 24px" }}>
              We sign 5 new artists per quarter. Submit a demo and we'll listen.
            </p>
            <Link href="/records/apply" className="btn btn-primary">Apply to GRID Records</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
