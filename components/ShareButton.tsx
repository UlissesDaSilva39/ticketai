"use client";

import { useState } from "react";

export default function ShareButton({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  const share = async () => {
    try {
      const nav = navigator as Navigator & { share?: (d: { title: string; url: string }) => Promise<void> };
      if (nav.share) {
        await nav.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2000);
    }
  };

  const label = state === "copied" ? "Link copied" : state === "error" ? "Copy failed" : "Share";

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-white text-white text-sm font-medium rounded-full hover:bg-white/10 transition-colors"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
      {label}
    </button>
  );
}
