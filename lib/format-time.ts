export function relativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "";
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 30) return "just now";
  if (diffSec < 60) return diffSec + "s ago";

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return diffMin + "m ago";

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return diffHr + "h ago";

  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return "yesterday";
  if (diffDay < 7) return diffDay + "d ago";

  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export function fullTime(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
