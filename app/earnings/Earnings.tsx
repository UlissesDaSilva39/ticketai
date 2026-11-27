"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Banknote, CircleCheck, Crown, Gift, HandCoins, Headphones, Landmark, ShieldCheck, ShoppingBag, Stamp, Wallet } from "lucide-react";

type Source = "marketplace" | "licensing" | "live" | "reviews" | "tips" | "backstage";
type Data = {
  balance: { totalPence: number; pendingPence: number; availablePence: number; nextClearAt: string | null; thisMonthPence: number; lastMonthPence: number; bySource: Record<Source, number> };
  payouts: { id: string; amount_pence: number; status: string; created_at: string; paid_at: string | null }[];
  recent: { id: string; amount_pence: number; paid_at: string | null; source?: Source }[];
  account: { connected: boolean; payoutsEnabled: boolean; detailsSubmitted: boolean };
  minPayoutPence: number;
  holdDays: number;
};

const gbp = (p: number) => `£${(p / 100).toFixed(2)}`;
const card = "bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800";
const SOURCES: { id: Source; label: string; Icon: typeof Wallet; href: string; cta: string }[] = [
  { id: "marketplace", label: "Marketplace", Icon: ShoppingBag, href: "/marketplace", cta: "Sell beats or merch" },
  { id: "licensing", label: "Licensing", Icon: Stamp, href: "/licensing?tab=sell", cta: "License a track" },
  { id: "live", label: "Live gifts", Icon: Gift, href: "/live/new", cta: "Go live" },
  { id: "backstage", label: "Backstage", Icon: Crown, href: "/backstage", cta: "Start Backstage" },
  { id: "tips", label: "Tips", Icon: HandCoins, href: "/home", cta: "Post to get tips" },
  { id: "reviews", label: "Paid reviews", Icon: Headphones, href: "/submit?tab=review", cta: "Get paid to review" },
];

export default function Earnings() {
  const router = useRouter();
  const sp = useSearchParams();
  const [data, setData] = useState<Data | null>(null);
  const [busy, setBusy] = useState("");
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    const r = await fetch("/api/earnings", { cache: "no-store" });
    if (r.status === 401) return router.replace("/login?redirect=/earnings");
    setData(await r.json());
  }, [router]);

  useEffect(() => {
    (async () => {
      const c = sp.get("connect");
      await load();
      if (c) {
        setNote(c === "return" ? { ok: true, text: "Thanks! If Stripe has everything it needs, payouts now go straight to your bank." } : { ok: false, text: "The bank set-up link expired. Press Connect bank to carry on." });
        router.replace("/earnings", { scroll: false });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function connect() {
    setBusy("connect");
    setNote(null);
    const r = await fetch("/api/earnings/connect", { method: "POST" });
    const d = await r.json().catch(() => ({}));
    if (r.ok && d.url) return void (window.location.href = d.url);
    setBusy("");
    setNote({ ok: false, text: d.error || "Couldn't open the bank set-up." });
  }

  async function withdraw() {
    setBusy("withdraw");
    setNote(null);
    const r = await fetch("/api/marketplace/payouts", { method: "POST", credentials: "include" });
    const d = await r.json().catch(() => ({}));
    setBusy("");
    if (!r.ok) return setNote({ ok: false, text: d.error || "Couldn't request the withdrawal." });
    setNote({ ok: true, text: d.instant ? `${gbp(d.payout.amount_pence)} is on its way to your bank.` : `Withdrawal of ${gbp(d.payout.amount_pence)} requested. We'll pay it within 3 working days.` });
    load();
  }

  if (!data) return <div className="min-h-screen bg-gray-50 dark:bg-zinc-950" aria-busy="true" />;
  const b = data.balance;
  const inProgress = data.payouts.some((p) => p.status === "requested");
  const canWithdraw = b.availablePence >= data.minPayoutPence && !inProgress;
  const max = Math.max(1, ...Object.values(b.bySource));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 sm:py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <header>
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" aria-hidden="true" /> Earnings</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-1">Everything you earn on GRID, in one place</h1>
        </header>
        {note && (
          <p role={note.ok ? "status" : "alert"} className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${note.ok ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-200" : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300"}`}>
            {note.ok && <CircleCheck className="w-5 h-5 text-emerald-600 flex-none" aria-hidden="true" />} {note.text}
          </p>
        )}

        <section className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-2xl p-6 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
            <p className="text-sm text-emerald-50/90">Available to withdraw</p>
            <p className="text-5xl font-bold mt-1">{gbp(b.availablePence)}</p>
            <p className="text-sm text-emerald-50/90 mt-2">
              {b.pendingPence > 0 ? `${gbp(b.pendingPence)} more clears ${b.nextClearAt ? `on ${new Date(b.nextClearAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}` : "soon"} (${data.holdDays}-day safety hold).` : "Nothing waiting to clear."}
            </p>
            <button type="button" onClick={withdraw} disabled={!canWithdraw || !!busy} className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold bg-white text-emerald-800 hover:bg-emerald-50 disabled:opacity-60 transition-colors">
              <Banknote className="w-5 h-5" aria-hidden="true" /> {busy === "withdraw" ? "Requesting…" : inProgress ? "Withdrawal in progress" : "Get paid"}
            </button>
            {!canWithdraw && !inProgress && <p className="text-xs text-emerald-50/80 mt-2">Minimum withdrawal {gbp(data.minPayoutPence)}.</p>}
          </div>
          <div className={`${card} p-6`}>
            <p className="font-bold text-gray-900 dark:text-white inline-flex items-center gap-2"><Landmark className="w-5 h-5 text-emerald-600" aria-hidden="true" /> Your bank</p>
            {data.account.payoutsEnabled ? (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 flex items-start gap-2"><ShieldCheck className="w-4 h-4 text-emerald-600 flex-none mt-0.5" aria-hidden="true" /> Connected with Stripe. Withdrawals are paid straight to your bank, usually in 2 working days.</p>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Connect your bank once with Stripe (secure, takes about 3 minutes) and withdrawals are paid automatically. Without it, we pay you by hand within 3 working days.</p>
            )}
            <button type="button" onClick={connect} disabled={!!busy} className="mt-4 px-5 py-2.5 rounded-full text-sm font-bold border border-emerald-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 disabled:opacity-60 transition-colors">
              {busy === "connect" ? "Opening Stripe…" : data.account.detailsSubmitted ? "Open Stripe dashboard" : data.account.connected ? "Finish bank set-up" : "Connect bank"}
            </button>
            <dl className="grid grid-cols-2 gap-3 mt-5">
              <div className="rounded-xl bg-gray-50 dark:bg-zinc-800 p-3"><dt className="text-xs text-gray-500">This month</dt><dd className="font-bold text-gray-900 dark:text-white">{gbp(b.thisMonthPence)}</dd></div>
              <div className="rounded-xl bg-gray-50 dark:bg-zinc-800 p-3"><dt className="text-xs text-gray-500">Last month</dt><dd className="font-bold text-gray-900 dark:text-white">{gbp(b.lastMonthPence)}</dd></div>
            </dl>
          </div>
        </section>

        <section className={`${card} p-5 sm:p-6`}>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Where your money comes from</h2>
          <p className="text-sm text-gray-500">Lifetime total {gbp(b.totalPence)}. Every stream you haven&apos;t switched on yet is one click away.</p>
          <ul className="mt-4 space-y-3">
            {SOURCES.map(({ id, label, Icon, href, cta }) => {
              const v = b.bySource?.[id] ?? 0;
              return (
                <li key={id} className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 grid place-items-center flex-none" aria-hidden="true"><Icon className="w-4 h-4" /></span>
                  <span className="w-28 sm:w-32 text-sm font-semibold text-gray-800 dark:text-gray-200 flex-none">{label}</span>
                  {v > 0 ? (
                    <>
                      <span className="flex-1 h-2.5 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden"><span className="block h-full bg-emerald-500 rounded-full" style={{ width: `${Math.max(4, (v / max) * 100)}%` }} /></span>
                      <span className="w-20 text-right text-sm font-bold text-gray-900 dark:text-white flex-none">{gbp(v)}</span>
                    </>
                  ) : (
                    <Link href={href} className="flex-1 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">{cta} →</Link>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {data.payouts.length > 0 && (
          <section className={`${card} p-5 sm:p-6`}>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Withdrawals</h2>
            <ul className="mt-3 divide-y divide-gray-100 dark:divide-zinc-800">
              {data.payouts.map((p) => (
                <li key={p.id} className="py-3 flex items-center justify-between gap-3 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{new Date(p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                  <span className="font-bold text-gray-900 dark:text-white">{gbp(p.amount_pence)}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${p.status === "paid" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" : p.status === "rejected" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"}`}>
                    {p.status === "requested" ? "In progress" : p.status === "paid" ? "Paid" : "Declined"}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
