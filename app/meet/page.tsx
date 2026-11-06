"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { listMeets, MeetRoom, PURPOSE_LABELS } from "@/lib/meet";

export default function MeetHome() {
  const [meets, setMeets] = useState<MeetRoom[]>([]);
  
  useEffect(() => { 
    setMeets(listMeets()); 
  }, []);

  const upcoming = meets.filter(m => m.scheduledFor && m.scheduledFor > Date.now());
  const past = meets.filter(m => !m.scheduledFor || m.scheduledFor <= Date.now());

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <p style={{ color: "#16A36A", fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "8px" }}>
            GRID MEET
          </p>
          <h1 className="page-title">Meet, discuss, collaborate.</h1>
          <p className="page-subtitle">Video meetings for the music industry.</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/meet/new" className="btn-primary">New meeting</Link>
          <Link href="/meet/schedule" className="btn-secondary">Schedule</Link>
        </div>
      </div>

      <div style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 600, marginBottom: "16px", color: "#F8FAFC" }}>Your meetings</h2>
        
        <h3 style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
          Upcoming
        </h3>
        
        {upcoming.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#64748B", border: "1px dashed #293548", borderRadius: "8px" }}>
            No upcoming meetings.
          </div>
        ) : (
          <div className="grid-cards">
            {upcoming.map(m => (
              <Link key={m.id} href={`/meet/${m.id}`} className="card">
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#16A36A", background: "rgba(22, 163, 106, 0.12)", padding: "4px 8px", borderRadius: "4px" }}>
                      {PURPOSE_LABELS[m.purpose]}
                    </span>
                    {m.isPrivate && <span style={{ fontSize: "12px" }}>🔒</span>}
                  </div>
                  <div className="card-title">{m.title}</div>
                  <div className="card-subtitle">
                    Host: {m.hostName} · {m.kind === "audio-only" ? "Audio" : m.kind === "one-to-one" ? "1:1" : "Group"}
                  </div>
                </div>
                <div style={{ fontSize: "12px", color: "#64748B", fontFamily: "monospace", marginTop: "16px" }}>
                  {m.scheduledFor ? new Date(m.scheduledFor).toLocaleString() : "Now"}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
          Recent
        </h3>
        
        {past.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#64748B", border: "1px dashed #293548", borderRadius: "8px" }}>
            No past meetings.
          </div>
        ) : (
          <div className="grid-cards">
            {past.map(m => (
              <Link key={m.id} href={`/meet/${m.id}`} className="card">
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#16A36A", background: "rgba(22, 163, 106, 0.12)", padding: "4px 8px", borderRadius: "4px" }}>
                      {PURPOSE_LABELS[m.purpose]}
                    </span>
                  </div>
                  <div className="card-title">{m.title}</div>
                  <div className="card-subtitle">Host: {m.hostName}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
