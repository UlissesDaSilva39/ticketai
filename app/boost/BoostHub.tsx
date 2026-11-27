"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CircleCheck, Megaphone, Radio, Rocket, ShoppingBag, StickyNote, UserRound } from "lucide-react";
import PromoteButton from "@/components/promote/PromoteButton";
import { PROMO_KINDS, PROMO_PLANS, type PromoKind } from "@/lib/promote/catalog";

type Item = { kind: PromoKind; id: string; title: string; sub: string; promotedUntil: string | null };

const ICON: Record<PromoKind, typeof Rocket> = { profile: UserRound, live: Radio, listing: ShoppingBag, post: StickyNote };
const card = "bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800";

export default function BoostHub() {
  const router = useRouter();
  const sp = useSearchParams();
  const [items, setItems] = useState<Item[] | null>(null);
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null);

  async function load() {
    const r = await fetch("/api/promote/mine", { cache: "no-store" });
    if (r.status === 401) return router.replace("/login?redirect=/boost");
    const d = await r.json().catch(() => ({ items: [] }));
    setItems(d.items ?? []);
  }

  useEffect(() => {
    const status = sp.get("promoted");
    const sessionId = sp.get("session_id");
    (async () => {
      if (status === "success" && sessionId) {
        const r = await fetch("/api/promote/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sessionId }) });
        const d = await r.json().catch(() => ({}));
        setBanner(
          r.ok
            ? { ok: true, text: `Your ${PROMO_KINDS[d.kind as PromoKind]?.label.toLowerCase() ?? "item"} is now promoted until ${new Date(d.endsAt).toLocaleString("en-GB", { weekday: "long", hour: "2-digit", minute: "2-digit" })}.` }
            : { ok: true, text: "Payment received. Your boost will start in a moment." }
        );
        router.replace("/boost", { scroll: false });
      } else if (status === "cancelled") {
        setBanner({ ok: false, text: "Payment cancelled. You haven't been charged." });
        router.replace("/boost", { scroll: false });
      }
      load();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 sm:py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <header>
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1.5">
            <Rocket className="w-3.5 h-3.5" aria-hidden="true" /> GRID Boost
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-1">Get seen by more of the music industry</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Push a post, a beat, a live or your profile to the top of GRID. From {`£${(PROMO_PLANS[0].pence / 100).toFixed(2)}`} for 24 hours. No subscription.
          </p>
        </header>

        {banner && (
          <p role="status" className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${banner.ok ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-200" : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200"}`}>
            {banner.ok && <CircleCheck className="w-5 h-5 flex-none text-emerald-600" aria-hidden="true" />} {banner.text}
          </p>
        )}

        <div className="grid gap-3 sm:grid-cols-3">
          {PROMO_PLANS.map((p) => (
            <div key={p.id} className={`${card} p-4 text-center ${p.tag === "Most popular" ? "border-emerald-500 ring-1 ring-emerald-500" : ""}`}>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{p.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">£{(p.pence / 100).toFixed(2)}</p>
              {p.tag && <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{p.tag}</p>}
            </div>
          ))}
        </div>

        <section className={`${card} overflow-hidden`}>
          <h2 className="px-5 pt-5 pb-3 font-bold text-gray-900 dark:text-white">What do you want to promote?</h2>
          {items === null ? (
            <div className="p-5 space-y-3" aria-label="Loading">
              {[0, 1, 2].map((i) => <div key={i} className="h-14 rounded-xl bg-gray-100 dark:bg-zinc-800 animate-pulse" />)}
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-zinc-800">
              {items.map((it) => {
                const Icon = ICON[it.kind];
                return (
                  <li key={`${it.kind}:${it.id}`} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                    <span className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 grid place-items-center flex-none" aria-hidden="true">
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-gray-900 dark:text-white truncate">{it.title}</span>
                      <span className="block text-xs text-gray-500">{it.sub}</span>
                    </span>
                    <PromoteButton kind={it.kind} refId={it.id} promotedUntil={it.promotedUntil} />
                  </li>
                );
              })}
            </ul>
          )}
          {items && items.length <= 1 && (
            <p className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-zinc-800">
              Post an update on <Link href="/home" className="font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">Home</Link>, list a beat in the{" "}
              <Link href="/marketplace" className="font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">Marketplace</Link> or{" "}
              <Link href="/live/new" className="font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">go live</Link> to have more to promote.
            </p>
          )}
        </section>

        <Link href="/advertise" className={`${card} p-5 flex items-center gap-4 hover:border-emerald-400 transition-colors`}>
          <span className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-zinc-800 text-white grid place-items-center flex-none" aria-hidden="true">
            <Megaphone className="w-5 h-5" />
          </span>
          <span className="flex-1">
            <span className="block font-bold text-gray-900 dark:text-white">Promoting a brand, venue or festival?</span>
            <span className="block text-sm text-gray-600 dark:text-gray-400">Run a sponsored ad across GRID from £25.</span>
          </span>
          <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Advertise →</span>
        </Link>
      </div>
    </div>
  );
}
