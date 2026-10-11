"use client";

import { useEffect } from "react";

export default function ArtistViewTracker({ artistSlug }: { artistSlug: string }) {
  useEffect(() => {
    const key = "artist_viewed_" + artistSlug;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    fetch("/api/artists/" + artistSlug + "/track-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }).catch(() => {});
  }, [artistSlug]);

  return null;
}
