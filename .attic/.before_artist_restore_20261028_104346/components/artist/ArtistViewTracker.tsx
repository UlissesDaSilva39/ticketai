"use client";

import { useEffect } from "react";

function detectSource(): string {
  if (typeof document === "undefined") return "direct";
  const ref = document.referrer || "";
  const params = new URLSearchParams(window.location.search);
  const utm = params.get("utm_source");
  if (utm) return utm.toLowerCase();
  if (!ref) return "direct";
  try {
    const host = new URL(ref).hostname.replace(/^www\./, "");
    const here = window.location.hostname.replace(/^www\./, "");
    if (host === here) return "internal";
    if (/google|bing|duckduckgo|yahoo|ecosia|brave/.test(host)) return "search";
    if (/instagram|facebook|tiktok|twitter|x\.com|threads|linkedin|reddit|youtube/.test(host)) return "social";
    return "referral";
  } catch {
    return "referral";
  }
}

export default function ArtistViewTracker({ artistSlug }: { artistSlug: string }) {
  useEffect(() => {
    if (!artistSlug) return;
    const key = "artist_viewed_" + artistSlug;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    const payload = {
      artist_slug: artistSlug,
      source: detectSource(),
      referrer: document.referrer || null,
    };

    fetch("/api/artists/" + encodeURIComponent(artistSlug) + "/track-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  }, [artistSlug]);
  return null;
}
