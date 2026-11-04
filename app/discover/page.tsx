"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { listSmartLinks, SmartLink } from "@/lib/smartLinks";
import { listAnalytics } from "@/lib/analytics";
import { listPlaylists } from "@/lib/playlists";
import { listStreamItems } from "@/lib/stream";
import { listTracks } from "@/lib/tracks";
import { listReleases } from "@/lib/records";

export default function DiscoverPage() {
  const [links, setLinks] = useState<SmartLink[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [streams, setStreams] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const [releases, setReleases] = useState<any[]>([]);

  useEffect(() => {
    setLinks(listSmartLinks());
    setAnalytics(listAnalytics());
    setPlaylists(listPlaylists());
    setStreams(listStreamItems());
    setTracks(listTracks());
    setReleases(listReleases());
  }, []);

  return (
    <div className="meta-page">
      <header className="meta-hero">
        <div className="meta-container">
          <h1 className="meta-h1-large">Discover</h1>
          <p className="meta-sub-large">
            One place to see everything. Trending across every platform, every section of GRID.
          </p>
          <div className="discover-quick-links">
            <Link href="/radar" className="btn btn-primary">Open GRID Radar</Link>
            <Link href="/playlists" className="btn">Browse playlists</Link>
            <Link href="/import/spotify" className="btn">Import from Spotify</Link>
          </div>
        </div>
      </header>

      <section className="meta-section">
        <div className="meta-container">
          <h2 className="meta-h2">Top smart links</h2>
          <p className="meta-sub">Tracks with the most clicks — across all streaming platforms.</p>
          <div className="discover-grid">
            {links.slice(0, 4).map(link => {
              const totalClicks = Object.values(link.clicks).reduce((a, b) => a + b, 0);
              return (
                <Link key={link.id} href={`/smart/${link.id}`} className="discover-card">
                  <div className="discover-card-color" style={{ background: link.coverColor }} />
                  <div className="discover-card-body">
                    <div className="discover-card-title">{link.title}</div>
                    <div className="discover-card-artist">{link.artistName}</div>
                    <div className="discover-card-meta">{totalClicks.toLocaleString()} clicks · {Object.keys(link.platforms).length} platforms</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="meta-section">
        <div className="meta-container">
          <h2 className="meta-h2">Rising artists</h2>
          <p className="meta-sub">Fastest growing in the last 30 days.</p>
          <div className="discover-grid">
            {analytics.map(a => (
              <Link key={a.artistHandle} href={`/analytics/${a.artistHandle}`} className="discover-card">
                <div className="discover-card-color" style={{ background: "#00ff87" }} />
                <div className="discover-card-body">
                  <div className="discover-card-title">{a.artistName}</div>
                  <div className="discover-card-meta">
                    {a.totalStreams.toLocaleString()} streams · <span style={{ color: "#00ff87" }}>+{a.growth}%</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="meta-section">
        <div className="meta-container">
          <h2 className="meta-h2">Live on GRID</h2>
          <div className="discover-grid">
            {streams.filter(s => s.kind === "live").map(s => (
              <Link key={s.id} href={`/stream/watch/${s.id}`} className="discover-card">
                <div className="discover-card-color" style={{ background: "#ef4444" }} />
                <div className="discover-card-body">
                  <div className="discover-card-title">{s.title}</div>
                  <div className="discover-card-meta">{s.viewerCount} watching</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="meta-section">
        <div className="meta-container">
          <h2 className="meta-h2">Latest releases</h2>
          <div className="discover-grid">
            {releases.filter(r => r.status === "live").map(r => (
              <Link key={r.id} href={`/records/artist/${r.artistHandle}`} className="discover-card">
                <div className="discover-card-color" style={{ background: r.coverColor }} />
                <div className="discover-card-body">
                  <div className="discover-card-title">{r.title}</div>
                  <div className="discover-card-artist">{r.artistName}</div>
                  <div className="discover-card-meta">{r.genre}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="meta-section">
        <div className="meta-container">
          <h2 className="meta-h2">Playlists</h2>
          <div className="discover-grid">
            {playlists.map(p => (
              <Link key={p.id} href={`/playlists/${p.id}`} className="discover-card">
                <div className="discover-card-color" style={{ background: p.coverColor }} />
                <div className="discover-card-body">
                  <div className="discover-card-title">{p.title}</div>
                  <div className="discover-card-meta">{p.tracks.length} tracks · {p.followers} followers</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="meta-section">
        <div className="meta-container">
          <h2 className="meta-h2">On GRID Tracks</h2>
          <div className="discover-grid">
            {tracks.slice(0, 4).map(t => (
              <Link key={t.id} href={`/tracks/${t.id}`} className="discover-card">
                <div className="discover-card-color" style={{ background: t.coverColor }} />
                <div className="discover-card-body">
                  <div className="discover-card-title">{t.title}</div>
                  <div className="discover-card-artist">{t.producerName}</div>
                  <div className="discover-card-meta">£{t.price} · {t.views} views</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
