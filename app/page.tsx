"use client";
import { useState } from "react";
import Link from "next/link";

const VerifiedIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
);
const PlayIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
);
const CheckIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
);
const MicIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 003-3V6a3 3 0 00-6 0v6a3 3 0 003 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 01-14 0v-2M12 19v3m-4 0h8" /></svg>
);
const BuildingIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
);
const MusicIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
);

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("Artists");

  const roles = {
    Artists: ["Vocalists", "Producers", "Songwriters", "Guitarists", "Drummers", "DJs", "Bassists", "Composers"],
    Industry: ["A&Rs", "Labels", "Managers", "Promoters", "Publishers"],
    Venues: ["Clubs", "Festivals", "Bars", "Live Houses", "Theatres"]
  };

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen">

      {/* NAVBAR (public) */}
      <nav className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-4 flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-emerald-600 tracking-tight">GRID</Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-emerald-600">Log in</Link>
            <Link href="/signup" className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2 rounded-full transition-colors">Sign Up Free</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-[#f4f2ee] to-emerald-50 dark:from-emerald-950/20 dark:via-black dark:to-emerald-950/20" />
        <div className="relative max-w-[1128px] mx-auto px-4 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full mb-6">
              The music industry network
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
              Get booked. <br />
              <span className="text-emerald-600">Get paid.</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mt-6 max-w-2xl mx-auto">
              The all-in-one platform for artists, producers, and venues. Find collabs, book gigs, and get paid via secure Escrow.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-10">
              <Link href="/signup" className="bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold px-8 py-4 rounded-xl transition-colors shadow-lg shadow-emerald-600/30">
                Join Free
              </Link>
              <Link href="/artists/ulisses-silva" className="border-2 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 text-base font-bold px-8 py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                See Example EPK
              </Link>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-6 flex items-center justify-center gap-2">
              <CheckIcon className="w-4 h-4 text-emerald-500" /> Free to start · No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* ROLE SELECTOR */}
      <section className="max-w-[1128px] mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Who is GRID for?</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">One platform for the entire music ecosystem.</p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {Object.keys(roles).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${
                activeTab === tab 
                  ? "bg-emerald-600 text-white" 
                  : "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              For {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
          {roles[activeTab as keyof typeof roles].map(role => (
            <div key={role} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 text-center hover:border-emerald-500 transition-colors cursor-pointer">
              <p className="font-bold text-gray-900 dark:text-white text-sm">{role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white dark:bg-zinc-950 py-20">
        <div className="max-w-[1128px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">How it works</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Three steps to your next gig.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: "1", title: "Discover", desc: "Find collabs, gigs, and artists matched to your genre, city, and skillset.", icon: <MicIcon className="w-8 h-8" /> },
              { num: "2", title: "Collaborate", desc: "Chat, share tracks, and create split sheets. Everything in one place.", icon: <MusicIcon className="w-8 h-8" /> },
              { num: "3", title: "Get Paid", desc: "Secure Escrow payments. Funds are held safely until the work is delivered.", icon: <BuildingIcon className="w-8 h-8" /> },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {step.icon}
                </div>
                <div className="text-xs font-bold text-emerald-600 uppercase mb-2">Step {step.num}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU GET (real features, no invented numbers) */}
      <section className="max-w-[1128px] mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Everything in one place</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">The tools working musicians need, built in.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Escrow payments", body: "The client pays up front; you're paid when the work is delivered.", href: "/payments" },
            { title: "Split sheets", body: "Agree who owns what before release, signed by everyone on the track.", href: "/splits" },
            { title: "Licence deals", body: "License your tracks to creators and brands with a standard agreement.", href: "/licensing" },
            { title: "Release builder", body: "Get your next release store-ready, with checks for artwork and metadata.", href: "/distribution" },
          ].map((f) => (
            <Link key={f.title} href={f.href} className="block bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-zinc-800 hover:border-emerald-500 transition-colors">
              <p className="font-bold text-gray-900 dark:text-white">{f.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{f.body}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* PRICING TEASER */}
      <section className="max-w-[1128px] mx-auto px-4 py-20">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl p-8 md:p-16 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to get paid?</h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">Join artists, producers and venues on GRID. Free to start. Upgrade to GRID Pro when you're ready to book gigs.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/signup" className="bg-white text-emerald-700 font-bold px-8 py-4 rounded-xl hover:bg-emerald-50 transition-colors shadow-lg">
              Create Free Account
            </Link>
            <Link href="/premium" className="border-2 border-white/30 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors">
              View Pricing
            </Link>
          </div>
          <p className="text-xs text-emerald-200 mt-6 flex items-center justify-center gap-2">
            <CheckIcon className="w-4 h-4" /> No credit card required to start
          </p>
        </div>
      </section>

    </div>
  );
}