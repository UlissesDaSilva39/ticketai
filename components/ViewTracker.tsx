"use client";

import { useEffect } from "react";

export default function ViewTracker({ eventId }: { eventId: string }) {
  useEffect(() => {
    const key = "viewed_" + eventId;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    fetch("/api/events/track-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId }),
    }).catch(() => {});
  }, [eventId]);

  return null;
}
