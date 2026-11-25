export type TrackProps = Record<string, string | number | boolean | undefined>;

// Fire-and-forget click/event tracking. Sends to /api/track (see app/api/track/route.ts).
export function track(event: string, props: TrackProps = {}) {
  if (typeof window === "undefined") return;
  const payload = JSON.stringify({ event, props, path: window.location.pathname, ts: Date.now() });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
    } else {
      fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true }).catch(() => {});
    }
  } catch {}
}