"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarClock, ChevronRight, Plus, Radio } from "lucide-react";
import { CoinIcon, LiveDot } from "@/components/live/icons";

// "Who's live right now" for the home page: a snapshot strip in the feed and a
// compact count + faces on the sidebar link. Both share one request.

type LiveCard = {
  id: string;
  title: string;
  category: string;
  host: string;
  avatar: string | null;
  snapshot: string | null;
  startedAt: string | null;
  scheduledFor: string | null;
  raisedCoins: number;
  promoted?: boolean;
};
type LiveNowData = { live: LiveCard[]; upcoming: LiveCard[] };

let cache: { at: number; data: LiveNowData } | null = null;
let inflight: Promise<LiveNowData> | null = null;
const listeners = new Set<(d: LiveNowData) => void>();

function load(force = false): Promise<LiveNowData> {
  if (!force && cache && Date.now() - cache.at < 20_000) return Promise.resolve(cache.data);
  if (inflight) return inflight;
  inflight = fetch("/api/live/now", { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : { live: [], upcoming: [] }))
    .catch(() => ({ live: [], upcoming: [] }))
    .then((d: LiveNowData) => {
      cache = { at: Date.now(), data: d };
      listeners.forEach((l) => l(d));
      return d;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

function useLiveNow() {
  const [data, setData] = useState<LiveNowData | null>(cache?.data ?? null);
  useEffect(() => {
    listeners.add(setData);
    load().then(setData);
    const t = setInterval(() => document.visibilityState === "visible" && load(true), 30_000);
    return () => {
      listeners.delete(setData);
      clearInterval(t);
    };
  }, []);
  return data;
}

const initialsOf = (n: string) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "G";

function Face({ name, avatar, className }: { name: string; avatar: string | null; className: string }) {
  if (avatar) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={avatar} alt="" className={`${className} object-cover`} />;
  }
  return <span className={`${className} grid place-items-center bg-emerald-700 text-white font-bold`}>{initialsOf(name)}</span>;
}

function since(iso: string | null) {
  if (!iso) return "";
  const m = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min`;
}

/** Snapshot with graceful fallback to the host's face on a brand gradient. */
function Snapshot({ card }: { card: LiveCard }) {
  const [broken, setBroken] = useState(false);
  return (
    <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-800 to-zinc-950">
      {card.snapshot && !broken ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={card.snapshot} alt="" loading="lazy" onError={() => setBroken(true)} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <Face name={card.host} avatar={card.avatar} className="w-16 h-16 rounded-full ring-4 ring-white/25 text-xl" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30" aria-hidden="true" />
      <span className="absolute top-2 left-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-600 text-white text-[11px] font-bold shadow">
        <LiveDot /> LIVE
      </span>
      {card.raisedCoins > 0 && (
        <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/55 backdrop-blur text-white text-[11px] font-bold">
          <CoinIcon className="w-3 h-3" /> {card.raisedCoins.toLocaleString("en-GB")}
        </span>
      )}
      {card.promoted && (
        <span className="absolute top-8 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur text-white text-[10px] font-bold">Promoted</span>
      )}
      <div className="absolute inset-x-0 bottom-0 p-2.5 text-white">
        <div className="flex items-center gap-1.5">
          <Face name={card.host} avatar={card.avatar} className="w-6 h-6 rounded-full ring-2 ring-red-500 text-[10px] flex-none" />
          <p className="text-xs font-bold truncate">{card.host}</p>
        </div>
        <p className="text-[11px] text-white/80 leading-snug line-clamp-2 mt-1">{card.title}</p>
      </div>
    </div>
  );
}

/** Feed strip: snapshots of who's live now, with a Go live tile first. */
export function LiveNowStrip() {
  const data = useLiveNow();
  if (!data) {
    return <div className="h-[220px] rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 animate-pulse" aria-label="Loading who's live" />;
  }
  const { live, upcoming } = data;

  return (
    <section aria-labelledby="live-now-title" className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 id="live-now-title" className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
          {live.length > 0 ? (
            <>
              <LiveDot className="text-red-600" /> Live now
              <span className="px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-xs font-bold">{live.length}</span>
            </>
          ) : (
            <>
              <Radio className="w-4 h-4 text-emerald-600" aria-hidden="true" /> GRID LIVE
            </>
          )}
        </h2>
        <Link href="/live" className="inline-flex items-center gap-0.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">
          See all <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>

      {live.length > 0 ? (
        <ul className="flex gap-3 overflow-x-auto snap-x pb-1 -mx-1 px-1 [scrollbar-width:thin]">
          <li className="snap-start flex-none w-[118px] sm:w-[132px]">
            <Link href="/live/new" className="h-full aspect-[4/5] sm:aspect-[3/4] rounded-xl border-2 border-dashed border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20 flex flex-col items-center justify-center text-center p-3 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors">
              <span className="w-11 h-11 rounded-full bg-emerald-600 text-white grid place-items-center shadow-sm" aria-hidden="true">
                <Plus className="w-5 h-5" strokeWidth={2.5} />
              </span>
              <span className="mt-2 text-sm font-bold text-emerald-800 dark:text-emerald-300">Go live</span>
              <span className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 leading-tight mt-0.5">Keep 70% of gifts</span>
            </Link>
          </li>
          {live.map((c) => (
            <li key={c.id} className="snap-start flex-none w-[118px] sm:w-[132px]">
              <Link href={`/live/${c.id}`} className="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" aria-label={`${c.host} is live: ${c.title}. ${c.category}, started ${since(c.startedAt)} ago`}>
                <Snapshot card={c} />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="font-bold text-lg leading-tight">Nobody&apos;s live right now. Be first.</p>
            <p className="text-sm text-emerald-50/90 mt-1">Stream a set, a session or a listening party. Fans send gifts and buy your merch, beats and tickets while you play. You keep 70% of every gift.</p>
          </div>
          <Link href="/live/new" className="flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white text-emerald-800 font-bold text-sm hover:bg-emerald-50 transition-colors shadow-sm">
            <Radio className="w-4 h-4" aria-hidden="true" /> Go live
          </Link>
        </div>
      )}

      {upcoming.length > 0 && (
        <ul className="mt-3 divide-y divide-gray-100 dark:divide-zinc-800 border-t border-gray-100 dark:border-zinc-800">
          {upcoming.slice(0, 3).map((c) => (
            <li key={c.id}>
              <Link href={`/live/${c.id}`} className="flex items-center gap-3 py-2.5 group">
                <Face name={c.host} avatar={c.avatar} className="w-9 h-9 rounded-full text-xs flex-none" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400">{c.title}</span>
                  <span className="block text-xs text-gray-500 truncate">{c.host} · {c.category}</span>
                </span>
                <span className="flex-none inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  <CalendarClock className="w-3.5 h-3.5" aria-hidden="true" />
                  {c.scheduledFor ? new Date(c.scheduledFor).toLocaleString("en-GB", { weekday: "short", hour: "2-digit", minute: "2-digit" }) : "Soon"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Sidebar link: GRID LIVE with a count and stacked faces of who's on air. */
export function LiveSidebarLink({ className }: { className: string }) {
  const data = useLiveNow();
  const live = data?.live ?? [];
  return (
    <Link href="/live" className={className}>
      <span className="w-5 h-5 grid place-items-center text-red-600" aria-hidden="true"><LiveDot /></span>
      <span className="group-hover:text-emerald-700 dark:group-hover:text-emerald-400 flex-1">GRID LIVE</span>
      {live.length > 0 && (
        <span className="flex items-center gap-1.5">
          <span className="flex -space-x-2" aria-hidden="true">
            {live.slice(0, 3).map((c) => (
              <Face key={c.id} name={c.host} avatar={c.avatar} className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-zinc-900 text-[9px]" />
            ))}
          </span>
          <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold leading-none">
            {live.length}<span className="sr-only"> live now</span>
          </span>
        </span>
      )}
    </Link>
  );
}
