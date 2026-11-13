"use client";
import { useState } from "react";
import { useReferral } from "@/lib/hooks/useReferral";

export default function ReferralCard() {
  const { code, referralUrl, stats, copyLink, share, hydrated } = useReferral("GRID");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyLink();
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const handleShare = async (channel: "native" | "whatsapp" | "twitter" | "email") => {
    await share(channel);
  };

  if (!hydrated) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
        <p className="text-sm text-gray-500">Loading referral…</p>
      </div>
    );
  }

  const earnedPounds = (stats.earnedPence / 100).toFixed(0);

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-zinc-900 rounded-xl border border-emerald-200 dark:border-emerald-900/40 p-5 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-white">Invite a friend, both get a month free</h3>
          <p className="text-xs text-gray-600 dark:text-zinc-400 mt-0.5">Share your link. When they sign up, you both get GRID Pro for a month.</p>
        </div>
      </div>

      {/* Copy link row */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1 min-w-0 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono text-gray-700 dark:text-zinc-300 truncate">
          {referralUrl}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
            copied
              ? "bg-emerald-600 text-white"
              : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
          }`}
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>

      {/* Share buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => handleShare("whatsapp")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-semibold transition-colors"
        >
          WhatsApp
        </button>
        <button
          onClick={() => handleShare("twitter")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold transition-colors"
        >
          X
        </button>
        <button
          onClick={() => handleShare("email")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 text-xs font-semibold transition-colors"
        >
          Email
        </button>
        <button
          onClick={() => handleShare("native")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 text-xs font-semibold transition-colors"
        >
          Share
        </button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs">
        <div>
          <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wide">Invited</p>
          <p className="text-base font-bold text-gray-900 dark:text-white">{stats.shared}</p>
        </div>
        <div className="w-px h-8 bg-gray-200 dark:bg-zinc-700" />
        <div>
          <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wide">Joined</p>
          <p className="text-base font-bold text-gray-900 dark:text-white">{stats.joined}</p>
        </div>
        <div className="w-px h-8 bg-gray-200 dark:bg-zinc-700" />
        <div>
          <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wide">Earned</p>
          <p className="text-base font-bold text-emerald-600">£{earnedPounds}</p>
        </div>
      </div>

      <p className="text-[10px] text-gray-500 mt-3">Your code: <span className="font-mono font-bold text-gray-700 dark:text-zinc-300">{code}</span></p>
    </div>
  );
}