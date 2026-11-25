"use client";
import { useEffect } from "react";
import { useBadges } from "@/lib/hooks/useBadges";

export default function BadgeToast() {
  const { newlyEarned, dismissToast } = useBadges();

  useEffect(() => {
    if (newlyEarned.length === 0) return;
    const t = setTimeout(() => dismissToast(), 5000);
    return () => clearTimeout(t);
  }, [newlyEarned, dismissToast]);

  if (newlyEarned.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
      {newlyEarned.map((badge) => (
        <div
          key={badge.id}
          className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-lg p-4 flex items-start gap-3 animate-slide-in"
        >
          <div className={`w-10 h-10 rounded-full ${badge.color} text-white flex items-center justify-center flex-shrink-0`}>
            <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Badge unlocked</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{badge.name}</p>
            <p className="text-xs text-gray-500">{badge.description}</p>
          </div>
          <button
            onClick={dismissToast}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}