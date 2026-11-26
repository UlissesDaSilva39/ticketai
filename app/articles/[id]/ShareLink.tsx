"use client";

import { useState } from "react";

export default function ShareLink({ title }: { title: string }) {
  const [done, setDone] = useState(false);
  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title, url });
      else {
        await navigator.clipboard.writeText(url);
        setDone(true);
        setTimeout(() => setDone(false), 2000);
      }
    } catch {
      /* cancelled */
    }
  }
  return (
    <button type="button" onClick={share} className="px-4 py-1.5 rounded-full text-sm font-bold border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-200 hover:border-emerald-500">
      {done ? "Link copied" : "Share"}
    </button>
  );
}
