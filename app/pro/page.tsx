"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useProStatus, PRO_LIMITS, goToProCheckout, openBillingPortal, changePlan } from "@/lib/hooks/useProStatus";
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

type PlanId = "free" | "pro" | "premium";

// Every listed benefit works today (see lib/pro.ts, lib/chat-limits.ts, boosts).
const TIERS: {
  id: PlanId;
  name: string;
  price: string;
  tagline: string;
  features: string[];
  soon?: string[];
  accent: string;
}[] = [
  {
    id: "free",
    name: "Free",
    price: "£0",
    tagline: "Everything you need to get started",
    features: [
      "Full profile, EPK, posts and stories",
      `${PRO_LIMITS.freeApplicationsPerWeek} gig applications per week`,
      "Your top 3 matches",
      "5 new conversations per week",
      "Unlimited replies",
    ],
    accent: "border-gray-200 dark:border-zinc-800",
  },
  {
    id: "pro",
    name: "Pro",
    price: "£5",
    tagline: "For active producers, vocalists and DJs",
    features: [
      "Unlimited gig applications",
      "All your matches unlocked",
      "30 new conversations per week",
      "Pro badge on your profile and posts",
      "No upgrade banners",
    ],
    soon: ["Post analytics (views, likes, shares)"],
    accent: "border-amber-500",
  },
  {
    id: "premium",
    name: "Premium",
    price: "£15",
    tagline: "Full access for working professionals",
    features: [
      "Everything in Pro",
      "Unlimited messaging",
      "1 post Boost every month (pinned at the top of the feed for 24h)",
      "Priority placement in matches and suggestions",
      "Premium badge on your profile and posts",
    ],
    soon: ["See who viewed your profile"],
    accent: "border-violet-600",
  },
];

const FAQ = [
  {
    q: "How does the free trial work?",
    a: `Your first ${PRO_LIMITS.trialDays} days of Pro or Premium are free. You add a card at checkout, but nothing is charged until the trial ends. Cancel before then and you pay nothing. The trial is for first-time subscribers.`,
  },
  { q: "How much does it cost after the trial?", a: "Pro is £5 per month and Premium is £15 per month, billed monthly by Stripe. Prices include VAT where applicable." },
  { q: "Can I switch between Pro and Premium?", a: "Yes, any time on this page. Stripe adjusts your next invoice for the days left in the month." },
  { q: "Can I cancel anytime?", a: "Yes. Use “Manage subscription” on this page. You keep your plan until the end of the period you've paid for." },
  {
    q: "What counts as a new conversation?",
    a: "Messaging someone you haven't talked to before. Replying in a conversation you already have is always unlimited, and applying to an opportunity doesn't count.",
  },
  { q: "Can I get Pro for free?", a: "Yes. Invite 3 friends with your personal link (on your home page). When the third one joins, you get a free month of Pro." },
];

function fmtDate(iso: string | null | undefined) {
  return iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";
}

function ProPageInner() {
  const { hydrated, pro } = useProStatus();
  const params = useSearchParams();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  // Current plan. Falls back to the subscription's plan if an older cached
  // response has no "tier" (that made an active Pro member look Free).
  const tier: PlanId = pro?.active ? ((pro.tier as PlanId | undefined) ?? (pro.plan as PlanId | null) ?? "pro") : "free";
  const paid = pro?.source === "subscription" && !!pro.active;

  // Back from Stripe Checkout: confirm the subscription so the plan switches on at once.
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
          setBanner(d?.pro?.active ? `Welcome to GRID ${d.pro.tier === "premium" ? "Premium" : "Pro"}! 🎉` : "Payment received. Your plan will switch on in a moment — refresh if it doesn't.");
        })
        .catch(() => setBanner("Payment received. Refresh the page in a moment to see your plan."))
        .finally(() => window.history.replaceState(null, "", "/pro"));
    }
  }, [params]);

  async function choose(plan: "pro" | "premium") {
    const name = plan === "premium" ? "Premium" : "Pro";
    setError(null);
    setBanner(null);
    if (plan === tier) {
      setBanner(`You're already on ${name}.`);
      return;
    }
    if (paid) {
      // Existing subscribers: the card is already on file, so the plan changes
      // in place (no Stripe page). Stripe adjusts the next invoice.
      const ok = window.confirm(
        `Switch to ${name} (${plan === "premium" ? "£15" : "£5"}/month)? ` +
          (pro?.trialing ? "Your free trial continues until it ends." : "Stripe adjusts your next invoice for the rest of this month.")
      );
      if (!ok) return;
    }
    setBusy(plan);
    const err = paid ? await changePlan(plan) : await goToProCheckout(plan);
    if (err) setError(err);
    else if (paid) setBanner(`Done — you're now on ${name}. 🎉`);
    setBusy(null);
  }

  async function manage() {
    setBusy("manage");
    setError(null);
    const err = await openBillingPortal();
    if (err) {
      setError(err);
      setBusy(null);
    }
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    );
  }

  const firstTime = !pro?.hadSubscription;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold mb-4">
            <CrownIcon className="w-4 h-4" />
            GRID plans
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Pick the plan that fits your career</h1>
          <p className="text-base text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Start free. Upgrade when you&apos;re ready — {firstTime ? `your first ${PRO_LIMITS.trialDays} days of Pro or Premium are free` : "cancel anytime"}.
          </p>

          {banner && (
            <p role="status" className="mt-6 inline-block rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 text-sm font-semibold text-emerald-800 dark:text-emerald-300">
              {banner}
            </p>
          )}

          {pro?.active && (
            <div className="mt-6 mx-auto max-w-md rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-white dark:bg-zinc-900 p-5 text-left">
              <p className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                <CrownIcon className={`w-5 h-5 ${tier === "premium" ? "text-violet-600" : "text-amber-500"}`} /> You have GRID {tier === "premium" ? "Premium" : "Pro"}
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-zinc-400">
                {pro.source === "grant"
                  ? `Free Pro from your invites, until ${fmtDate(pro.until)}.`
                  : pro.trialing
                    ? `Free trial until ${fmtDate(pro.until)}. ${pro.cancelAtPeriodEnd ? "It won't renew." : `Then ${tier === "premium" ? "£15" : "£5"}/month.`}`
                    : pro.cancelAtPeriodEnd
                      ? `Cancelled. Your plan stays on until ${fmtDate(pro.until)}.`
                      : pro.status === "past_due"
                        ? "Your last payment failed. Please update your card to keep your plan."
                        : `Renews on ${fmtDate(pro.until)}.`}
              </p>
              {pro.hasSubscription && (
                <button type="button" onClick={manage} disabled={!!busy} className="mt-3 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:underline disabled:opacity-50">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {TIERS.map((t) => {
            const current = t.id === tier;
            const popular = t.id === "pro";
            return (
              <div key={t.id} className={`relative bg-white dark:bg-zinc-900 rounded-2xl border-2 p-6 flex flex-col ${t.accent} ${popular ? "shadow-xl" : ""}`}>
                {t.id !== "free" && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold px-3 py-1 rounded-full ${t.id === "premium" ? "bg-violet-600" : "bg-amber-500"}`}>
                    {firstTime ? `${PRO_LIMITS.trialDays} DAYS FREE` : t.id === "premium" ? "ALL ACCESS" : "MOST POPULAR"}
                  </div>
                )}
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t.name}</h2>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">{t.tagline}</p>
                <div className="my-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{t.price}</span>
                  <span className="text-sm text-gray-500 ml-1">/ {t.id === "free" ? "forever" : "month"}</span>
                </div>
                <ul className="space-y-2 mb-3">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700 dark:text-zinc-300">
                      <CheckIcon className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {t.soon && (
                  <ul className="space-y-2 mb-6">
                    {t.soon.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-500 dark:text-zinc-500">
                        <span className="mt-0.5 rounded bg-gray-100 dark:bg-zinc-800 px-1.5 text-[10px] font-bold uppercase">Soon</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-auto">
                  {current ? (
                    <button disabled className="w-full py-3 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-500 text-sm font-bold cursor-not-allowed">
                      Current plan
                    </button>
                  ) : t.id === "free" ? (
                    <p className="text-center text-xs text-gray-500 py-3">
                      {paid ? "To go back to Free, cancel in “Manage subscription”." : "Always free"}
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => choose(t.id as "pro" | "premium")}
                      disabled={!!busy}
                      className={`w-full py-3 rounded-lg text-sm font-bold text-white transition-colors disabled:opacity-60 ${
                        t.id === "premium" ? "bg-violet-600 hover:bg-violet-700" : "bg-amber-500 hover:bg-amber-600"
                      }`}
                    >
                      {busy === t.id
                        ? paid ? "Switching…" : "Opening secure checkout…"
                        : paid ? `Switch to ${t.name} →` : firstTime ? `Try ${t.name} free for ${PRO_LIMITS.trialDays} days →` : `Get ${t.name} →`}
                    </button>
                  )}
                  {t.id !== "free" && !current && (
                    <p className="text-[11px] text-gray-500 text-center mt-2">
                      {paid ? "Prorated on your next invoice" : firstTime ? `Card required · ${t.price}/month after the trial` : "Billed monthly · Cancel anytime"}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

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
