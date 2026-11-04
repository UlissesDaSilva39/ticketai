"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getArtist, listReleases, SignedArtist, Release, CONTRACT_LABELS, RELEASE_STATUS_LABELS } from "@/lib/records";

export default function ArtistPage() {
  const params = useParams();
  const handle = params?.handle as string;
  const [artist, setArtist] = useState<SignedArtist | null>(null);
  const [releases, setReleases] = useState<Release[]>([]);

  useEffect(() => {
    if (!handle) return;
    setArtist(getArtist(handle));
    setReleases(listReleases().filter(r => r.artistHandle === handle));
  }, [handle]);

  if (!artist) return <div className="records-page records-container" style={{ padding: 48 }}>Artist not found.</div>;

  return (
    <div className="records-page">
      <header className="records-artist-hero">
        <div className="records-container records-artist-hero-inner">
          <div className="records-artist-avatar" style={{ background: artist.color }}>
            {artist.name[0]}
          </div>
          <div className="records-artist-hero-info">
            <h1 className="records-artist-name">{artist.name}</h1>
            <div className="records-artist-genres">{artist.genres.join(" · ")}</div>
            <p className="records-artist-bio">{artist.bio}</p>
            <div className="records-artist-stats">
              <span><strong>{artist.totalReleases}</strong> releases</span>
              <span><strong>{(artist.totalStreams / 1000).toFixed(0)}k</strong> streams</span>
              <span><strong>{artist.artistSplit}%</strong> artist split</span>
              <span><strong>{CONTRACT_LABELS[artist.contractType]}</strong></span>
            </div>
          </div>
        </div>
      </header>

      <section className="records-section">
        <div className="records-container">
          <h2 className="records-h2">Releases</h2>
          {releases.length === 0 ? (
            <div className="records-empty">No releases yet.</div>
          ) : (
            <div className="records-release-grid">
              {releases.map(r => (
                <div key={r.id} className="records-release-card">
                  <div className="records-release-cover" style={{ background: r.coverColor }}>
                    <div className="records-release-cover-inner">
                      <div className="records-release-cover-title">{r.title}</div>
                    </div>
                  </div>
                  <div className="records-release-title">{r.title}</div>
                  <div className="records-release-meta">
                    {r.tracks} track{r.tracks > 1 ? "s" : ""} · {RELEASE_STATUS_LABELS[r.status]} · {new Date(r.releaseDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
