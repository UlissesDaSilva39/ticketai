"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { listMeets, MeetRoom, PURPOSE_LABELS } from "@/lib/meet";

export default function MeetHome() {
  const [meets, setMeets] = useState<MeetRoom[]>([]);
  useEffect(() => { setMeets(listMeets()); }, []);
  const upcoming = meets.filter(m => m.scheduledFor && m.scheduledFor > Date.now());
  const past = meets.filter(m => !m.scheduledFor || m.scheduledFor <= Date.now());

  return (
    <div className="meet-page">
      <header className="meet-hero">
        <div className="meet-container">
          <p className="meet-eyebrow">GRID MEET</p>
          <h1 className="meet-title">Meet, discuss, collaborate.</h1>
          <p className="meet-subtitle">Video meetings for the music industry.</p>
          <div className="meet-hero-actions">
            <Link href="/meet/new" className="btn btn-primary">New meeting</Link>
            <Link href="/meet/schedule" className="btn">Schedule</Link>
          </div>
        </div>
      </header>
      <section className="meet-section">
        <div className="meet-container">
          <h2 className="meet-h2">Your meetings</h2>
          <h3 className="meet-h3">Upcoming</h3>
          {upcoming.length === 0 ? <div className="meet-empty">No upcoming meetings.</div> : (
            <div className="meet-grid">
              {upcoming.map(m => (
                <Link key={m.id} href={`/meet/${m.id}`} className="meet-card">
                  <div className="meet-card-head"><span className="meet-card-purpose">{PURPOSE_LABELS[m.purpose]}</span></div>
                  <div className="meet-card-title">{m.title}</div>
                  <div className="meet-card-meta">Host: {m.hostName}</div>
                  <div className="meet-card-time">{m.scheduledFor ? new Date(m.scheduledFor).toLocaleString() : "Now"}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
