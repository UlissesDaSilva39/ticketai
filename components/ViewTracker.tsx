"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ViewTracker({ eventId }: { eventId: string }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const key = "viewed_" + eventId;
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "1");
      fetch("/api/events/track-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      }).catch(() => {});
    }

    const code = searchParams.get("campaign");
    if (!code) return;

    let visitorId = localStorage.getItem("tk_visitor");
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem("tk_visitor", visitorId);
    }

    const clickKey = "tk_click_" + code;
    if (sessionStorage.getItem(clickKey)) return;
    sessionStorage.setItem(clickKey, "1");

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        eventId,
        visitorId,
        referrer: document.referrer || null,
      }),
    }).catch(() => {});
  }, [eventId, searchParams]);

  return null;
}
