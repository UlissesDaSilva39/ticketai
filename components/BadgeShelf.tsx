"use client";
import { useBadges, BADGE_DEFINITIONS } from "@/lib/hooks/useBadges";

function BadgeIcon({ name, className }: { name: string; className?: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 2, viewBox: "0 0 24 24", className };
  switch (name) {
    case "eye":
      return (<svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /><circle cx="12" cy="12" r="3" /></svg>);
    case "compass":
      return (<svg {...common}><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>);
    case "sparkles":
      return (<svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>);
    case "users":
      return (<svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6-4a3 3 0 11-3-3" /></svg>);
    case "briefcase":
      return (<svg {...common}><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></svg>);
    case "zap":
      return (<svg {...common}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>);
    default:
      return (<svg {...common}><circle cx="12" cy="12" r="10" /></svg>);
  }
}

export default function BadgeShelf() {
  const { earned, unearned, hydrated } = useBadges();

  if (!hydrated) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4">Badges</h2>
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    );
  }

  if (earned.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 dark:text-white">Badges</h2>
          <span className="text-xs font-semibold text-gray-500">0 / {BADGE_DEFINITIONS.length}</span>
        </div>
        <div className="text-center py-6">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-800 mx-auto mb-3 flex items-center justify-center">
            <BadgeIcon name="sparkles" className="w-7 h-7 text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Earn your first badge</p>
          <p className="text-xs text-gray-500">View an artist profile, apply to a gig, or follow 3 artists to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900 dark:text-white">Badges</h2>
        <span className="text-xs font-semibold text-emerald-600">{earned.length} / {BADGE_DEFINITIONS.length}</span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
        {earned.map((badge) => (
          <div key={badge.id} className="flex flex-col items-center text-center group" title={badge.description}>
            <div className={`w-14 h-14 rounded-full ${badge.color} text-white flex items-center justify-center mb-2 ring-2 ring-transparent group-hover:ring-emerald-400 transition-all`}>
              <BadgeIcon name={badge.icon} className="w-6 h-6" />
            </div>
            <p className="text-[11px] font-bold text-gray-900 dark:text-white leading-tight">{badge.name}</p>
            <p className="text-[9px] text-gray-500 leading-tight">{badge.description}</p>
          </div>
        ))}
        {unearned.map((badge) => (
          <div key={badge.id} className="flex flex-col items-center text-center opacity-40" title={`Locked: ${badge.description}`}>
            <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-zinc-800 text-gray-400 flex items-center justify-center mb-2">
              <BadgeIcon name={badge.icon} className="w-6 h-6" />
            </div>
            <p className="text-[11px] font-bold text-gray-500 leading-tight">{badge.name}</p>
            <p className="text-[9px] text-gray-400 leading-tight">{badge.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}