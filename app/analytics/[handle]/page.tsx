"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getAnalytics, ArtistAnalytics } from "@/lib/analytics";
import { PLATFORMS } from "@/lib/platforms";

export default function AnalyticsPage() {
  const params = useParams();
  const handle = params?.handle as string;
  const [data, setData] = useState<ArtistAnalytics | null>(null);

  useEffect(() => {
    if (handle) setData(getAnalytics(handle));
  }, [handle]);

  if (!data) return <div className="meta-page meta-container" style={{ padding: 48 }}>No analytics for this artist.</div>;

  return (
    <div className="meta-page">
      <div className="meta-container" style={{ padding: "48px 24px" }}>
        <Link href={`/artists/${data.artistHandle}`} className="meta-back">← Back to profile</Link>
        <h1 className="meta-h1">Streaming analytics</h1>
        <p className="meta-sub">{data.artistName} · Updated {new Date(data.lastUpdated).toLocaleString()}</p>

        <div className="analytics-stats">
          <div className="analytics-stat">
            <div className="analytics-stat-value">{data.totalStreams.toLocaleString()}</div>
            <div className="analytics-stat-label">Total streams (30d)</div>
          </div>
          <div className="analytics-stat">
            <div className="analytics-stat-value">{data.monthlyListeners.toLocaleString()}</div>
            <div className="analytics-stat-label">Monthly listeners</div>
          </div>
          <div className="analytics-stat">
            <div className="analytics-stat-value">{data.countries}</div>
            <div className="analytics-stat-label">Countries</div>
          </div>
          <div className="analytics-stat">
            <div className="analytics-stat-value" style={{ color: data.growth > 0 ? "#00ff87" : "#ef4444" }}>
              {data.growth > 0 ? "+" : ""}{data.growth}%
            </div>
            <div className="analytics-stat-label">Growth</div>
          </div>
        </div>

        <div className="analytics-grid">
          <div className="analytics-card">
            <h3 className="analytics-h3">By platform</h3>
            {data.perPlatform.map(p => {
              const meta = PLATFORMS[p.platform];
              return (
                <div key={p.platform} className="analytics-bar-row">
                  <div className="analytics-bar-label">
                    <span className="smart-platform-dot" style={{ background: meta.color }} />
                    {meta.name}
                  </div>
                  <div className="analytics-bar-track">
                    <div className="analytics-bar-fill" style={{ width: `${(p.streams / data.totalStreams) * 100}%`, background: meta.color }} />
                  </div>
                  <div className="analytics-bar-value">{p.streams.toLocaleString()}</div>
                </div>
              );
            })}
          </div>

          <div className="analytics-card">
            <h3 className="analytics-h3">Top countries</h3>
            {data.topCountries.map(c => (
              <div key={c.code} className="analytics-country-row">
                <span>{c.flag} {c.name}</span>
                <span>{c.pct}%</span>
              </div>
            ))}
          </div>

          <div className="analytics-card">
            <h3 className="analytics-h3">Connected sources</h3>
            {data.connected.map(c => (
              <div key={c.platform} className="analytics-conn-row">
                <span className="smart-platform-dot" style={{ background: PLATFORMS[c.platform].color }} />
                <span>{PLATFORMS[c.platform].name}</span>
                <span style={{ marginLeft: "auto", color: c.connected ? "#00ff87" : "#6b7480" }}>
                  {c.connected ? "Connected" : "Connect"}
                </span>
              </div>
            ))}
          </div>

          <div className="analytics-card">
            <h3 className="analytics-h3">Top playlists</h3>
            {data.topPlaylists.length === 0 ? (
              <div className="meta-empty">No playlist placements yet.</div>
            ) : (
              data.topPlaylists.map(p => (
                <div key={p.name} className="analytics-playlist-row">
                  <span>{p.name}</span>
                  <span>{p.tracks} tracks · {PLATFORMS[p.platform].name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
