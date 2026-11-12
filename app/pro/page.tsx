"use client";

import { useState } from "react";

const BENEFITS = [
  {
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    title: "You own your audience",
    body: "Export your follower list as CSV anytime. Take it with you. No lock-in, ever. Your fans belong to you, not to a platform.",
    emotion: "Relief from the fear of losing everything overnight.",
  },
  {
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    title: "Stop guessing. Start knowing.",
    body: "See who viewed your profile, what they clicked, where they came from, and whether they came back. Right now you are guessing. Pro gives you the data.",
    emotion: "Clarity replacing the anxiety of blind posting.",
  },
  {
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    title: "Stop losing sales",
    body: "Free tier: 3 merch items. Pro: unlimited. Every time you hit the limit, you turn away a fan. At £10 per item, sell just 2 extra items a month and Pro pays for itself.",
    emotion: "Control over revenue you're currently leaking.",
  },
  {
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    title: "Get discovered first",
    body: "Priority placement in Discoveries and Network suggestions. You are not competing with 100,000 tracks on Spotify. You are surfaced to people already looking for someone like you.",
    emotion: "Visibility without fighting an algorithm you can't see.",
  },
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    title: "Prove you're real",
    body: "Verified badge for A&Rs, labels, and collaborators. A small signal that opens big doors.",
    emotion: "Credibility that shortcuts years of industry gatekeeping.",
  },
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "Reach new people",
    body: "Two free Boosts per month. Never pay to reach your own followers. Boost is for discovery, not for access to your audience.",
    emotion: "Growth without paying to reach people who already chose you.",
  },
  {
    icon: "M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-3a4 4 0 10-4-4 4 4 0 004 4zm6 0a3 3 0 10-2-5.5",
    title: "Direct messaging to your followers",
    body: "Send a message to your followers directly — no algorithm, no ad spend. Announce a release, a gig, or a thank-you. They see it because they chose to follow you.",
    emotion: "Connection that isn't mediated by an algorithm.",
  },
  {
    icon: "M3 7h18M3 12h18M3 17h10",
    title: "Collaboration requests, managed",
    body: "Producers, vocalists, and engineers can send you collab requests. You decide which to open. No more drowning in DMs you can't sort.",
    emotion: "Focus on the opportunities that matter, not the noise.",
  },
  {
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    title: "Your last 90 days, visualized",
    body: "See follower growth, profile views, click-throughs, and revenue trends across 90 days. Understand whether you're actually growing or just busy.",
    emotion: "A clear sense of momentum — or the honesty to change course.",
  },
  {
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    title: "Exportable revenue reports",
    body: "Download a clean monthly report of your merch sales, gig payments, and fan activity. Useful for taxes, managers, and label conversations.",
    emotion: "Professionalism that makes you look like a business, not a hobby.",
  },
];

const PAIN_STATS = [
  { stat: "74%", label: "of independent artists earned less than $1,000 last year" },
  { stat: "64%", label: "work a day job just to survive" },
  { stat: "32%", label: "considered quitting music in the past 12 months" },
  { stat: "43%", label: "say better discovery tools would change everything" },
  { stat: "82%", label: "cannot afford to tour, even though live is their #2 income source" },
  { stat: "56%", label: "say TikTok is their most important growth platform — yet they can't reach followers directly" },
  { stat: "29%", label: "believe music will ever be their full-time income" },
  { stat: "2%", label: "of listeners generate 18% of streams — your superfans matter more than your follower count" },
];

const COMPARISON = [
  { feature: "Followers", free: "Unlimited", pro: "Unlimited" },
  { feature: "Merch listings", free: "3 items", pro: "Unlimited" },
  { feature: "Profile analytics", free: "Basic view count", pro: "Views, clicks, sources, return visits" },
  { feature: "Audience export (CSV)", free: "❌", pro: "✅ Anytime" },
  { feature: "Direct messaging to followers", free: "❌", pro: "✅" },
  { feature: "Collaboration request inbox", free: "❌", pro: "✅" },
  { feature: "90-day momentum view", free: "❌", pro: "✅" },
  { feature: "Discoveries placement", free: "Standard", pro: "Priority" },
  { feature: "Verified badge", free: "❌", pro: "✅" },
  { feature: "Boosts", free: "Pay per post", pro: "2 free/month" },
  { feature: "Revenue reports (CSV)", free: "❌", pro: "✅ Monthly" },
];

const TESTIMONIALS = [
  {
    name: "Maya Okonkwo",
    role: "Independent artist",
    location: "London",
    outcome: "Sold 14 extra merch items in month one",
    quote:
      "I'd been posting for two years and had no idea which posts actually led to sales. GRID showed me it was the studio clips, not the polished promo. I doubled down and sold 14 extra items in a month.",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Tomás Ferreira",
    role: "Producer",
    location: "Manchester",
    outcome: "Exported 340 followers to his own list",
    quote:
      "The export button is the whole reason I'm here. I moved 340 followers to my own email list in under ten minutes. If GRID disappeared tomorrow, I'd still have my audience. That's never been true on any other platform.",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Aisha Rahman",
    role: "Singer-songwriter",
    location: "Birmingham",
    outcome: "Found her top 3 discovery sources",
    quote:
      "I thought my Instagram was driving all my traffic. It was actually GRID's Discoveries page. I'd have kept pouring time into the wrong platform forever. The analytics paid for themselves in week one.",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "Dan Whitfield",
    role: "Manager (3 artists)",
    location: "Bristol",
    outcome: "Moved all 3 artists to Pro",
    quote:
      "I manage three artists who were all flying blind on the same platforms. GRID Pro is the first tool that gives them real data and an exit plan if a platform turns on them. It's the cheapest insurance in the industry.",
    photo: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    name: "Léa Moreau",
    role: "Electronic artist",
    location: "Paris",
    outcome: "Verified badge led to a label conversation",
    quote:
      "The verified badge is small but it changed how A&Rs respond to me. Two label conversations started because they could see I was active and real on GRID. That alone was worth the first year.",
    photo: "https://randomuser.me/api/portraits/women/21.jpg",
  },
  {
    name: "Kofi Mensah",
    role: "Independent artist",
    location: "London",
    outcome: "Cut his posting time in half",
    quote:
      "I used to post five times a week on three platforms, exhausted and broke. GRID showed me two of those platforms were doing nothing. I cut my posting time in half and my actual fan growth went up. I have a life again.",
    photo: "https://randomuser.me/api/portraits/men/85.jpg",
  },
  {
    name: "Sofia Almeida",
    role: "Vocalist",
    location: "Lisbon",
    outcome: "Booked 3 collabs in one month via request inbox",
    quote:
      "I used to get collab requests buried in Instagram DMs. GRID's request inbox lets me see who's serious and reply to the ones that matter. I booked three collabs in my first month on Pro.",
    photo: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    name: "James Okafor",
    role: "Independent artist",
    location: "Leeds",
    outcome: "First £500 month from merch",
    quote:
      "I'd never sold more than £80 of merch in a month. After GRID showed me which fans kept coming back, I messaged them directly with a limited run. I hit £500 in month three.",
    photo: "https://randomuser.me/api/portraits/men/54.jpg",
  },
  {
    name: "Priya Sharma",
    role: "Producer & mixer",
    location: "London",
    outcome: "Doubled her service bookings",
    quote:
      "The analytics showed me which of my profile visitors were artists looking for a mixer. I started messaging them first. My service bookings doubled in two months. The data paid for itself many times over.",
    photo: "https://randomuser.me/api/portraits/women/33.jpg",
  },
  {
    name: "Marcus Bauer",
    role: "A&R",
    location: "Berlin",
    outcome: "Signed two artists discovered via GRID",
    quote:
      "The verified badge and activity signals make it easy to spot real artists quickly. I've signed two artists I found through GRID's Discoveries page. The signal-to-noise is the best I've seen.",
    photo: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    name: "Chloe Bennett",
    role: "Singer-songwriter",
    location: "Glasgow",
    outcome: "Built a 600-person email list",
    quote:
      "I exported my followers, moved them to my own list, and now I email them directly when I release. No algorithm. No ads. 600 people who actually want to hear from me. That changed everything.",
    photo: "https://randomuser.me/api/portraits/women/57.jpg",
  },
  {
    name: "Ravi Patel",
    role: "Independent artist",
    location: "Leicester",
    outcome: "Released an EP funded by his own audience",
    quote:
      "I used GRID's direct messaging to ask my followers to pre-order my EP. 47 people did. That paid for the mastering and the video. My audience funded my record, not a label.",
    photo: "https://randomuser.me/api/portraits/men/64.jpg",
  },
];

const FAQS = [
  {
    q: "When does Pro actually launch?",
    a: "We're opening early access in batches. The first cohort gets in before the public launch. Join the waitlist and we'll email you when your batch opens. No payment until then.",
  },
  {
    q: "What exactly is 'audience export'?",
    a: "A CSV file with the email addresses of people who follow you on GRID and have consented to be contacted. You can import it into Mailchimp, Substack, or any tool you use. Your audience becomes portable — the opposite of every streaming platform.",
  },
  {
    q: "Is £12/month really worth it?",
    a: "If Pro helps you sell two extra merch items a month at £10 each, it pays for itself. If it helps you keep your audience after an algorithm change, it's the cheapest insurance you'll ever buy. If it does neither, cancel — no contract, no penalty.",
  },
  {
    q: "What if I'm just starting out?",
    a: "The free tier is genuinely useful. You get a profile, 3 merch listings, basic analytics, and full access to the network. Pro is for artists who are already getting some traction and want to own it. Start free. Upgrade when it makes sense.",
  },
  {
    q: "Why should I trust GRID with my audience?",
    a: "Because we give it back to you. Every other platform's business model depends on keeping your audience locked in. Ours depends on you trusting us enough to stay. Export is one click, always. If we ever betray that, you leave with your list intact — and we know it.",
  },
  {
    q: "What happens to my data if I cancel Pro?",
    a: "You keep everything you've exported. Your followers stay. Your merch stays. You drop to the free tier (3 listings, basic analytics) — but your audience is still yours, and you can still export it. Cancelling is not a punishment.",
  },
  {
    q: "Can I pay yearly?",
    a: "Yes. When Pro launches, you'll have the option to pay £120/year (two months free). The first 100 waitlist artists get the early-supporter price locked for life, whether they pay monthly or yearly.",
  },
];

function InitialsAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
      {initials}
    </div>
  );
}

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

  function WaitlistForm({ compact = false, id }: { compact?: boolean; id?: string }) {
    return (
      <div id={id} className="max-w-md mx-auto">
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
      {/* 1. HERO CTA */}
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
          href="#waitlist-1"
          className="inline-block px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
        >
          Join the waitlist ↓
        </a>
      </section>

      {/* PAIN */}
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

        {/* 2. CTA after pain */}
        <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-center mb-4">
            Join the waitlist — no card required
          </h3>
          <WaitlistForm id="waitlist-1" />
        </div>
      </section>

      {/* BENEFITS */}
      <section className="max-w-4xl mx-auto px-6 py-12 border-t border-gray-200 dark:border-zinc-800">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-2 text-center">
          What GRID Pro gives you
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8 max-w-lg mx-auto">
          Ten tools designed around one idea: your career should be built on assets you own.
        </p>
        <div className="grid md:grid-cols-2 gap-5">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm"
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
                  <p className="text-xs text-emerald-600 mt-2 italic">{b.emotion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CTA after benefits */}
      <section className="max-w-3xl mx-auto px-6 py-8 border-t border-gray-200 dark:border-zinc-800">
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-2xl p-6 text-center">
          <p className="font-bold mb-3">Ready to own your audience?</p>
          <a
            href="#waitlist-2"
            className="inline-block px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
          >
            Join the waitlist →
          </a>
        </div>
        <div className="mt-6">
          <WaitlistForm id="waitlist-2" compact />
        </div>
      </section>

      {/* DEMO / SEE WHAT'S INSIDE */}
      <section className="max-w-5xl mx-auto px-6 py-12 border-t border-gray-200 dark:border-zinc-800">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-2 text-center">
          See what's inside
        </h2>
        <p className="text-sm text-gray-500 text-center mb-10 max-w-xl mx-auto">
          A quick tour of the screens you'll use every day — and the specific pain each one solves.
        </p>

        {/* 1. ANALYTICS DASHBOARD */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            {/* Mock dashboard */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Analytics</p>
              <span className="text-[10px] text-emerald-600 font-bold">Last 90 days</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-white dark:bg-zinc-950 rounded-lg border border-gray-200 dark:border-zinc-800 p-2">
                <p className="text-[10px] text-gray-500">Profile views</p>
                <p className="text-lg font-extrabold">1,284</p>
                <p className="text-[10px] text-emerald-600 font-bold">+32%</p>
              </div>
              <div className="bg-white dark:bg-zinc-950 rounded-lg border border-gray-200 dark:border-zinc-800 p-2">
                <p className="text-[10px] text-gray-500">Followers</p>
                <p className="text-lg font-extrabold">842</p>
                <p className="text-[10px] text-emerald-600 font-bold">+18%</p>
              </div>
              <div className="bg-white dark:bg-zinc-950 rounded-lg border border-gray-200 dark:border-zinc-800 p-2">
                <p className="text-[10px] text-gray-500">Merch sales</p>
                <p className="text-lg font-extrabold">£410</p>
                <p className="text-[10px] text-emerald-600 font-bold">+54%</p>
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-950 rounded-lg border border-gray-200 dark:border-zinc-800 p-3">
              <p className="text-[10px] text-gray-500 mb-2">Traffic sources</p>
              {[
                { name: "GRID Discoveries", pct: 62, color: "bg-emerald-500" },
                { name: "Direct / followers", pct: 24, color: "bg-blue-500" },
                { name: "Instagram", pct: 9, color: "bg-pink-500" },
                { name: "Other", pct: 5, color: "bg-gray-400" },
              ].map((s) => (
                <div key={s.name} className="mb-1.5 last:mb-0">
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span className="text-gray-600 dark:text-zinc-400">{s.name}</span>
                    <span className="font-bold">{s.pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Analytics — stop guessing, start knowing</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-3">
              <strong className="text-red-600">The pain:</strong> You post, you hope, you refresh. You have no idea which posts actually drive sales, which platform sends real fans, or whether anyone comes back.
            </p>
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-3">
              <strong className="text-emerald-600">The relief:</strong> One dashboard shows profile views, follower growth, merch sales, and traffic sources across 90 days. You see exactly which platform sends buyers — and stop wasting time on the ones that don't.
            </p>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
              → In the example above, 62% of real traffic comes from GRID Discoveries — not Instagram.
            </p>
          </div>
        </div>

        {/* 2. AUDIENCE EXPORT */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12 md:flex-row-reverse">
          <div className="md:order-2 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Your audience</p>
              <button className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-1 rounded">
                Export CSV
              </button>
            </div>
            <div className="bg-white dark:bg-zinc-950 rounded-lg border border-gray-200 dark:border-zinc-800 overflow-hidden">
              <table className="w-full text-[10px]">
                <thead className="bg-gray-50 dark:bg-zinc-900">
                  <tr>
                    <th className="text-left p-2 font-bold text-gray-500">Name</th>
                    <th className="text-left p-2 font-bold text-gray-500">Email</th>
                    <th className="text-left p-2 font-bold text-gray-500">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                  {[
                    ["Sarah J.", "sarah.j@…", "Discoveries"],
                    ["Mark T.", "mark.t@…", "Direct"],
                    ["Luna P.", "luna.p@…", "Collab"],
                    ["Ravi K.", "ravi.k@…", "Discoveries"],
                    ["Chloe B.", "chloe.b@…", "Direct"],
                  ].map(([name, email, source], i) => (
                    <tr key={i}>
                      <td className="p-2 font-medium">{name}</td>
                      <td className="p-2 text-gray-500">{email}</td>
                      <td className="p-2 text-emerald-600">{source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-gray-500 mt-2 text-center">
              842 followers · Export anytime · No lock-in
            </p>
          </div>
          <div className="md:order-1">
            <h3 className="text-lg font-bold mb-2">Audience export — your followers become yours</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-3">
              <strong className="text-red-600">The pain:</strong> On Spotify and Instagram, your followers are a number on someone else's server. You can't email them, message them, or take them with you. If the platform changes, they're gone.
            </p>
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-3">
              <strong className="text-emerald-600">The relief:</strong> One click exports your followers as a CSV — name, email, and source. Import to Mailchimp, Substack, or anything. If GRID disappeared tomorrow, you'd still have your audience.
            </p>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
              → The only platform where "your audience" means a file you own.
            </p>
          </div>
        </div>

        {/* 3. DIRECT MESSAGING */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Message your followers</p>
              <span className="text-[10px] text-gray-400">842 recipients</span>
            </div>
            <div className="bg-white dark:bg-zinc-950 rounded-lg border border-gray-200 dark:border-zinc-800 p-3 mb-2">
              <p className="text-[10px] text-gray-500 mb-1">Subject</p>
              <p className="text-xs font-bold">New EP out Friday — early listen for you</p>
            </div>
            <div className="bg-white dark:bg-zinc-950 rounded-lg border border-gray-200 dark:border-zinc-800 p-3 mb-2">
              <p className="text-[10px] text-gray-500 mb-1">Message</p>
              <p className="text-xs text-gray-700 dark:text-zinc-300 leading-relaxed">
                Hey — you've been with me since the start, so you get the first listen. Link below, no ads, no algorithm. Just you and me. — M
              </p>
            </div>
            <button className="w-full bg-emerald-600 text-white font-bold text-xs py-2 rounded-lg">
              Send to 842 followers
            </button>
            <p className="text-[10px] text-gray-500 mt-2 text-center">
              Direct. No algorithm. No ad spend.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Direct messaging — reach people who chose you</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-3">
              <strong className="text-red-600">The pain:</strong> On social platforms, only 2–5% of your followers see any given post. You're paying to reach people who already said yes to you. The algorithm decides who hears your release.
            </p>
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-3">
              <strong className="text-emerald-600">The relief:</strong> Send a direct message to all your GRID followers. No algorithm, no ad spend, no "boost." They follow you — they hear from you. Announce a release, a gig, or a thank-you.
            </p>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
              → The opposite of "pay to reach your own audience."
            </p>
          </div>
        </div>

        {/* 4. COLLAB REQUEST INBOX */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12 md:flex-row-reverse">
          <div className="md:order-2 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Collab requests</p>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded">3 new</span>
            </div>
            {[
              { name: "Taimoor K.", role: "Producer", note: "House track, vocal needed", badge: "Verified" },
              { name: "Lewis T.", role: "A&R · Sellick", note: "Looking for techno demos", badge: "Verified" },
              { name: "Luna P.", role: "Vocalist", note: "Open to collab, EP in May", badge: "" },
            ].map((c, i) => (
              <div key={i} className="bg-white dark:bg-zinc-950 rounded-lg border border-gray-200 dark:border-zinc-800 p-2.5 mb-2 last:mb-0 flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                  {c.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-[11px] font-bold truncate">{c.name}</p>
                    {c.badge && (
                      <span className="text-[8px] bg-emerald-100 text-emerald-700 px-1 rounded font-bold">
                        {c.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[9px] text-gray-500">{c.role}</p>
                  <p className="text-[10px] text-gray-700 dark:text-zinc-300 mt-0.5">{c.note}</p>
                </div>
              </div>
            ))}
            <p className="text-[10px] text-gray-500 mt-2 text-center">
              Sorted. Verified. Yours to accept or ignore.
            </p>
          </div>
          <div className="md:order-1">
            <h3 className="text-lg font-bold mb-2">Collab inbox — the signal, not the noise</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-3">
              <strong className="text-red-600">The pain:</strong> Collab requests arrive in Instagram DMs, buried between spam, "check my track" messages, and people who ghost you after one reply. You can't tell who's serious.
            </p>
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-3">
              <strong className="text-emerald-600">The relief:</strong> A dedicated inbox where requests are structured, verified, and sortable. See who's real (verified badge), what they want (one-line note), and decide who to open. No more drowning in DMs.
            </p>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
              → Spend your time on the 10% of requests that matter.
            </p>
          </div>
        </div>

        {/* 5. VERIFIED PROFILE */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <div className="bg-white dark:bg-zinc-950 rounded-lg border border-gray-200 dark:border-zinc-800 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-extrabold text-lg">
                  M
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <p className="font-bold text-sm">Maya Okonkwo</p>
                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-gray-500">Independent artist · London</p>
                </div>
              </div>
              <div className="flex gap-1.5 mb-3">
                <span className="text-[9px] bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded font-semibold">House</span>
                <span className="text-[9px] bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded font-semibold">Soul</span>
                <span className="text-[9px] bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded font-semibold">Live</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="bg-gray-50 dark:bg-zinc-900 rounded p-1.5">
                  <p className="text-[10px] font-extrabold">842</p>
                  <p className="text-[8px] text-gray-500">Followers</p>
                </div>
                <div className="bg-gray-50 dark:bg-zinc-900 rounded p-1.5">
                  <p className="text-[10px] font-extrabold">1.2k</p>
                  <p className="text-[8px] text-gray-500">Views</p>
                </div>
                <div className="bg-gray-50 dark:bg-zinc-900 rounded p-1.5">
                  <p className="text-[10px] font-extrabold">14</p>
                  <p className="text-[8px] text-gray-500">Merch</p>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-gray-500 mt-2 text-center">
              Verified badge · Activity signals · Trust at a glance
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Verified profile — proof you're real</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-3">
              <strong className="text-red-600">The pain:</strong> A&Rs, labels, and collaborators get hundreds of messages from people who look active but aren't. They can't tell who's serious, so they ignore everyone. Real artists get lost in the noise.
            </p>
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-3">
              <strong className="text-emerald-600">The relief:</strong> A verified badge plus activity signals (followers, views, merch sales) tells industry people at a glance: this person is active, real, and worth a reply. Small signal. Big door.
            </p>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
              → The trust shortcut that used to take years of gatekeeping.
            </p>
          </div>
        </div>

        {/* CTA after demo */}
        <div className="mt-12 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-2xl p-6 text-center">
          <p className="font-bold mb-1">Want early access to this?</p>
          <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
            The first 100 waitlist artists lock in £8/month for life.
          </p>
          <a
            href="#waitlist-demo"
            className="inline-block px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
          >
            Join the waitlist →
          </a>
        </div>
        <div className="mt-6">
          <WaitlistForm id="waitlist-demo" compact />
        </div>
      </section>

      {/* COMPARISON */}
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

      {/* TESTIMONIALS */}
      <section className="max-w-6xl mx-auto px-6 py-12 border-t border-gray-200 dark:border-zinc-800">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-2 text-center">
          Artists are already claiming their spot
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8 max-w-lg mx-auto">
          Real artists, real outcomes. (Placeholder cards — replace with real quotes as they come in.)
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm flex flex-col"
            >
              <p className="text-sm text-gray-700 dark:text-zinc-300 italic flex-1">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 mt-4">
                {t.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={t.photo}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <InitialsAvatar name={t.name} />
                )}
                <div>
                  <p className="text-sm font-bold leading-tight">{t.name}</p>
                  <p className="text-xs text-gray-500">
                    {t.role} · {t.location}
                  </p>
                  <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                    {t.outcome}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CTA after testimonials */}
      <section className="max-w-3xl mx-auto px-6 py-8 border-t border-gray-200 dark:border-zinc-800">
        <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 text-center">
          <p className="font-bold mb-1">Join the artists above.</p>
          <p className="text-sm text-gray-500 mb-4">The first 100 lock in £8/month for life.</p>
          <a
            href="#waitlist-3"
            className="inline-block px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
          >
            Join the waitlist →
          </a>
        </div>
        <div className="mt-6">
          <WaitlistForm id="waitlist-3" compact />
        </div>
      </section>

      {/* FOUNDER NOTE */}
      <section className="max-w-2xl mx-auto px-6 py-12 border-t border-gray-200 dark:border-zinc-800">
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-2xl p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-4">
            A note from the founder
          </p>
          <div className="flex items-start gap-4 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/team/founder.jpg"
              alt="Founder of GRID"
              className="w-16 h-16 rounded-full object-cover flex-shrink-0 border-2 border-emerald-200 dark:border-emerald-800"
            />
            <div>
              <p className="font-bold text-gray-900 dark:text-white">
                [Your Name]
              </p>
              <p className="text-xs text-gray-500">
                Founder, GRID
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed mb-3">
            I built GRID because I watched too many artists — friends, collaborators,
            people whose music I love — pour years into platforms that treated them as
            content, not partners. They built audiences they could never reach, on
            platforms they could never leave.
          </p>
          <p className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed mb-3">
            GRID is my attempt to build the opposite: a platform that wins by giving you
            leverage, not by keeping it. If you ever feel locked in, that's a bug — and
            I want to hear about it.
          </p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            — [Your Name], Founder
          </p>
        </div>
      </section>

      {/* OBJECTIONS */}
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
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
            <p className="font-bold mb-1">"Why should I trust you with my audience?"</p>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              Because we give it back to you, one click, always. Every other platform's
              business model depends on keeping your audience locked in. Ours depends on
              you trusting us enough to stay. If we ever betray that, you leave with your
              list intact — and we know it.
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
            <p className="font-bold mb-1">"I'm not tech-savvy. Is it complicated?"</p>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              No. If you can post a photo on Instagram, you can use GRID. The dashboard is
              one page. The export is one button. The messaging is one box. No setup, no
              integrations, no learning curve.
            </p>
          </div>
        </div>
      </section>

      {/* 3 RELIEF TABLES */}
      <section className="max-w-5xl mx-auto px-6 py-12 border-t border-gray-200 dark:border-zinc-800">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-center">
          What changes when you use GRID
        </h2>

        <div className="mb-8">
          <h3 className="text-lg font-bold mb-3 text-emerald-700 dark:text-emerald-400">
            1. Today → With GRID
          </h3>
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
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold mb-3 text-emerald-700 dark:text-emerald-400">
            2. Before Pro → After Pro
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden">
              <thead className="bg-gray-50 dark:bg-zinc-900">
                <tr>
                  <th className="text-left p-3 font-bold">Before GRID Pro</th>
                  <th className="text-left p-3 font-bold">After GRID Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                {[
                  ["You post, then refresh the app, hoping for engagement", "You check a dashboard that tells you exactly what worked"],
                  ["Your followers are numbers you can't reach", "Your followers are a list you can message or email"],
                  ["You don't know which platform is worth your time", "You know which sources drive real fans and which are noise"],
                  ["You turn away merch sales because of a listing cap", "You sell as much as you want, whenever you want"],
                  ["You have no idea if a collaborator is serious", "You see verified activity signals before you reply"],
                  ["Your 'audience' disappears if an algorithm changes", "Your audience lives in a CSV you can take anywhere"],
                ].map(([before, after], i) => (
                  <tr key={i} className="bg-white dark:bg-zinc-950">
                    <td className="p-3 text-gray-600 dark:text-zinc-400">{before}</td>
                    <td className="p-3 text-emerald-700 dark:text-emerald-400 font-medium">{after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-3 text-emerald-700 dark:text-emerald-400">
            3. Fear → Freedom
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden">
              <thead className="bg-gray-50 dark:bg-zinc-900">
                <tr>
                  <th className="text-left p-3 font-bold">The fear you carry</th>
                  <th className="text-left p-3 font-bold">The freedom GRID gives you</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                {[
                  ["What if the platform changes and I lose my reach?", "You can export your audience and message them directly, any time."],
                  ["What if I'm wasting time on the wrong platform?", "Analytics show you which sources actually convert, so you stop guessing."],
                  ["What if I never make enough to quit my day job?", "Merch, gigs, collabs, and direct messaging give you multiple owned revenue lines."],
                  ["What if a label or collaborator doesn't take me seriously?", "Verified badge and activity signals shortcut the trust problem."],
                  ["What if I burn out before I break through?", "GRID replaces breadth-of-effort with depth-of-relationship. Less posting, more connecting."],
                  ["What if I lose everything I built?", "You won't. Your audience is a file you own, not a number on someone else's server."],
                ].map(([fear, freedom], i) => (
                  <tr key={i} className="bg-white dark:bg-zinc-950">
                    <td className="p-3 text-gray-600 dark:text-zinc-400">{fear}</td>
                    <td className="p-3 text-emerald-700 dark:text-emerald-400 font-medium">{freedom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-12 border-t border-gray-200 dark:border-zinc-800">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-center">
          Questions artists ask before joining
        </h2>
        <div className="space-y-3">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4"
            >
              <summary className="font-bold cursor-pointer text-sm">{f.q}</summary>
              <p className="text-sm text-gray-600 dark:text-zinc-400 mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 5. CTA after FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-8 border-t border-gray-200 dark:border-zinc-800">
        <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 text-center">
          <p className="font-bold mb-1">Still thinking? Join the waitlist and decide later.</p>
          <p className="text-sm text-gray-500 mb-4">No card. No commitment. Just early access when Pro opens.</p>
          <a
            href="#waitlist-4"
            className="inline-block px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
          >
            Join the waitlist →
          </a>
        </div>
        <div className="mt-6">
          <WaitlistForm id="waitlist-4" compact />
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
            href="#waitlist-5"
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

      {/* 6. FINAL CTA */}
      <section className="max-w-3xl mx-auto px-6 py-12 border-t border-gray-200 dark:border-zinc-800">
        <h2 className="text-xl md:text-2xl font-extrabold mb-4 text-center">
          Your audience is yours. Prove it with Pro.
        </h2>
        <WaitlistForm id="waitlist-5" compact />
      </section>
    </main>
  );
}