"use client";
import Link from "next/link";

export default function RoyaltiesPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Royalties</h1>
          <p className="page-subtitle">Know what you are owed. Get paid on time.</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button className="btn-secondary">+ Add a track</button>
          <button className="btn-primary">Import a statement</button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid-cards" style={{ marginBottom: "48px" }}>
        <div className="card">
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>This month</div>
          <div style={{ fontSize: "32px", fontWeight: 800, color: "#16A36A" }}>£1,240.00</div>
          <div style={{ fontSize: "13px", color: "#64748B", marginTop: "4px" }}>Gross across all sources</div>
        </div>
        <div className="card">
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Pending</div>
          <div style={{ fontSize: "32px", fontWeight: 800, color: "#F8FAFC" }}>£384.00</div>
          <div style={{ fontSize: "13px", color: "#64748B", marginTop: "4px" }}>Earned, not yet paid out</div>
        </div>
        <div className="card">
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Paid YTD</div>
          <div style={{ fontSize: "32px", fontWeight: 800, color: "#F8FAFC" }}>£8,920.00</div>
          <div style={{ fontSize: "13px", color: "#64748B", marginTop: "4px" }}>Already in your account</div>
        </div>
        <div className="card">
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Unclaimed</div>
          <div style={{ fontSize: "32px", fontWeight: 800, color: "#F59E0B" }}>£340.00</div>
          <div style={{ fontSize: "13px", color: "#64748B", marginTop: "4px" }}>Sitting in societies</div>
        </div>
      </div>

      {/* Splits Section */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>Splits</h2>
        <p style={{ fontSize: "14px", color: "#94A3B8", marginBottom: "24px" }}>Who gets paid for each track</p>
        
        <div style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid #F59E0B", borderRadius: "8px", padding: "16px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 600, color: "#F59E0B", fontSize: "14px", marginBottom: "4px" }}>Assign splits</div>
            <div style={{ fontSize: "13px", color: "#94A3B8" }}>2 tracks have earnings but incomplete splits. Money is being held.</div>
          </div>
          <button className="btn-primary">Assign</button>
        </div>

        <div className="grid-cards">
          {[
            { title: "Late Night Drive", artist: "DJ Poxy - Alex Rivera (producer), Kim Tanaka (vocal)", amount: "£420.00", status: "Assigned" },
            { title: "Paper Planes", artist: "Paper Lions", amount: "£380.00", status: "No splits" },
            { title: "Basement Nights", artist: "Basement Collective - Marco Silva (writer)", amount: "£260.00", status: "Partial" },
            { title: "Analog Dreams", artist: "Analog Dreams - Nina Park (producer)", amount: "£180.00", status: "Assigned" }
          ].map((track, i) => (
            <div key={i} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <div className="card-title">{track.title}</div>
                <div style={{ fontWeight: 700, color: "#16A36A" }}>{track.amount}</div>
              </div>
              <div className="card-subtitle" style={{ marginBottom: "16px" }}>{track.artist}</div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", background: track.status === "Assigned" ? "rgba(22, 163, 106, 0.15)" : "#293548", color: track.status === "Assigned" ? "#16A36A" : "#94A3B8", padding: "4px 8px", borderRadius: "4px" }}>
                  {track.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statements Table */}
      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>Statements</h2>
        <p style={{ fontSize: "14px", color: "#94A3B8", marginBottom: "24px" }}>Income from every source in one place</p>
        
        <div style={{ background: "#172033", border: "1px solid #293548", borderRadius: "12px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#111827", borderBottom: "1px solid #293548", color: "#94A3B8", fontSize: "12px" }}>
                <th style={{ padding: "16px", fontWeight: 600 }}>Source</th>
                <th style={{ padding: "16px", fontWeight: 600 }}>Period</th>
                <th style={{ padding: "16px", fontWeight: 600 }}>Gross</th>
                <th style={{ padding: "16px", fontWeight: 600 }}>Net</th>
                <th style={{ padding: "16px", fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "14px" }}>
              {[
                { source: "Spotify", period: "Oct 2026", gross: "£1,240.00", net: "£1,116.00", status: "Matched" },
                { source: "Apple Music", period: "Oct 2026", gross: "£380.00", net: "£342.00", status: "Matched" },
                { source: "TikTok (UGC)", period: "Q3 2026", gross: "£95.00", net: "£85.50", status: "Unmatched" },
                { source: "PRS (publishing)", period: "Sep 2026", gross: "£420.00", net: "£420.00", status: "Matched" },
                { source: "Bandcamp", period: "Oct 2026", gross: "£120.00", net: "£108.00", status: "Pending" },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: i < 4 ? "1px solid #293548" : "none" }}>
                  <td style={{ padding: "16px", fontWeight: 500 }}>{row.source}</td>
                  <td style={{ padding: "16px", color: "#94A3B8" }}>{row.period}</td>
                  <td style={{ padding: "16px" }}>{row.gross}</td>
                  <td style={{ padding: "16px", fontWeight: 600 }}>{row.net}</td>
                  <td style={{ padding: "16px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, background: "#293548", padding: "4px 8px", borderRadius: "4px" }}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
