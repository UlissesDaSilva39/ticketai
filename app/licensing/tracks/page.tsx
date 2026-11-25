"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LICENCE_TYPES, formatGbp, type ListingPrices } from "@/lib/licensing/agreement";

type Listing = {
  id: string;
  trackTitle: string;
  artistName: string;
  genre: string | null;
  coverUrl: string | null;
  prices: ListingPrices;
  dealsCount: number;
  licensor: string;
};

const fromPrice = (p: ListingPrices) => Math.min(...LICENCE_TYPES.map((t) => p[t]).filter((v): v is number => v != null));

export default function LicenceTracksPage() {
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [q, setQ] = useState("");
  const [setupPending, setSetupPending] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      fetch(`/api/licensing/listings${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((d) => {
          setListings(d.listings ?? []);
          setSetupPending(!!d.setupPending);
        })
        .catch(() => undefined);
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 sm:py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">GRID Licensing</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Licence music</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 max-w-xl">
              Cleared tracks from independent artists for your videos, ads, films and games. Pay once, get a signed licence instantly.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/licences" className="px-4 py-2.5 rounded-xl font-semibold text-sm border border-gray-300 dark:border-zinc-700 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-zinc-900">
              My licences
            </Link>
            <Link href="/licensing/new" className="px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700">
              + List your track
            </Link>
          </div>
        </div>

        <label htmlFor="licence-search" className="sr-only">
          Search tracks
        </label>
        <input
          id="licence-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by track, artist or genre"
          className="w-full mb-6 px-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        {listings === null ? (
          <p className="text-gray-500 py-12 text-center">Loading tracks…</p>
        ) : listings.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800">
            <p className="font-semibold text-gray-900 dark:text-white">{setupPending ? "Licensing is being set up." : q ? "No tracks match your search." : "No tracks listed yet."}</p>
            <p className="text-sm text-gray-500 mt-1">Own your masters? Be the first to list a track.</p>
            <Link href="/licensing/new" className="inline-block mt-4 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700">
              List your track
            </Link>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/licensing/deal/${l.id}`}
                  className="block bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-4 hover:border-emerald-400 transition-colors h-full"
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-800 flex-none overflow-hidden flex items-center justify-center text-white text-2xl">
                      {l.coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={l.coverUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span aria-hidden="true">♫</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 dark:text-white truncate">{l.trackTitle}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{l.artistName}</p>
                      {l.genre && <p className="text-xs text-gray-500">{l.genre}</p>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-900 dark:text-white">
                      From <strong>{formatGbp(fromPrice(l.prices))}</strong>
                    </span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Get licence →</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
