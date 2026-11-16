"use client";
import Link from "next/link";
import { useProStatus } from "@/lib/hooks/useProStatus";
import AnalyticsCard from "@/components/AnalyticsCard";
import {
  MOCK_PROFILE_VIEWERS,
  MOCK_CHART_HISTORY,
  MOCK_GENRE_STATS,
  MOCK_APPLICATION_STATS,
  MOCK_VIEW_SOURCES,
  MOCK_PROFILE_STATS,
} from "@/lib/data/analyticsData";

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 60) return min + "m ago";
  const hr = Math.floor(min / 60);
  if (hr < 24) return hr + "h ago";
  return Math.floor(hr / 24) + "d ago";
}

export default function AnalyticsDashboard() {
  const { isPro, isTrial, hydrated } = useProStatus();
  if (!hydrated) return null;
  const hasAccess = isPro || isTrial;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <Link href="/pro" className="text-xs font-semibold text-gray-500 hover:text-emerald-600 mb-6 inline-block">← Back to Pro</Link>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400">Your performance on GRID. Who is viewing, what is landing, where you rank.</p>
        </div>

        {!hasAccess && (
          <div className="bg-gradient-to-r from-amber-500 to-amber-700 rounded-xl p-6 mb-6 text-white">
            <h2 className="text-xl font-bold mb-2">Unlock full analytics with Pro</h2>
            <p className="text-sm text-amber-100 mb-4">See who viewed your profile, track your response rate, and find your chart position. Free users see sample data below.</p>
            <Link href="/pro" className="inline-block bg-white text-amber-700 font-bold px-6 py-2.5 rounded-lg">Start 30-day free trial →</Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <AnalyticsCard title="Profile views this week" blurred={!hasAccess}>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{MOCK_PROFILE_STATS.totalViewsThisWeek}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">+{MOCK_PROFILE_STATS.newThisWeek} new</p>
          </AnalyticsCard>
          <AnalyticsCard title="Followers this week" blurred={!hasAccess}>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">+{MOCK_PROFILE_STATS.followersGained}</p>
            <p className="text-xs text-gray-500 mt-1">Total: 2,412</p>
          </AnalyticsCard>
          <AnalyticsCard title="Response rate" blurred={!hasAccess}>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{MOCK_APPLICATION_STATS.responseRate}%</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">{MOCK_APPLICATION_STATS.responseRate - MOCK_APPLICATION_STATS.industryAvgResponseRate}% above average</p>
          </AnalyticsCard>
        </div>

        <div className="mb-6">
          <AnalyticsCard title="Who viewed your profile" subtitle="Last 7 days" blurred={!hasAccess}>
            <div className="space-y-2">
              {MOCK_PROFILE_VIEWERS.slice(0, 6).map((v) => (
                <div key={v.id} className="flex items-center gap-3 py-1.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white grid place-items-center text-xs font-bold flex-shrink-0">{v.name[0]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{v.name}</p>
                    <p className="text-[10px] text-gray-500">{v.role} · {v.city}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 flex-shrink-0">{timeAgo(v.viewedAt)}</span>
                </div>
              ))}
              {hasAccess && <p className="text-xs text-center text-emerald-600 font-semibold pt-2">+ {MOCK_PROFILE_VIEWERS.length - 6} more this week</p>}
            </div>
          </AnalyticsCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <AnalyticsCard title="Chart position" subtitle="GRID Billboard" blurred={!hasAccess}>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">#{MOCK_CHART_HISTORY[0].rank}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">Up {MOCK_CHART_HISTORY[1].rank - MOCK_CHART_HISTORY[0].rank} places</p>
          </AnalyticsCard>
          <AnalyticsCard title="Applications" subtitle="Last 30 days" blurred={!hasAccess}>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div><p className="text-xl font-bold text-gray-900 dark:text-white">{MOCK_APPLICATION_STATS.totalApplications}</p><p className="text-[10px] text-gray-500">Sent</p></div>
              <div><p className="text-xl font-bold text-emerald-600">{MOCK_APPLICATION_STATS.responses}</p><p className="text-[10px] text-gray-500">Responses</p></div>
              <div><p className="text-xl font-bold text-gray-900 dark:text-white">{MOCK_APPLICATION_STATS.bookings}</p><p className="text-[10px] text-gray-500">Booked</p></div>
            </div>
          </AnalyticsCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <AnalyticsCard title="Profile views by source" blurred={!hasAccess}>
            <div className="space-y-2">
              {MOCK_VIEW_SOURCES.map((s) => (
                <div key={s.source}>
                  <div className="flex justify-between text-xs mb-0.5"><span className="text-gray-700 dark:text-zinc-300">{s.source}</span><span className="font-bold text-gray-900 dark:text-white">{s.count}</span></div>
                  <div className="w-full bg-gray-100 dark:bg-zinc-700 rounded-full h-1.5"><div className="bg-emerald-600 h-1.5 rounded-full" style={{width: s.percentage + "%"}}></div></div>
                </div>
              ))}
            </div>
          </AnalyticsCard>
          <AnalyticsCard title="Plays by genre" blurred={!hasAccess}>
            <div className="space-y-2">
              {MOCK_GENRE_STATS.map((g) => (
                <div key={g.genre}>
                  <div className="flex justify-between text-xs mb-0.5"><span className="text-gray-700 dark:text-zinc-300">{g.genre}</span><span className="font-bold text-gray-900 dark:text-white">{g.plays.toLocaleString()}</span></div>
                  <div className="w-full bg-gray-100 dark:bg-zinc-700 rounded-full h-1.5"><div className="bg-pink-500 h-1.5 rounded-full" style={{width: g.percentage + "%"}}></div></div>
                </div>
              ))}
            </div>
          </AnalyticsCard>
        </div>

        {hasAccess ? (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 text-center">
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">You are on Pro — this data updates every 24 hours.</p>
          </div>
        ) : (
          <div className="text-center">
            <Link href="/pro" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-lg">Unlock full analytics with Pro →</Link>
          </div>
        )}
      </div>
    </div>
  );
}