"use client";

import { useState } from "react";

const BENEFITS = [
  {
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    title: "You own your audience",
    body: "Export your follower list anytime. Take it with you. No lock-in, ever. Your fans belong to you, not to a platform.",
  },
  {
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    title: "Stop guessing. Start knowing.",
    body: "See who viewed your profile, what they clicked, where they came from, and whether they came back. Right now you are guessing. Pro gives you the data.",
  },
  {
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    title: "Stop losing sales",
    body: "Free tier: 3 merch items. Pro: unlimited. Every time you hit the limit, you turn away a fan. At £10 per item, sell just 2 extra items a month and Pro pays for itself.",
  },
  {
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    title: "Get discovered first",
    body: "Priority placement in Discoveries and Network suggestions. You are not competing with 100,000 tracks on Spotify. You are surfaced to people already looking for someone like you.",
  },
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    title: "Prove you're real",
    body: "Verified badge for A&Rs, labels, and collaborators. A small signal that opens big doors.",
  },
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "Reach new people",
    body: "Two free Boosts per month. Never pay to reach your own followers. Boost is for discovery, not for access to your audience.",
  },
];

const PAIN_STATS = [
  { stat: "74%", label: "of independent artists earned less than $1,000 last year" },
  { stat: "64%", label: "work a day job just to survive" },
  { stat: "32%", label: "considered quitting music in the past 12 months" },
  { stat: "43%", label: "say better discovery tools would change everything" },
];

const COMPARISON = [
  { feature: "Followers", free: "Unlimited", pro: "Unlimited" },
  { feature: "Merch listings", free: "3 items", pro: "Unlimited" },
  { feature: "Profile analytics", free: "Basic view count", pro: "Views, clicks, sources, return visits" },
  { feature: "Audience export (CSV)", free: "❌", pro: "✅ Anytime" },
  { feature: "Discoveries placement", free: "Standard", pro: "Priority" },
  { feature: "Verified badge", free: "❌", pro: "✅" },
  { feature: "Boosts", free: "Pay per post", pro: "2 free/month" },
];

export default function ProPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("artist");
  const [monthlyRevenue, setMonthlyRevenue] = useState("unknown");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [signupCount, setSignupCount] = useState<number | null>(null);

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
      setSignupCount(data.position ?? null);
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

  function WaitlistForm({ compact = false }: { compact?: boolean }) {
    return (
      <div id={compact ? undefined : "waitlist"} className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
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

        <p className="mt-3 text-xs text-gray-500 text-center">
          ✓ No card required. ✓ No spam. ✓ Cancel anytime when Pro launches.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 mt-3 text-sm">
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
            <option value="unknown">Monthly music income (optional)</option>
            <option value="0">£0 (starting out)</option>
            <option value="1-100">£1–100</option>
            <option value="101-500">£101–500</option>
            <option value="501-2000">£501–2,000</option>
            <option value="2000+">£2,000+</option>
          </select>
        </div>

        {message && (
          <p className={`mt-4 text-sm text-center ${status === "error" ? "text-red-500" : "text-emerald-600"}`}>
            {message}
          </p>
        )}

        {signupCount !== null && (
          <p className="mt-2 text-xs text-gray-500 text-center">
            You are artist #{signupCount} on the waitlist.
          </p>
        )}

        <p className="mt-4 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-3 text-center">
          <strong>Early access opens in batches.</strong> The first 100 artists get Pro at{" "}
          <strong>£8/month locked for life</strong>. After that, it's £12.
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-gray-900 dark:text-white">
      {/* HERO — pure hook, no form */}
      <section id="top" className="max-w-3xl mx-auto px-6 pt-20 pb-12 text-center">
        <span className="inline-block text-xs font-bold tracking-widest uppercase text-emerald-600 mb-4">
          GRID Artist Pro — Early Access
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
          Your audience is yours.<br />
          <span className="text-emerald-600">Prove it with Pro.</span>
        </h1>
        <p className="text-lg text-gray-700 dark:text-zinc-300 max-w-2xl mx-auto mb-4">
          GRID is the only platform that gives independent artists what streaming
          services never will: <strong>ownership of their audience</strong>,{" "}
          <strong>clarity from their data</strong>, and{" "}
          <strong>control over their career</strong>.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Analytics, audience export, unlimited listings, and priority placement —
          for artists who treat their career like a business.
        </p>
        <a
          href="#waitlist"
          className="inline-block px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
        >
          Join the waitlist ↓
        </a>
      </section>

      {/* PAIN — agitate */}
      <section className="max-w-3xl mx-auto px-6 py-12 border-t border-gray-200 dark:border-zinc-800">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-center">
          The uncomfortable truth about being an independent artist in 2026
        </h2>
        <p className="text-gray-600 dark:text-zinc-400 text-center max-w-xl mx-auto mb-8">
          You spent years building a following. But when was the last time you could actually <em>reach</em> them?
        </p>
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl p-6 mb-8">
          <p className="text-sm text-red-800 dark:text-red-300 leading-relaxed">
            Spotify owns your listeners. Instagram owns your followers. TikTok owns your reach.
            If the algorithm changes tomorrow, your audience disappears — and you have no way to get them back.
          </p>
          <p className="text-sm text-red-800 dark:text-red-300 leading-relaxed mt-3 font-semibold">
            The system is not broken. It is working exactly as designed.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {PAIN_STATS.map((s) => (
            <div key={s.stat} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 text-center">
              <p className="text-2xl md:text-3xl font-extrabold text-emerald-600">{s.stat}</p>
              <p className="text-xs text-gray-500 mt-1 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-700 dark:text-zinc-300 font-semibold mb-8">
          GRID exists because your fans should belong to <em>you</em>, not to a platform.
        </p>

        {/* FORM after pain — first conversion point */}
        <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-center mb-4">
            Join the waitlist — no card required
          </h3>
          <WaitlistForm />
        </div>
      </section>

      {/* BENEFITS */}
      <section className="max-w-4xl mx-auto px-6 py-12 border-t border-gray-200 dark:border-zinc-800">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-center">
          What GRID Pro gives you
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={b.icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold mb-1">{b.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-zinc-400">{b.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FREE VS PRO TABLE — loss aversion */}
      <section className="max-w-3xl mx-auto px-6 py-12 border-t border-gray-200 dark:border-zinc-800">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-center">
          Free vs. Pro — what actually changes
        </h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-zinc-800">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-zinc-900">
              <tr>
                <th className="text-left p-3 font-bold">Feature</th>
                <th className="text-left p-3 font-bold">Free</th>
                <th className="text-left p-3 font-bold text-emerald-600">Pro (£12/mo)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
              {COMPARISON.map((row) => (
                <tr key={row.feature} className="bg-white dark:bg-zinc-950">
                  <td className="p-3 font-medium">{row.feature}</td>
                  <td className="p-3 text-gray-500">{row.free}</td>
                  <td className="p-3 text-emerald-700 dark:text-emerald-400 font-medium">{row.pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* OBJECTION HANDLING */}
      <section className="max-w-3xl mx-auto px-6 py-12 border-t border-gray-200 dark:border-zinc-800">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-center">
          You might be thinking…
        </h2>
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
            <p className="font-bold mb-1">"Will this actually work for me?"</p>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              GRID was built <em>with</em> artists and estate managers, not just for them.
              The analytics and export features were designed from real conversations with
              independent artists who said: <em>"I don't need more followers. I need to reach
              the ones I already have."</em>
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
            <p className="font-bold mb-1">"Is £12/month worth it?"</p>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              One fan buying one £10 merch item pays you more than 2,500 Spotify streams.
              If Pro helps you sell <strong>two extra items per month</strong>, it pays for
              itself. If it doesn't, cancel. No contract.
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
            <p className="font-bold mb-1">"What if I don't like it?"</p>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              14-day free trial when Pro launches. No card required to join the waitlist.
              No commitment until you've seen it work.
            </p>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF — one real testimonial only */}
      <section className="max-w-3xl mx-auto px-6 py-12 border-t border-gray-200 dark:border-zinc-800">
        <h2 className="text-xl md:text-2xl font-extrabold mb-6 text-center">
          What artists are saying
        </h2>
        <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 max-w-xl mx-auto">
          <p className="text-sm text-gray-700 dark:text-zinc-300 italic">
            "I moved 200 email subscribers to my own list in 5 minutes. That list is now
            my most valuable asset — not my Spotify followers."
          </p>
          <p className="text-xs text-gray-500 mt-3">— Independent artist, Manchester</p>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          (Replace with a real, named testimonial as soon as you have one.)
        </p>
      </section>

      {/* EMOTIONAL RELIEF TABLE */}
      <section className="max-w-4xl mx-auto px-6 py-12 border-t border-gray-200 dark:border-zinc-800">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-center">
          What changes when you use GRID
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden">
            <thead className="bg-gray-50 dark:bg-zinc-900">
              <tr>
                <th className="text-left p-3 font-bold">The pain you feel today</th>
                <th className="text-left p-3 font-bold">The relief GRID provides</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
              {[
                ["Exhaustion from constant content creation with no return", "Focus on relationships that convert, guided by analytics"],
                ["Anxiety that the algorithm will erase your reach", "Security knowing your audience is exportable and owned"],
                ["Isolation from fans you cannot reach directly", "Connection through direct, owned communication"],
                ["Inadequacy from comparing metrics to others' highlight reels", "Clarity from understanding your own data"],
                ["Hopelessness that music will never be sustainable", "Control over a career built on owned assets"],
                ["Burnout from trying to be everywhere, all the time", "Sustainability from intentional, bounded engagement"],
              ].map(([pain, relief], i) => (
                <tr key={i} className="bg-white dark:bg-zinc-950">
                  <td className="p-3 text-gray-600 dark:text-zinc-400">{pain}</td>
                  <td className="p-3 text-emerald-700 dark:text-emerald-400 font-medium">{relief}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* PRICING */}
      <section className="max-w-3xl mx-auto px-6 py-12 border-t border-gray-200 dark:border-zinc-800">
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-8 text-center">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide mb-2">
            Planned price
          </p>
          <p className="text-4xl font-extrabold mb-2">
            £12<span className="text-lg font-medium text-gray-500">/month</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-zinc-400 mb-6">
            First 100 waitlist artists lock in <strong>£8/month for life</strong>. Cancel anytime.
            14-day free trial when Pro launches.
          </p>
          <a
            href="#waitlist"
            className="inline-block px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
          >
            Join the waitlist ↑
          </a>
          <p className="text-xs text-gray-500 mt-6">
            One fan buying one £10 item pays you more than 2,500 Spotify streams.
            Pro is for artists who want more of those fans.
          </p>
        </div>
      </section>

      {/* FINAL CTA — repeat form */}
      <section className="max-w-3xl mx-auto px-6 py-12 border-t border-gray-200 dark:border-zinc-800">
        <h2 className="text-xl md:text-2xl font-extrabold mb-4 text-center">
          Your audience is yours. Prove it with Pro.
        </h2>
        <WaitlistForm compact />
      </section>
    </main>
  );
}