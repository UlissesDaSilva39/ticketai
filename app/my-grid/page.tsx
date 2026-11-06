"use client";
import Link from "next/link";

export default function MyGridPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My GRID</h1>
          <p className="page-subtitle">Your profile, saved events, and settings.</p>
        </div>
      </div>

      <div className="grid-cards">
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(22, 163, 106, 0.15)", color: "#16A36A", display: "grid", placeItems: "center", fontSize: "24px", fontWeight: 700 }}>U</div>
            <div>
              <div className="card-title">User</div>
              <div className="card-subtitle">@user</div>
            </div>
          </div>
          <p className="card-subtitle" style={{ marginBottom: "20px" }}>Attendee · London</p>
          <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
            <button className="btn-secondary" style={{ flex: 1, padding: "8px" }}>Edit Profile</button>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title" style={{ marginBottom: "16px" }}>Saved Events</h3>
          <div style={{ fontSize: "14px", color: "#94A3B8", marginBottom: "20px" }}>You have no saved events yet.</div>
          <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
            <Link href="/discover" className="btn-primary" style={{ flex: 1, padding: "8px", textAlign: "center", textDecoration: "none" }}>Explore Events</Link>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title" style={{ marginBottom: "16px" }}>My Tickets</h3>
          <div style={{ fontSize: "14px", color: "#94A3B8", marginBottom: "20px" }}>No upcoming tickets.</div>
          <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
            <button className="btn-secondary" style={{ flex: 1, padding: "8px" }}>View History</button>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title" style={{ marginBottom: "16px" }}>Network</h3>
          <div style={{ fontSize: "14px", color: "#94A3B8", marginBottom: "20px" }}>Follow artists, promoters, and venues.</div>
          <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
            <Link href="/network" className="btn-secondary" style={{ flex: 1, padding: "8px", textAlign: "center", textDecoration: "none" }}>Find People</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
