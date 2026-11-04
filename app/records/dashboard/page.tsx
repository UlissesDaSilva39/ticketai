"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  listApplications, listArtists, listReleases, listRoyalties,
  Application, SignedArtist, Release, RoyaltyStatement,
  STATUS_LABELS, RELEASE_STATUS_LABELS,
} from "@/lib/records";

export default function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [artists, setArtists] = useState<SignedArtist[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [royalties, setRoyalties] = useState<RoyaltyStatement[]>([]);
  const [tab, setTab] = useState<"applications" | "releases" | "royalties">("applications");

  useEffect(() => {
    setApplications(listApplications());
    setArtists(listArtists());
    setReleases(listReleases());
    setRoyalties(listRoyalties());
  }, []);

  const pendingApps = applications.filter(a => a.status !== "signed" && a.status !== "declined");
  const pendingReleases = releases.filter(r => r.status === "pending-approval");
  const pendingRoyalties = royalties.filter(r => r.status === "pending");

  const totalGross = royalties.reduce((s, r) => s + r.grossRevenue, 0);
  const totalLabel = royalties.reduce((s, r) => s + r.labelShare, 0);

  return (
    <div className="records-page">
      <div className="records-container" style={{ padding: "48px 24px" }}>
        <Link href="/records" className="records-back">← Back to GRID Records</Link>
        <h1 className="records-h2">Label dashboard</h1>
        <p className="records-subtitle" style={{ fontSize: 14, marginBottom: 32 }}>
          A&R view. Review applications, approve releases, track royalties.
        </p>

        <div className="records-dashboard-stats">
          <div className="records-stat">
            <div className="records-stat-value">{pendingApps.length}</div>
            <div className="records-stat-label">Pending applications</div>
          </div>
          <div className="records-stat">
            <div className="records-stat-value">{pendingReleases.length}</div>
            <div className="records-stat-label">Pending releases</div>
          </div>
          <div className="records-stat">
            <div className="records-stat-value">£{totalGross.toFixed(0)}</div>
            <div className="records-stat-label">Gross revenue</div>
          </div>
          <div className="records-stat">
            <div className="records-stat-value">£{totalLabel.toFixed(0)}</div>
            <div className="records-stat-label">Label share</div>
          </div>
        </div>

        <div className="records-tabs">
          <button className={"records-tab" + (tab === "applications" ? " active" : "")} onClick={() => setTab("applications")}>
            Applications ({applications.length})
          </button>
          <button className={"records-tab" + (tab === "releases" ? " active" : "")} onClick={() => setTab("releases")}>
            Releases ({releases.length})
          </button>
          <button className={"records-tab" + (tab === "royalties" ? " active" : "")} onClick={() => setTab("royalties")}>
            Royalties ({royalties.length})
          </button>
        </div>

        {tab === "applications" && (
          <div className="records-table">
            <div className="records-table-head">
              <span>Artist</span>
              <span>Genres</span>
              <span>Status</span>
              <span>Submitted</span>
              <span>Action</span>
            </div>
            {applications.map(app => (
              <div key={app.id} className="records-table-row">
                <span><strong>{app.artistName}</strong><br /><small>@{app.artistHandle}</small></span>
                <span>{app.genres.join(", ")}</span>
                <span className={"records-status status-" + app.status}>{STATUS_LABELS[app.status]}</span>
                <span>{new Date(app.submittedAt).toLocaleDateString()}</span>
                <span><button className="btn" style={{ height: 28, fontSize: 11 }}>Review</button></span>
              </div>
            ))}
          </div>
        )}

        {tab === "releases" && (
          <div className="records-table">
            <div className="records-table-head">
              <span>Title</span>
              <span>Artist</span>
              <span>Status</span>
              <span>Release date</span>
              <span>Action</span>
            </div>
            {releases.map(r => (
              <div key={r.id} className="records-table-row">
                <span><strong>{r.title}</strong></span>
                <span>{r.artistName}</span>
                <span className={"records-status status-" + r.status}>{RELEASE_STATUS_LABELS[r.status]}</span>
                <span>{new Date(r.releaseDate).toLocaleDateString()}</span>
                <span><button className="btn" style={{ height: 28, fontSize: 11 }}>Approve</button></span>
              </div>
            ))}
          </div>
        )}

        {tab === "royalties" && (
          <div className="records-table">
            <div className="records-table-head">
              <span>Period</span>
              <span>Artist</span>
              <span>Gross</span>
              <span>Artist share</span>
              <span>Label share</span>
            </div>
            {royalties.map(r => (
              <div key={r.id} className="records-table-row">
                <span>{r.period}</span>
                <span>{r.artistName}</span>
                <span>£{r.grossRevenue.toFixed(0)}</span>
                <span>£{r.artistShare.toFixed(0)}</span>
                <span>£{r.labelShare.toFixed(0)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
