"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useProStatus, PRO_LIMITS, goToProCheckout, openBillingPortal } from "@/lib/hooks/useProStatus";
import { refreshMe } from "@/lib/hooks/useMe";

const CheckIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const CrownIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
  </svg>
);

const PRICE = "£5";

// Only benefits that work today; the rest are clearly marked as coming soon.
const FREE_FEATURES = [
  "Full profile + EPK",
  `${PRO_LIMITS.freeApplicationsPerWeek} gig applications per week`,
  "Your top 3 matches",
  "Post, reply and follow",
  "Stories and invites",
];
const PRO_FEATURES = [
  "Unlimited gig applications",
  "All your matches unlocked",
  "Pro badge on your profile and posts",
  "No upgrade banners",
];
const PRO_COMING_SOON = ["Post analytics (views, likes, shares)", "See who viewed your profile"];

const FAQ = [
  {
    q: "How does the free trial work?",
    a: `Your first ${PRO_LIMITS.trialDays} days are free. You add a card at checkout, but nothing is charged until the trial ends. Cancel before then and you pay nothing.`,
  },
  { q: "How much is Pro after the trial?", a: `${PRICE} per month, billed monthly by Stripe. Prices include VAT where applicable.` },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Use “Manage subscription” on this page. You keep Pro until the end of the period you've paid for.",
  },
  {
    q: "What happens to my applications if I cancel?",
    a: `Everything you've sent stays in your history. You go back to the free limit of ${PRO_LIMITS.freeApplicationsPerWeek} applications per week.`,
  },
  {
    q: "Can I get Pro for free?",
    a: "Yes. Invite 3 friends with your personal link (on your home page). When the third one joins, you get a free month of Pro.",
  },
];

function fmtDate(iso: string | null | undefined) {
  return iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";
}

function ProPageInner() {
  const { isPro, hydrated, pro } = useProStatus();
  const params = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  // Back from Stripe Checkout: confirm the subscription so Pro switches on at once.
  useEffect(() => {
    const status = params.get("checkout");
    const sessionId = params.get("session_id");
    if (status === "cancelled") setBanner("Checkout cancelled. You haven't been charged.");
    if (status === "success" && sessionId) {
      setBanner("Confirming your subscription…");
      fetch("/api/billing/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sessionId }),
      })
        .then((r) => r.json())
        .then((d) => {
          refreshMe();
          setBanner(d?.pro?.active ? "Welcome to GRID Pro! 🎉" : "Payment received. Pro will switch on in a moment — refresh if it doesn't.");
        })
        .catch(() => setBanner("Payment received. Refresh the page in a moment to see Pro."))
        .finally(() => window.history.replaceState(null, "", "/pro"));
    }
  }, [params]);

  async function start() {
    setBusy(true);
    setError(null);
    const err = await goToProCheckout();
    if (err) {
      setError(err);
      setBusy(false);
    }
  }

  async function manage() {
    setBusy(true);
    setError(null);
    const err = await openBillingPortal();
    if (err) {
      setError(err);
      setBusy(false);
    }
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    );
  }

  const trialCopy = pro?.hadSubscription ? `${PRICE} / month` : `Try free for ${PRO_LIMITS.trialDays} days`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold mb-4">
            <CrownIcon className="w-4 h-4" />
            GRID Pro
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Apply to more gigs. See every match.</h1>
          <p className="text-base text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto">
            {PRICE} a month, with your first {PRO_LIMITS.trialDays} days free. Cancel anytime.
          </p>

          {banner && (
            <p role="status" className="mt-6 inline-block rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 text-sm font-semibold text-emerald-800 dark:text-emerald-300">
              {banner}
            </p>
          )}

          {isPro && pro && (
            <div className="mt-6 mx-auto max-w-md rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-white dark:bg-zinc-900 p-5 text-left">
              <p className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                <CrownIcon className="w-5 h-5 text-amber-500" /> You have GRID Pro
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-zinc-400">
                {pro.source === "grant"
                  ? `Free Pro from your invites, until ${fmtDate(pro.until)}.`
                  : pro.trialing
                    ? `Free trial until ${fmtDate(pro.until)}. ${pro.cancelAtPeriodEnd ? "It won't renew." : `Then ${PRICE}/month.`}`
                    : pro.cancelAtPeriodEnd
                      ? `Cancelled. Pro stays on until ${fmtDate(pro.until)}.`
                      : pro.status === "past_due"
                        ? "Your last payment failed. Please update your card to keep Pro."
                        : `Renews on ${fmtDate(pro.until)}.`}
              </p>
              {pro.hasSubscription && (
                <button
                  type="button"
                  onClick={manage}
                  disabled={busy}
                  className="mt-3 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:underline disabled:opacity-50"
                >
                  Manage subscription →
                </button>
              )}
            </div>
          )}
          {error && (
            <p role="alert" className="mt-4 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-3xl mx-auto">
          <div className="relative bg-white dark:bg-zinc-900 rounded-2xl border-2 border-gray-200 dark:border-zinc-800 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Free</h2>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">Everything you need to get started</p>
            <div className="my-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">£0</span>
              <span className="text-sm text-gray-500 ml-1">/ forever</span>
            </div>
            <ul className="space-y-2 mb-6">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700 dark:text-zinc-300">
                  <CheckIcon className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button disabled className="w-full py-3 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-500 text-sm font-bold cursor-not-allowed">
              {isPro ? "Free plan" : "Current plan"}
            </button>
          </div>

          <div className="relative bg-white dark:bg-zinc-900 rounded-2xl border-2 border-amber-500 shadow-xl p-6">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">
              {pro?.hadSubscription ? "PRO" : `${PRO_LIMITS.trialDays} DAYS FREE`}
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Pro</h2>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">For active producers, vocalists and DJs</p>
            <div className="my-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">{PRICE}</span>
              <span className="text-sm text-gray-500 ml-1">/ month</span>
            </div>
            <ul className="space-y-2 mb-3">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700 dark:text-zinc-300">
                  <CheckIcon className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <ul className="space-y-2 mb-6">
              {PRO_COMING_SOON.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-500 dark:text-zinc-500">
                  <span className="mt-0.5 rounded bg-gray-100 dark:bg-zinc-800 px-1.5 text-[10px] font-bold uppercase">Soon</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            {isPro ? (
              <button disabled className="w-full py-3 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-500 text-sm font-bold cursor-not-allowed">
                Active
              </button>
            ) : (
              <button
                type="button"
                onClick={start}
                disabled={busy}
                className="w-full py-3 rounded-lg text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white transition-colors disabled:opacity-60"
              >
                {busy ? "Opening secure checkout…" : `${trialCopy} →`}
              </button>
            )}
            <p className="text-[11px] text-gray-500 text-center mt-2">
              {pro?.hadSubscription ? "Billed monthly · Cancel anytime" : `Card required · ${PRICE}/month after the trial · Cancel anytime`}
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">Questions, answered</h2>
          <div className="space-y-3">
            {FAQ.map((faq) => (
              <details key={faq.q} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer text-sm">{faq.q}</summary>
                <p className="text-sm text-gray-600 dark:text-zinc-400 mt-3">{faq.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-gray-500">
            Payments are processed securely by Stripe. By subscribing you agree to our{" "}
            <Link href="/terms" className="underline">Terms</Link> and <Link href="/refund-policy" className="underline">Refund policy</Link>.
          </p>
        </div>

        <div className="text-center mt-12">
          <Link href="/home" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-lg transition-colors">
            Back to GRID →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProPage() {
  return (
    <Suspense fallback={null}>
      <ProPageInner />
    </Suspense>
  );
}
