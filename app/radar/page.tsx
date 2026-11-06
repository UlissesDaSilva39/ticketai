"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { buildRadarFeed } from "@/lib/radar";

export default function RadarPage() {
  const [feed, setFeed] = useState<any[]>([]);

  useEffect(() => {
    setFeed(buildRadarFeed());
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">GRID Radar</h1>
          <p className="page-subtitle">Your scene, right now. Curated across Stream, Tracks, Records, and Playlists.</p>
        </div>
      </div>

      {feed.map(section => (
        <section key={section.section} style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "20px", color: "#F8FAFC" }}>
            {section.label}
          </h2>
          
          {section.items.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: "#64748B", border: "1px dashed #293548", borderRadius: "8px" }}>
              Nothing here yet.
            </div>
          ) : (
            <div className="grid-cards">
              {section.items.map((item: any) => (
                <Link key={item.id} href={item.href} className="card">
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "16px" }}>
                    <div style={{ 
                      width: "48px", 
                      height: "48px", 
                      borderRadius: "8px", 
                      background: item.color,
                      flexShrink: 0 
                    }} />
                    <div>
                      <div className="card-title">{item.title}</div>
                      <div className="card-subtitle">{item.subtitle}</div>
                    </div>
                  </div>
                  
                  {item.meta && (
                    <div style={{ fontSize: "12px", color: "#64748B", marginTop: "auto", paddingTop: "16px", borderTop: "1px solid #293548" }}>
                      {item.meta}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
