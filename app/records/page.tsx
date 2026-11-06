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
    <div className="page-container">
      <div className="page-header" style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <p style={{ color: "#16A36A", fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "16px" }}>
          GRID RECORDS
        </p>
        <h1 className="page-title">The label that runs on GRID.</h1>
        <p className="page-subtitle" style={{ maxWidth: "800px" }}>
          A virtual record label for independent artists. We sign, release, distribute, and pay. 
          No physical office. No middlemen. Just the infrastructure you need to build a career.
        </p>
        <div style={{ display: "flex", gap: "12px", marginTop: "24px", flexWrap: "wrap" }}>
          <Link href="/records/apply" className="btn-primary">Apply to sign</Link>
          <Link href="/records/roster" className="btn-secondary">View roster</Link>
          <Link href="/records/dashboard" className="btn-secondary">Label dashboard</Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1px", background: "#293548", border: "1px solid #293548", borderRadius: "12px", overflow: "hidden", marginBottom: "48px" }}>
        <div style={{ background: "#172033", padding: "32px 24px", textAlign: "center" }}>
          <div style={{ fontSize: "36px", fontWeight: 800, color: "#16A36A", lineHeight: 1 }}>{artists.length}</div>
          <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Signed artists</div>
        </div>
        <div style={{ background: "#172033", padding: "32px 24px", textAlign: "center" }}>
          <div style={{ fontSize: "36px", fontWeight: 800, color: "#16A36A", lineHeight: 1 }}>{releases.length}</div>
          <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Releases</div>
        </div>
        <div style={{ background: "#172033", padding: "32px 24px", textAlign: "center" }}>
          <div style={{ fontSize: "36px", fontWeight: 800, color: "#16A36A", lineHeight: 1 }}>2470k</div>
          <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Total streams</div>
        </div>
        <div style={{ background: "#172033", padding: "32px 24px", textAlign: "center" }}>
          <div style={{ fontSize: "36px", fontWeight: 800, color: "#16A36A", lineHeight: 1 }}>50/50</div>
          <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Standard split</div>
        </div>
      </div>

      {/* Recent Releases */}
      <div style={{ marginBottom: "48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, margin: 0 }}>Recent releases</h2>
          <Link href="/records/releases" style={{ color: "#16A36A", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}>See all</Link>
        </div>
        
        <div className="grid-cards">
          {liveReleases.map(r => (
            <Link key={r.id} href={`/records/artist/${r.artistHandle}`} className="card">
              <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "16px" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "8px", background: r.coverColor, flexShrink: 0 }} />
                <div>
                  <div className="card-title">{r.title}</div>
                  <div className="card-subtitle">{r.artistName} · {r.genre}</div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "16px", borderTop: "1px solid #293548" }}>
                <span style={{ fontSize: "12px", color: "#64748B" }}>{r.tracks} tracks</span>
                <span style={{ fontSize: "12px", color: "#16A36A", fontWeight: 600 }}>View</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "24px" }}>How GRID Records works</h2>
        <div className="grid-cards">
          <div className="card">
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#16A36A", marginBottom: "12px" }}>01</div>
            <h3 className="card-title">Apply</h3>
            <p className="card-subtitle">Submit a demo. A&R listens within 7 days.</p>
          </div>
          <div className="card">
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#16A36A", marginBottom: "12px" }}>02</div>
            <h3 className="card-title">Sign</h3>
            <p className="card-subtitle">50/50 split, exclusive or non-exclusive, transparent terms.</p>
          </div>
          <div className="card">
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#16A36A", marginBottom: "12px" }}>03</div>
            <h3 className="card-title">Release</h3>
            <p className="card-subtitle">Distribution to 150+ platforms, promotion, playlist pitching.</p>
          </div>
          <div className="card">
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#16A36A", marginBottom: "12px" }}>04</div>
            <h3 className="card-title">Get paid</h3>
            <p className="card-subtitle">Monthly statements, splits tracked, payouts on the 15th.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center", padding: "64px 32px", background: "radial-gradient(ellipse at center, rgba(22, 163, 106, 0.08), transparent 70%)", border: "1px solid #293548", borderRadius: "16px" }}>
        <h2 style={{ fontSize: "36px", fontWeight: 800, marginBottom: "16px" }}>Ready to sign?</h2>
        <p style={{ color: "#94A3B8", fontSize: "16px", marginBottom: "32px" }}>
          We sign 5 new artists per quarter. Submit a demo and we'll listen.
        </p>
        <Link href="/records/apply" className="btn-primary" style={{ padding: "12px 32px", fontSize: "16px" }}>Apply to GRID Records</Link>
      </div>
    </div>
  );
}
