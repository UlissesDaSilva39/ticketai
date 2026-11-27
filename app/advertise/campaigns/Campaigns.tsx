"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CircleCheck, Megaphone } from "lucide-react";

type Campaign = {
  id: string;
  plan: string;
  headline: string;
  link_url: string;
  amount_pence: number;
  status: "in_review" | "active" | "rejected" | "ended";
  review_note: string | null;
  days: number;
  starts_at: string | null;
  ends_at: string | null;
  impressions: number;
  clicks: number;
  created_at: string;
};

const STATUS: Record<string, { label: string; cls: string }> = {
  in_review: { label: "In review", cls: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
  active: { label: "Running", cls: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" },
  rejected: { label: "Not approved (refunded)", cls: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
  ended: { label: "Finished", cls: "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300" },
};

export default function Campaigns() {
  const router = useRouter();
  const sp = useSearchParams();
  const [rows, setRows] = useState<Campaign[] | null>(null);
  const [banner, setBanner] = useState("");
  // Time the list was loaded (used to show finished campaigns).
  const [now, setNow] = useState(0);

  useEffect(() => {
    (async () => {
      const sessionId = sp.get("session_id");
      if (sp.get("ad") === "success" && sessionId) {
        await fetch("/api/ads/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sessionId }) });
        setBanner("Payment received. Your ad is in review and usually goes live within 24 hours.");
        router.replace("/advertise/campaigns", { scroll: false });
      }
      const r = await fetch("/api/ads/mine", { cache: "no-store" });
      if (r.status === 401) return router.replace("/login?redirect=/advertise/campaigns");
      const d = await r.json().catch(() => ({ campaigns: [] }));
      setNow(Date.now());
      setRows(d.campaigns ?? []);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1.5"><Megaphone className="w-3.5 h-3.5" aria-hidden="true" /> GRID Ads</p>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My campaigns</h1>
          </div>
          <Link href="/advertise#plans" className="px-5 py-2.5 rounded-full font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors">New campaign</Link>
        </header>
        {banner && <p role="status" className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-200 px-4 py-3 text-sm font-semibold"><CircleCheck className="w-5 h-5 text-emerald-600 flex-none" aria-hidden="true" /> {banner}</p>}

        {rows === null ? (
          <div className="h-40 rounded-2xl bg-white dark:bg-zinc-900 animate-pulse" />
        ) : rows.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-10 text-center">
            <p className="font-semibold text-gray-900 dark:text-white">No campaigns yet.</p>
            <p className="text-sm text-gray-500 mt-1">Launch a sponsored ad from £25.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {rows.map((c) => {
              const status = c.status === "active" && now > 0 && c.ends_at && new Date(c.ends_at).getTime() < now ? "ended" : c.status;
              const ctr = c.impressions ? ((c.clicks / c.impressions) * 100).toFixed(1) : "0.0";
              return (
                <li key={c.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 dark:text-white">{c.headline}</p>
                      <p className="text-xs text-gray-500 truncate">{c.plan === "premium" ? "Premium" : "Basic"} · £{(c.amount_pence / 100).toFixed(2)} · {c.link_url}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS[status].cls}`}>{STATUS[status].label}</span>
                  </div>
                  {c.review_note && <p className="mt-2 text-sm text-red-700 dark:text-red-400">{c.review_note}</p>}
                  <dl className="grid grid-cols-3 gap-3 mt-4 text-center">
                    {[["Views", c.impressions.toLocaleString("en-GB")], ["Clicks", c.clicks.toLocaleString("en-GB")], ["Click rate", `${ctr}%`]].map(([k, v]) => (
                      <div key={k} className="rounded-xl bg-gray-50 dark:bg-zinc-800 py-3">
                        <dt className="text-xs text-gray-500">{k}</dt>
                        <dd className="text-lg font-bold text-gray-900 dark:text-white">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  {c.starts_at && c.ends_at && (
                    <p className="text-xs text-gray-500 mt-3">
                      {new Date(c.starts_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} to {new Date(c.ends_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
