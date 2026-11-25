"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { LICENCE_INFO, LICENCE_TYPES, formatGbp, type LicenceType, type ListingPrices } from "@/lib/licensing/agreement";

type Listing = {
  id: string;
  trackTitle: string;
  artistName: string;
  genre: string | null;
  description: string | null;
  coverUrl: string | null;
  previewUrl: string | null;
  prices: ListingPrices;
  dealsCount: number;
  licensor: string;
};

const offered = (p: ListingPrices) => LICENCE_TYPES.filter((t) => p[t] != null);
const fromPrice = (p: ListingPrices, only?: LicenceType | null) =>
  only && p[only] != null ? (p[only] as number) : Math.min(...offered(p).map((t) => p[t] as number));

const chip = (on: boolean) =>
  `px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
    on
      ? "bg-emerald-600 text-white"
      : "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-300 hover:border-emerald-400"
  }`;

/** Search + filter + grid of tracks available to licence. */
export default function TrackBrowser({ onSell }: { onSell?: () => void }) {
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [q, setQ] = useState("");
  const [type, setType] = useState<LicenceType | null>(null);
  const [genre, setGenre] = useState<string | null>(null);
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

  const genres = useMemo(
    () => [...new Set((listings ?? []).map((l) => l.genre).filter((g): g is string => !!g))].sort().slice(0, 12),
    [listings]
  );
  const shown = (listings ?? []).filter((l) => (!type || l.prices[type] != null) && (!genre || l.genre === genre));

  return (
    <div>
      <label htmlFor="licence-search" className="sr-only">
        Search tracks
      </label>
      <input
        id="licence-search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by track, artist, genre or mood"
        className="w-full mb-3 px-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />

      <div className="flex gap-2 overflow-x-auto pb-1 mb-2" role="group" aria-label="Filter by licence type">
        <button type="button" onClick={() => setType(null)} className={chip(type === null)} aria-pressed={type === null}>
          All licences
        </button>
        {LICENCE_TYPES.map((t) => (
          <button key={t} type="button" onClick={() => setType(type === t ? null : t)} className={chip(type === t)} aria-pressed={type === t}>
            {LICENCE_INFO[t].name.replace(" Licence", "")}
          </button>
        ))}
      </div>
      {genres.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 mb-4" role="group" aria-label="Filter by genre">
          {genres.map((g) => (
            <button key={g} type="button" onClick={() => setGenre(genre === g ? null : g)} className={chip(genre === g)} aria-pressed={genre === g}>
              {g}
            </button>
          ))}
        </div>
      )}

      {listings === null ? (
        <p className="text-gray-500 py-12 text-center">Loading tracks…</p>
      ) : shown.length === 0 ? (
        <div className="text-center py-14 px-4 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 mt-4">
          <p className="font-semibold text-gray-900 dark:text-white">
            {setupPending ? "Licensing is being set up." : q || type || genre ? "No tracks match your filters." : "No tracks listed yet."}
          </p>
          <p className="text-sm text-gray-500 mt-1">Own your masters? List a track and be the first creators find.</p>
          {onSell && (
            <button type="button" onClick={onSell} className="mt-4 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700">
              List your track
            </button>
          )}
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          {shown.map((l) => (
            <li key={l.id}>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-4 hover:border-emerald-400 transition-colors h-full flex flex-col">
                <Link href={`/licensing/deal/${l.id}${type ? `?licence=${type}` : ""}`} className="flex gap-3 group">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-800 flex-none overflow-hidden flex items-center justify-center text-white text-2xl">
                    {l.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={l.coverUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span aria-hidden="true">♫</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 dark:text-white truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400">{l.trackTitle}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{l.artistName}</p>
                    {l.genre && <p className="text-xs text-gray-500">{l.genre}</p>}
                  </div>
                </Link>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {offered(l.prices).map((t) => (
                    <span key={t} className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                      {t}
                    </span>
                  ))}
                  {l.dealsCount > 0 && (
                    <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300">
                      {l.dealsCount} licensed
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 mt-auto pt-4">
                  <span className="text-sm text-gray-900 dark:text-white">
                    From <strong>{formatGbp(fromPrice(l.prices, type))}</strong>
                  </span>
                  <div className="flex gap-2">
                    {l.previewUrl && (
                      <a href={l.previewUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-200 hover:border-emerald-400" aria-label={`Preview ${l.trackTitle}`}>
                        ▶ Preview
                      </a>
                    )}
                    <Link href={`/licensing/deal/${l.id}${type ? `?licence=${type}` : ""}`} className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700">
                      Get licence
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
