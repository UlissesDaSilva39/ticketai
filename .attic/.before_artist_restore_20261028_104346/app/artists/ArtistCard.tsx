"use client";

import { useState } from "react";
import type { Artist } from "@/lib/artistData";
import { spotifyEmbedUrl } from "@/lib/artistData";
import styles from "./ArtistCard.module.css";

type Props = {
  artist: Artist;
};

export default function ArtistCard({ artist }: Props) {
  const [followed, setFollowed] = useState<boolean>(artist.followed ?? false);
  const [pending, setPending] = useState(false);

  const nextEvent = artist.events[0];
  const topMerch = artist.merch[0];
  const topClip = artist.clips[0];

  async function handleFollow() {
    if (pending) return;
    setPending(true);
    try {
      const res = await fetch("/api/artists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artistId: artist.id }),
      });
      if (res.ok) {
        setFollowed((f) => !f);
      }
    } catch {
      // ignore — demo only
    } finally {
      setPending(false);
    }
  }

  return (
    <article className={styles.card}>
      {/* 1. Spotify embed */}
      <iframe
        className={styles.spotifyEmbed}
        src={spotifyEmbedUrl(artist.spotifyId)}
        width="100%"
        height="352"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title={`${artist.name} on Spotify`}
      />

      {/* 2. Action buttons */}
      <div className={styles.actions}>
        <button
          type="button"
          onClick={handleFollow}
          disabled={pending}
          className={followed ? styles.followed : styles.follow}
        >
          {followed ? "Following" : pending ? "..." : "Follow"}
        </button>

        {nextEvent && (
          <a
            className={styles.primary}
            href={nextEvent.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Tickets
          </a>
        )}
      </div>

      {/* 3. Next event teaser */}
      {nextEvent && (
        <a
          className={styles.eventRow}
          href={nextEvent.ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={styles.eventIcon} aria-hidden="true">🎫</span>
          <span className={styles.eventText}>
            <strong>{formatDate(nextEvent.date)}</strong> · {nextEvent.city}
            <span className={styles.eventVenue}>{nextEvent.venue}</span>
          </span>
        </a>
      )}

      {/* 4. Merch teaser */}
      {topMerch && (
        <a
          className={styles.merchRow}
          href={topMerch.buyUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={topMerch.imageUrl}
            alt={topMerch.name}
            className={styles.merchImg}
          />
          <span className={styles.merchText}>
            <span className={styles.merchName}>{topMerch.name}</span>
            <span className={styles.merchPrice}>
              {topMerch.currency} {topMerch.price.toFixed(2)}
            </span>
          </span>
        </a>
      )}

      {/* 5. Clip teaser */}
      {topClip && (
        <a
          className={styles.clipRow}
          href={topClip.watchUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={topClip.embedUrl}
            alt={topClip.title}
            className={styles.clipThumb}
          />
          <span className={styles.clipText}>
            <span className={styles.clipPlay}>▶</span>
            {topClip.title}
          </span>
        </a>
      )}
    </article>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  } catch {
    return iso;
  }
}