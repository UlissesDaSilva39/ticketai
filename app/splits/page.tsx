"use client";
import { useState } from "react";
import Link from "next/link";
import { useLicensing } from "@/lib/hooks/useLicensing";
import { getTracksByArtist } from "@/lib/data/licensedTracks";

export default function SplitsPage() {
  const { getPlayCount, hydrated } = useLicensing();
  const [artistId, setArtistId] = useState("1");

  if (!hydrated) return null;

  const tracks = getTracksByArtist(artistId);
  const ratePerPlay = 0.003;
  const totalPlays = tracks.reduce((sum, t) => sum + getPlayCount(t.id, t.plays), 0);
  const totalRevenue = totalPlays * ratePerPlay;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-xs font-semibold text-gray-500 hover:text-emerald-600 mb-6 inline-block">
          Back to GRID
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Royalty splits</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            See who earns what from each track. Report to PRS/MCPS quarterly.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 dark:text-white">Your catalogue</h2>
            <span className="text-xs text-gray-500">{tracks.length} track{tracks.length === 1 ? "" : "s"}</span>
          </div>

          {tracks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 mb-4">No licensed tracks yet.</p>
              <Link href="/licensing" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg">
                Licence your first track
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {tracks.map((track) => {
                const plays = getPlayCount(track.id, track.plays);
                const revenue = plays * ratePerPlay;
                return (
                  <div key={track.id} className="border border-gray-200 dark:border-zinc-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-bold text-sm text-gray-900 dark:text-white">{track.title}</p>
                        <p className="text-xs text-gray-500">{track.isrc} · {track.genre}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        track.status === "licensed"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}>
                        {track.status === "licensed" ? "Licensed" : "Pending"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <p className="text-gray-500">Plays</p>
                        <p className="font-bold text-gray-900 dark:text-white">{plays.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Rate per play</p>
                        <p className="font-bold text-gray-900 dark:text-white">£{ratePerPlay.toFixed(4)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Revenue</p>
                        <p className="font-bold text-emerald-600">£{revenue.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tracks.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-800">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-zinc-400">Total plays</span>
                <span className="font-bold text-gray-900 dark:text-white">{totalPlays.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600 dark:text-zinc-400">Total revenue</span>
                <span className="font-bold text-emerald-600">£{totalRevenue.toFixed(2)}</span>
              </div>
              <button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2.5 rounded-lg transition-colors">
                Export CSV for PRS
              </button>
            </div>
          )}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <p className="text-xs text-blue-800 dark:text-blue-300">
            <strong>How splits work:</strong> Revenue is calculated at £{ratePerPlay.toFixed(4)} per play, split per your registered composition and master shares. Report quarterly to PRS for UK royalties.
          </p>
        </div>
      </div>
    </div>
  );
}