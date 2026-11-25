"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LICENCE_INFO, formatGbp, isLicenceType } from "@/lib/licensing/agreement";

type Deal = {
  id: string;
  trackTitle: string;
  artistName: string;
  licenceType: string;
  projectTitle: string;
  amountPence: number;
  totalPence: number;
  status: string;
  createdAt: string;
};
type MyListing = { id: string; trackTitle: string; artistName: string; status: string; dealsCount: number };
type Data = { bought: Deal[]; sold: Deal[]; listings: MyListing[]; earnedPence: number };

const card = "bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 sm:p-6";

function DealList({ rows, mine, empty }: { rows: Deal[]; mine: boolean; empty: React.ReactNode }) {
  if (!rows.length) return <div className="text-sm text-gray-500 py-4">{empty}</div>;
  return (
    <ul className="divide-y divide-gray-200 dark:divide-zinc-800">
      {rows.map((d) => (
        <li key={d.id}>
          <Link href={`/licences/${d.id}`} className="flex items-center justify-between gap-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 -mx-2 px-2 rounded-lg">
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white truncate">
                {d.trackTitle} <span className="font-normal text-gray-500">· {d.artistName}</span>
              </p>
              <p className="text-xs text-gray-500 truncate">
                {isLicenceType(d.licenceType) ? LICENCE_INFO[d.licenceType].name : "Licence"} · {d.projectTitle} ·{" "}
                {new Date(d.createdAt).toLocaleDateString("en-GB")}
              </p>
            </div>
            <div className="text-right flex-none">
              <p className="font-semibold text-gray-900 dark:text-white">{formatGbp(mine ? d.totalPence : d.amountPence)}</p>
              <p className={`text-xs ${d.status === "active" ? "text-emerald-600" : "text-gray-500"}`}>
                {d.status === "pending" ? "awaiting payment" : d.status}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** "My licences" tab: licences bought, licences issued, and my listed tracks. */
export default function MyLicences({ signedIn, onBrowse, onSell }: { signedIn: boolean | null; onBrowse: () => void; onSell: () => void }) {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    if (!signedIn) return;
    fetch("/api/licensing/mine")
      .then((r) => r.json())
      .then((d) => setData({ bought: d.bought ?? [], sold: d.sold ?? [], listings: d.listings ?? [], earnedPence: d.earnedPence ?? 0 }))
      .catch(() => setData({ bought: [], sold: [], listings: [], earnedPence: 0 }));
  }, [signedIn]);

  if (signedIn === false) {
    return (
      <div className={`${card} text-center`}>
        <p className="font-semibold text-gray-900 dark:text-white">Log in to see your licences</p>
        <p className="text-sm text-gray-500 mt-1">Your signed agreements, downloads and earnings live here.</p>
        <Link
          href={`/login?redirect=${encodeURIComponent("/licensing?tab=mine")}`}
          className="inline-block mt-4 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700"
        >
          Log in
        </Link>
      </div>
    );
  }
  if (!data) return <p className="text-gray-500 py-12 text-center">Loading your licences…</p>;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 grid-cols-3">
        {[
          ["Licences bought", String(data.bought.filter((d) => d.status === "active").length)],
          ["Licences issued", String(data.sold.filter((d) => d.status === "active").length)],
          ["Earned", formatGbp(data.earnedPence)],
        ].map(([k, v]) => (
          <div key={k} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-4">
            <p className="text-xs text-gray-500">{k}</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{v}</p>
          </div>
        ))}
      </div>

      <section className={card}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Music I licensed</h3>
        <DealList
          rows={data.bought}
          mine
          empty={
            <>
              You haven&apos;t licensed any music yet.{" "}
              <button type="button" onClick={onBrowse} className="font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">
                Find a track →
              </button>
            </>
          }
        />
      </section>

      <section className={card}>
        <div className="flex items-center justify-between gap-3 mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">My tracks for licensing</h3>
          <button type="button" onClick={onSell} className="text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:underline">
            + List a track
          </button>
        </div>
        {data.listings.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">You haven&apos;t listed any tracks yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-zinc-800">
            {data.listings.map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">{l.trackTitle}</p>
                  <p className="text-xs text-gray-500">
                    {l.status === "active" ? "Live" : "Paused"} · {l.dealsCount} licence{l.dealsCount === 1 ? "" : "s"} issued
                  </p>
                </div>
                <Link href={`/licensing/deal/${l.id}`} className="flex-none px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-200 hover:border-emerald-400">
                  View &amp; share
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={card}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Licences I issued</h3>
        <DealList rows={data.sold} mine={false} empty="No one has licensed your music yet. Share your track links to get your first deal." />
        <p className="text-xs text-gray-500 mt-3">
          Earnings go to your <Link href="/seller" className="underline">seller balance</Link> and can be withdrawn after the 7-day hold.
        </p>
      </section>
    </div>
  );
}
