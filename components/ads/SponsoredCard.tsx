"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

type Ad = { id: string; headline: string; body: string | null; imageUrl: string | null; host: string };

/** One sponsored card (self-serve ads). Renders nothing when no campaign is running. */
export default function SponsoredCard() {
  const [ad, setAd] = useState<Ad | null>(null);
  useEffect(() => {
    fetch("/api/ads/serve", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { ad: null }))
      .then((d) => setAd(d.ad ?? null))
      .catch(() => setAd(null));
  }, []);
  if (!ad) return null;

  return (
    <aside aria-label="Sponsored" className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">Sponsored</p>
        <Link href="/advertise" className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">Advertise on GRID</Link>
      </div>
      {/* Click goes through GRID so the advertiser sees click counts. */}
      <a href={`/api/ads/click/${ad.id}`} target="_blank" rel="noopener noreferrer sponsored" className="block p-4 group">
        {ad.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ad.imageUrl} alt="" className="w-full aspect-[16/9] object-cover rounded-lg mb-3 bg-gray-100 dark:bg-zinc-800" />
        )}
        <p className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400">{ad.headline}</p>
        {ad.body && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{ad.body}</p>}
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 dark:text-emerald-400">
          {ad.host || "Learn more"} <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </p>
      </a>
    </aside>
  );
}
