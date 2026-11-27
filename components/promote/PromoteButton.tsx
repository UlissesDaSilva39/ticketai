"use client";

import { useState } from "react";
import { Check, Rocket, X } from "lucide-react";
import { PROMO_KINDS, PROMO_PLANS, type PromoKind, type PromoPlan } from "@/lib/promote/catalog";

const fmt = (p: number) => `£${(p / 100).toFixed(2)}`;

/**
 * "Promote" button + plan picker. Pays by Stripe Checkout and comes back to /boost,
 * which switches the boost on and confirms it.
 */
export default function PromoteButton({
  kind,
  refId,
  className,
  label = "Promote",
  promotedUntil,
}: {
  kind: PromoKind;
  refId: string;
  className?: string;
  label?: string;
  promotedUntil?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState<PromoPlan>("3d");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (promotedUntil && new Date(promotedUntil) > new Date()) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300">
        <Rocket className="w-3.5 h-3.5" aria-hidden="true" /> Promoted until {new Date(promotedUntil).toLocaleString("en-GB", { weekday: "short", hour: "2-digit", minute: "2-digit" })}
      </span>
    );
  }

  async function pay() {
    setBusy(true);
    setError("");
    const r = await fetch("/api/promote/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind, refId, plan, returnTo: "/boost" }),
    });
    const d = await r.json().catch(() => ({}));
    if (r.status === 401) return void (window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`);
    if (r.ok && d.url) return void (window.location.href = d.url);
    setError(d.error || "Couldn't start checkout.");
    setBusy(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-bold border border-emerald-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
        }
      >
        <Rocket className="w-4 h-4" aria-hidden="true" /> {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="promote-title" onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
          <div className="bg-white dark:bg-zinc-900 w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 max-h-[90vh] overflow-y-auto text-left">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-emerald-600 text-white grid place-items-center" aria-hidden="true">
                  <Rocket className="w-5 h-5" />
                </span>
                <div>
                  <h2 id="promote-title" className="text-lg font-bold text-gray-900 dark:text-white">Boost your {PROMO_KINDS[kind].label.toLowerCase()}</h2>
                  <p className="text-xs text-gray-500">{PROMO_KINDS[kind].where}</p>
                </div>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800">
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <fieldset className="mt-5 space-y-2">
              <legend className="sr-only">How long</legend>
              {PROMO_PLANS.map((p) => (
                <label
                  key={p.id}
                  className={`flex items-center justify-between gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-500 ${plan === p.id ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" : "border-gray-200 dark:border-zinc-700 hover:border-emerald-400"}`}
                >
                  <input type="radio" name="promo-plan" className="sr-only" checked={plan === p.id} onChange={() => setPlan(p.id)} />
                  <span className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded-full border-2 grid place-items-center ${plan === p.id ? "border-emerald-600 bg-emerald-600 text-white" : "border-gray-300 dark:border-zinc-600"}`} aria-hidden="true">
                      {plan === p.id && <Check className="w-3 h-3" strokeWidth={3} />}
                    </span>
                    <span>
                      <span className="block font-bold text-gray-900 dark:text-white">{p.label}</span>
                      {p.tag && <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{p.tag}</span>}
                    </span>
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">{fmt(p.pence)}</span>
                </label>
              ))}
            </fieldset>

            <ul className="mt-4 space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
              {["Seen by members across GRID, not just your followers", "A clear Promoted label (no hidden ads)", "Starts as soon as you pay"].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-none mt-0.5" aria-hidden="true" /> {t}
                </li>
              ))}
            </ul>

            {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 p-3 text-sm">{error}</p>}

            <button type="button" onClick={pay} disabled={busy} className="mt-5 w-full py-3.5 rounded-full font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 transition-colors inline-flex items-center justify-center gap-2">
              <Rocket className="w-4 h-4" aria-hidden="true" />
              {busy ? "Opening secure checkout…" : `Boost for ${fmt(PROMO_PLANS.find((p) => p.id === plan)!.pence)}`}
            </button>
            <p className="text-[11px] text-gray-500 text-center mt-2">Secure payment by Stripe. One-off payment, no subscription.</p>
          </div>
        </div>
      )}
    </>
  );
}
