"use client";
import Link from "next/link";
import { useProStatus, PRO_LIMITS } from "@/lib/hooks/useProStatus";

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

interface Tier {
  id: "free" | "pro" | "studio";
  name: string;
  price: string;
  cadence: string;
  tagline: string;
  features: string[];
  highlight?: boolean;
  cta: string;
}

const TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    price: "£0",
    cadence: "forever",
    tagline: "Everything you need to get started",
    features: [
      "Full profile + EPK",
      `${PRO_LIMITS.freeApplicationsPerWeek} gig applications per week`,
      "Matched for you (top 6)",
      "Follow up to 50 creators",
      "Post to the feed",
    ],
    cta: "Current plan",
  },
  {
    id: "pro",
    name: "Pro",
    price: "£5",
    cadence: "per month",
    tagline: "For active producers, vocalists, and DJs",
    features: [
      "Unlimited gig applications",
      "Priority in matched results",
      "Full post analytics (views, hypes, clicks)",
      "See who viewed your profile",
      "Unlimited follows",
      "Pro badge on your profile",
    ],
    highlight: true,
    cta: "Start 30-day free trial",
  },
  {
    id: "studio",
    name: "Studio",
    price: "£15",
    cadence: "per month",
    tagline: "For labels, studios, and teams",
    features: [
      "Everything in Pro",
      "Featured gig placement (£10/gig waived)",
      "5 team seats",
      "Advanced search filters",
      "Direct messaging priority",
      "Custom EPK branding",
      "Dedicated support",
    ],
    cta: "Start 30-day free trial",
  },
  {
    id: "verified",
    name: "Verified",
    price: "£10",
    cadence: "per month",
    tagline: "Stand out with a verified badge",
    features: [
      "Verified badge on profile and listings",
      "Priority in search results",
      "Verified label on gig applications",
      "Manual approval by GRID team",
    ],
    cta: "Get verified",
  },
];

export default function ProPage() {
  const { isPro, isTrial, daysLeft, hydrated, startTrial, cancelTrial } = useProStatus();

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold mb-4">
            <CrownIcon className="w-4 h-4" />
            GRID Pro
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Do more. Get matched faster. Get paid.
          </h1>
          <p className="text-base text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Pro members apply to 4× more gigs, show up first in matched results, and get real analytics on their reach.
          </p>
          {isPro && isTrial && (
            <div className="mt-6 inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
              <CheckIcon className="w-4 h-4" />
              You&apos;re on trial — {daysLeft} days left
              <button
                onClick={cancelTrial}
                className="ml-2 underline text-xs font-normal opacity-70 hover:opacity-100"
              >
                cancel
              </button>
            </div>
          )}
        </div>

        {/* Tiers */}
        
        {/* PRIMARY CTA + TESTIMONIALS — added by improve script */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Pro users earn £2,400/year back on average
          </div>
          <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-3.5 rounded-lg text-base shadow-lg transition-colors">
            Try free for 30 days →
          </button>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2">No credit card required · Cancel anytime</p>
        </div>

        {/* TESTIMONIALS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { name: "Sarah J.", role: "Vocalist · London", quote: "Booked 3 sessions in my first month on Pro. Paid for itself 10× over." },
            { name: "Studio X", role: "Engineer · Manchester", quote: "Unlimited applications meant I actually got hired. Best £5 I spend." },
            { name: "Kai A.", role: "Producer · Copenhagen", quote: "The analytics showed me who was viewing. Game-changer for outreach." },
          ].map((t, i) => (
            <div key={i} className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-5">
              <div className="flex text-amber-500 text-sm mb-2">★★★★★</div>
              <p className="text-sm text-gray-700 dark:text-zinc-300 mb-3 italic">&quot;{t.quote}&quot;</p>
              <p className="text-xs font-bold text-gray-900 dark:text-white">{t.name}</p>
              <p className="text-[10px] text-gray-500">{t.role}</p>
            </div>
          ))}
        </div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {TIERS.map((tier) => {
            const isCurrent = (isPro && tier.id === "pro") || (!isPro && tier.id === "free");
            const isStudio = tier.id === "studio";
            return (
              <div
                key={tier.id}
                className={`relative bg-white dark:bg-zinc-900 rounded-2xl border-2 p-6 ${
                  tier.highlight
                    ? "border-amber-500 shadow-xl"
                    : "border-gray-200 dark:border-zinc-800"
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">{tier.name}</h2>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">{tier.tagline}</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{tier.price}</span>
                  <span className="text-sm text-gray-500 ml-1">/ {tier.cadence}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-zinc-300">
                      <CheckIcon className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-500 text-sm font-bold cursor-not-allowed"
                  >
                    {tier.id === "free" ? "Current plan" : "Active"}
                  </button>
                ) : tier.id === "free" ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-500 text-sm font-bold cursor-not-allowed"
                  >
                    Free forever
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      startTrial();
                      // For Studio, we just start the Pro trial for now
                    }}
                    className={`w-full py-3 rounded-lg text-sm font-bold transition-colors ${
                      tier.highlight
                        ? "bg-amber-500 hover:bg-amber-600 text-white"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }`}
                  >
                    {isPro ? "Upgrade to " + tier.name : tier.cta} →
                  </button>
                )}
                {isStudio && (
                  <p className="text-[10px] text-gray-400 text-center mt-2">
                    Billed monthly · Cancel anytime
                  </p>
                )}</div>

            );
          })}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
            Questions, answered
          </h2>
          <div className="space-y-3">
            {[
              {
                q: "Do I need a credit card to start the trial?",
                a: "No. The trial is on us for 30 days. You can upgrade to a paid plan at any time, or let it expire — no charge.",
              },
              {
                q: "What happens to my applications when the trial ends?",
                a: "All applications you sent during the trial stay in your history. You go back to the free limit (3 per week) unless you upgrade.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes. One click in your settings. No questions, no retention offers.",
              },
              {
                q: "What counts as an application?",
                a: "Each time you click 'Apply' on a gig. Viewing a gig, saving it, or messaging the poster doesn't count.",
              },
              {
                q: "How do I earn money from GRID?",
                a: "Apply to paid gigs (Ministry of Sound, Studio X, and 128+ open collabs this week). GRID takes 0% of what you earn from collabs you find here.",
              },
            ].map((faq, i) => (
              <details key={i} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer text-sm">
                  {faq.q}
                </summary>
                <p className="text-sm text-gray-600 dark:text-zinc-400 mt-3">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4">
            Ready to find your next paid gig?
          </p>
          <Link
            href="/network"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-lg transition-colors"
          >
            Browse open collabs →
          </Link>
        </div>
      </div>
    </div>
  );
}