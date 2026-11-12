"use client";

import { useState } from "react";

const BENEFITS = [
  {
    title: "Analytics that prove your value",
    body: "See who viewed your profile, what they clicked, and where they came from. Stop guessing.",
  },
  {
    title: "Your audience is yours. Export anytime.",
    body: "Download your follower list as CSV. Take it with you. No lock-in, ever.",
  },
  {
    title: "Unlimited merch & gig listings",
    body: "Free tier: 3 items. Pro: unlimited. Sell directly to fans without platform tax on every item.",
  },
  {
    title: "Priority placement in Discoveries",
    body: "Appear above non-Pro artists in Network suggestions and Discoveries subpages.",
  },
  {
    title: "Verified badge",
    body: "A trust signal for A&Rs, labels, and collaborators. Prove you're real.",
  },
  {
    title: "Two free Boosts per month",
    body: "Reach new listeners — never pay to reach people who already follow you.",
  },
];

export default function ProPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("artist");
  const [monthlyRevenue, setMonthlyRevenue] = useState("unknown");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/pro-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, monthlyRevenue }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Something went wrong");
      setStatus("done");
      setMessage(
        data.alreadyOnList
          ? "You're already on the list. We'll be in touch."
          : `You're on the list — position #${data.position}. We'll email you when Pro opens.`
      );
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-gray-900 dark:text-white">
      {/* HERO */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-12 text-center">
        <span className="inline-block text-xs font-bold tracking-widest uppercase text-emerald-600 mb-4">
          GRID Artist Pro — Early Access
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
          Your audience is yours.<br />
          <span className="text-emerald-600">Prove it with Pro.</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-zinc-400 max-w-xl mx-auto mb-8">
          Analytics, audience export, unlimited listings, and priority placement —
          for artists who treat their career like a business.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@yourdomain.com"
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold transition-colors"
          >
            {status === "loading" ? "Joining..." : "Join waitlist"}
          </button>
        </form>

        <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto mt-3 text-sm">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
          >
            <option value="artist">I'm an artist</option>
            <option value="producer">I'm a producer</option>
            <option value="manager">I'm a manager</option>
            <option value="label">I'm a label</option>
            <option value="other">Other</option>
          </select>
          <select
            value={monthlyRevenue}
            onChange={(e) => setMonthlyRevenue(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
          >
            <option value="unknown">Monthly music income?</option>
            <option value="0">£0 (starting out)</option>
            <option value="1-100">£1–100</option>
            <option value="101-500">£101–500</option>
            <option value="501-2000">£501–2,000</option>
            <option value="2000+">£2,000+</option>
          </select>
        </div>

        {message && (
          <p
            className={`mt-4 text-sm ${
              status === "error" ? "text-red-500" : "text-emerald-600"
            }`}
          >
            {message}
          </p>
        )}

        <p className="text-xs text-gray-500 mt-4">
          No spam. No card required. Just early access when Pro opens.
        </p>
      </section>

      {/* BENEFITS */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-6">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm"
            >
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {b.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400">{b.body}</p>
            </div>
          ))}
        </div>

        {/* PRICING */}
        <div className="mt-12 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-8 text-center">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide mb-2">
            Planned price
          </p>
          <p className="text-4xl font-extrabold mb-2">
            £12<span className="text-lg font-medium text-gray-500">/month</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-zinc-400 mb-6">
            Cancel anytime. 14-day free trial when Pro launches. No card to join the waitlist.
          </p>
          <a
            href="#top"
            className="inline-block px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
          >
            Join the waitlist ↑
          </a>
        </div>

        <p className="text-xs text-gray-500 text-center mt-8">
          One fan buying one £10 item pays you more than 2,500 Spotify streams.
          Pro is for artists who want more of those fans.
        </p>
      </section>
    </main>
  );
}