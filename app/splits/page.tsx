"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getTracksByArtist } from "@/lib/data/licensedTracks";

export default function SplitsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const tracks = getTracksByArtist("1");
  const ratePerPlay = 0.003;
  const totalPlays = tracks.reduce(function(s, t) { return s + t.plays; }, 0);
  const totalRevenue = totalPlays * ratePerPlay;
  const totalFans = Math.round(totalPlays * 0.15);
  const potentialCollabs = Math.round(totalPlays / 5000);
  const moreGigRevenue = 400 * 5;
  const proMultiplier = 4;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-xs font-semibold text-gray-500 hover:text-emerald-600 mb-6 inline-block">
          Back to GRID
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your music this month</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Not just numbers — this is what your music did.
          </p>
        </div>

        {!mounted ? (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-8 text-center">
            <p className="text-sm text-gray-500">Loading...</p>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-8 text-white mb-6">
              <p className="text-sm text-emerald-100 mb-2">Your music earned</p>
              <p className="text-5xl font-bold mb-4">£{totalRevenue.toFixed(2)}</p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-emerald-200 text-xs uppercase font-semibold mb-1">People heard it</p>
                  <p className="font-bold text-lg">{totalPlays.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-emerald-200 text-xs uppercase font-semibold mb-1">New fans</p>
                  <p className="font-bold text-lg">{totalFans.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-emerald-200 text-xs uppercase font-semibold mb-1">Collabs found</p>
                  <p className="font-bold text-lg">{potentialCollabs}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">What you made</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">£{totalRevenue.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">At £0.003 per play</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">Potential gig revenue</p>
                <p className="text-2xl font-bold text-emerald-600">+£{moreGigRevenue}</p>
                <p className="text-xs text-gray-500 mt-1">5 more bookings at £400</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">With Pro</p>
                <p className="text-2xl font-bold text-amber-600">{proMultiplier}x</p>
                <p className="text-xs text-gray-500 mt-1">More gig applications</p>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 mb-6">
              <h2 className="font-bold text-gray-900 dark:text-white mb-4">How to earn more this month</h2>
              <div className="space-y-3">
                <Link href="/jobs" className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-emerald-400 transition-colors group">
                  <div>
                    <p className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-emerald-600">Apply to 5 more gigs</p>
                    <p className="text-xs text-gray-500">Matched gigs you haven't seen yet</p>
                  </div>
                  <span className="text-sm font-bold text-emerald-600">+£400 →</span>
                </Link>
                <Link href="/jobs" className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-emerald-400 transition-colors group">
                  <div>
                    <p className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-emerald-600">Feature a gig</p>
                    <p className="text-xs text-gray-500">10x more views for 7 days</p>
                  </div>
                  <span className="text-sm font-bold text-emerald-600">£10 →</span>
                </Link>
                <Link href="/pro" className="flex items-center justify-between p-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 hover:border-amber-400 transition-colors group">
                  <div>
                    <p className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-amber-700">Upgrade to Pro</p>
                    <p className="text-xs text-gray-500">Unlimited apps + priority matching</p>
                  </div>
                  <span className="text-sm font-bold text-amber-600">Try free →</span>
                </Link>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
              <h2 className="font-bold text-gray-900 dark:text-white mb-4">Your tracks</h2>
              <div className="space-y-3">
                {tracks.map(function(track) {
                  const revenue = track.plays * ratePerPlay;
                  return (
                    <div key={track.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-zinc-800">
                      <div>
                        <p className="font-bold text-sm text-gray-900 dark:text-white">{track.title}</p>
                        <p className="text-xs text-gray-500">{track.plays.toLocaleString()} plays · {track.genre}</p>
                      </div>
                      <p className="font-bold text-emerald-600">£{revenue.toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}