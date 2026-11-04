"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { buildRadarFeed, RadarSection } from "@/lib/radar";

export default function RadarPage() {
  const [feed, setFeed] = useState<any[]>([]);

  useEffect(() => {
    setFeed(buildRadarFeed());
  }, []);

  return (
    <div className="meta-page">
      <div className="meta-container" style={{ padding: "48px 24px" }}>
        <h1 className="meta-h1">GRID Radar</h1>
        <p className="meta-sub">Your scene, right now. Curated across Stream, Tracks, Records, and Playlists.</p>

        {feed.map(section => (
          <section key={section.section} className="radar-section">
            <h2 className="radar-h2">{section.label}</h2>
            {section.items.length === 0 ? (
              <div className="meta-empty">Nothing here yet.</div>
            ) : (
              <div className="radar-grid">
                {section.items.map((item: any) => (
                  <Link key={item.id} href={item.href} className="radar-card">
                    <div className="radar-card-color" style={{ background: item.color }} />
                    <div className="radar-card-body">
                      <div className="radar-card-title">{item.title}</div>
                      <div className="radar-card-sub">{item.subtitle}</div>
                      {item.meta && <div className="radar-card-meta">{item.meta}</div>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
