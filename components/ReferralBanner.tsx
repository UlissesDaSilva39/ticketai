"use client";
import { useState } from "react";
import { useReferral } from "@/lib/hooks/useReferral";

export default function ReferralBanner() {
  const { copyLink, hydrated } = useReferral("GRID");
  const [copied, setCopied] = useState(false);

  const handleInvite = async () => {
    const ok = await copyLink();
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  if (!hydrated) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-white dark:from-emerald-950/20 dark:to-zinc-900 rounded-xl border border-emerald-200 dark:border-emerald-900/40 p-4 shadow-sm flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-bold text-gray-900 dark:text-white">Invite a friend, both get 1 month of GRID Pro free</p>
        <p className="text-xs text-gray-600 dark:text-zinc-400 mt-0.5">
          {copied ? "Link copied to clipboard — paste it anywhere!" : "Tap Invite Friends — we'll copy your unique link"}
        </p>
      </div>
      <button
        onClick={handleInvite}
        className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
          copied
            ? "bg-emerald-600 text-white"
            : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
        }`}
      >
        {copied ? "Copied!" : "Invite Friends →"}
      </button>
    </div>
  );
}