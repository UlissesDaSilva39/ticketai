"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getStation,
  fetchNowPlaying,
  fetchSchedule,
  RadioNowPlaying,
  RadioShow,
  RadioStation,
  isLiveStreamAvailable,
} from "@/lib/radio";
import RadioPlayer from "@/components/radio/RadioPlayer";
import NowPlaying from "@/components/radio/NowPlaying";
import Schedule from "@/components/radio/Schedule";
import "@/app/styles/radio.css";

export default function RadioPage() {
  const [station, setStation] = useState<RadioStation | null>(null);
  const [now, setNow] = useState<RadioNowPlaying | null>(null);
  const [shows, setShows] = useState<RadioShow[]>([]);

  useEffect(() => {
    setStation(getStation());
    fetchNowPlaying().then(setNow);
    fetchSchedule().then(setShows);

    // Poll every 15 seconds for now-playing
    const interval = setInterval(() => {
      fetchNowPlaying().then(setNow);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!station || !now) {
    return (
      <div className="radio-page">
        <div className="radio-container">
          <div className="radio-loading">Loading GRID Radio...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="radio-page">
      <header className="radio-hero">
        <div className="radio-container">
          <p className="radio-eyebrow">GRID RADIO</p>
          <h1 className="radio-title">The sound of the underground.</h1>
          <p className="radio-subtitle">
            24/7 live from GRID. DJ sets, live sessions, and underground selects — always on.
          </p>
          {!isLiveStreamAvailable() && (
            <div className="radio-demo-notice">
              Demo mode — AzuraCast not configured. Set NEXT_PUBLIC_AZURACAST_URL in .env.local to go live.
            </div>
          )}
        </div>
      </header>

      <section className="radio-section">
        <div className="radio-container">
          <RadioPlayer station={station} />
        </div>
      </section>

      <section className="radio-section">
        <div className="radio-container">
          <NowPlaying data={now} />
        </div>
      </section>

      <section className="radio-section">
        <div className="radio-container">
          <Schedule shows={shows} />
        </div>
      </section>

      <section className="radio-section">
        <div className="radio-container">
          <div className="radio-cta">
            <h2>Want your music on GRID Radio?</h2>
            <p>Sign with GRID Records, release through Distribution, or sell on Tracks — all get airplay.</p>
            <div className="radio-cta-actions">
              <Link href="/records/apply" className="btn">Apply to GRID Records</Link>
              <Link href="/tracks/new" className="btn btn-outline">Upload a track</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
