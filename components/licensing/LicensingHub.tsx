"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { LICENCE_INFO, LICENCE_TYPES, formatGbp, gridFeeFor } from "@/lib/licensing/agreement";
import TrackBrowser from "./TrackBrowser";
import MyLicences from "./MyLicences";
import ProgrammeSection from "./ProgrammeSection";
import NewListingForm from "@/app/licensing/new/NewListingForm";
import { HUB_TABS, type HubTab } from "./tabs";


const TAB_LABEL: Record<HubTab, string> = {
  browse: "Find music",
  sell: "Sell your music",
  mine: "My licences",
  programme: "GRID Programme",
};

const CheckIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const card = "bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 sm:p-6";

const TRUST = [
  "Signed licence agreement in seconds",
  "Secure card payments by Stripe",
  "Artists keep 100% of their licence fee",
  "Non-exclusive: artists keep their rights",
];

const BUYER_STEPS = [
  ["Pick a track", "Search by mood, genre or artist and preview it."],
  ["Choose your licence", "Creator, Commercial or Sync, priced up front."],
  ["Sign and pay", "Tick, type your name and pay by card. Download instantly."],
];

const SELLER_STEPS = [
  ["List your track", "Upload the full-quality file and confirm you own the rights."],
  ["Set your prices", "Choose which licences to offer and what each costs."],
  ["Get paid", "Every deal adds to your seller balance. Withdraw any time after 7 days."],
];

const BUYER_FAQ = [
  ["What can I use the music for?", "It depends on the licence: Creator covers one online video, podcast or stream (monetised); Commercial covers one brand or ad campaign for 12 months; Sync covers one film, TV show, game or documentary in all media. The full terms are shown before you pay."],
  ["Is the music really cleared?", "Every artist confirms they own or control the recording and the song before listing, and the licence includes their promise and an indemnity if that's untrue. Report any problem to licensing@grid.app."],
  ["What if I get a Content ID claim?", "The licence requires the artist to release content-ID claims for your project. Send them, or us, your licence number and we'll get it cleared."],
  ["What do I get after paying?", "An instant download of the full-quality track and the signed agreement in your account, which you can save as a PDF."],
  ["Can I get a refund?", "Contact licensing@grid.app if the file is faulty or there's a rights problem. A refunded licence ends, so stop new uses of the track."],
];

const SELLER_FAQ = [
  ["What does it cost to list?", "Nothing. Buyers pay a 10% GRID fee on top of your price, so you receive 100% of the licence fee you set."],
  ["Do I give away my rights?", "No. Every licence is non-exclusive and for one project. You keep ownership and can keep releasing and licensing the track. If you're signed exclusively to a label or music library, check your contract first."],
  ["When do I get paid?", "Each licence adds to your GRID seller balance. Earnings clear after 7 days and you can withdraw from your seller dashboard."],
  ["What about PRS royalties?", "Licences don't touch your performance royalties. Keep your tracks registered with PRS for Music and PPL as usual."],
];

function Faq({ items }: { items: string[][] }) {
  return (
    <div className="divide-y divide-gray-200 dark:divide-zinc-800">
      {items.map(([q, a]) => (
        <details key={q} className="group py-3">
          <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-semibold text-gray-900 dark:text-white text-sm">
            {q}
            <span className="text-emerald-600 text-lg leading-none transition-transform group-open:rotate-45" aria-hidden="true">+</span>
          </summary>
          <p className="text-sm text-gray-600 dark:text-zinc-400 mt-2">{a}</p>
        </details>
      ))}
    </div>
  );
}

function Steps({ steps }: { steps: string[][] }) {
  return (
    <ol className="grid gap-4 sm:grid-cols-3">
      {steps.map(([t, d], i) => (
        <li key={t} className="flex gap-3">
          <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
          <div>
            <p className="font-semibold text-sm text-gray-900 dark:text-white">{t}</p>
            <p className="text-xs text-gray-600 dark:text-zinc-400">{d}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function EarningsCalculator() {
  const [price, setPrice] = useState(49);
  const [deals, setDeals] = useState(5);
  const pence = price * 100;
  return (
    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 sm:p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Earnings calculator</h3>
      <p className="text-xs text-gray-600 dark:text-zinc-400 mb-4">An example, not a forecast: what you'd earn at a given price and number of licences.</p>
      <label htmlFor="calc-price" className="flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-300">
        Your licence price <span>{formatGbp(pence)}</span>
      </label>
      <input id="calc-price" type="range" min={5} max={500} step={5} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full accent-emerald-600 mb-4" />
      <label htmlFor="calc-deals" className="flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-300">
        Licences per month <span>{deals}</span>
      </label>
      <input id="calc-deals" type="range" min={1} max={50} value={deals} onChange={(e) => setDeals(Number(e.target.value))} className="w-full accent-emerald-600" />
      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs text-gray-600 dark:text-zinc-400">You&apos;d earn per month</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatGbp(pence * deals)}</p>
        </div>
        <p className="text-xs text-gray-600 dark:text-zinc-400 text-right">
          Buyer pays {formatGbp(pence + gridFeeFor(pence))}
          <br />
          (incl. 10% GRID fee)
        </p>
      </div>
    </div>
  );
}

export default function LicensingHub({ initialTab }: { initialTab: HubTab }) {
  const [tab, setTab] = useState<HubTab>(initialTab);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => setSignedIn(!!data.user))
      .catch(() => setSignedIn(false));
  }, []);

  const go = (t: HubTab) => {
    setTab(t);
    try {
      window.history.replaceState(null, "", t === "browse" ? "/licensing" : `/licensing?tab=${t}`);
    } catch {
      /* ignore */
    }
    tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const sellLogin = `/login?redirect=${encodeURIComponent("/licensing?tab=sell")}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-xs font-semibold text-gray-500 hover:text-emerald-600 mb-6 inline-block">
          ← Back to GRID
        </Link>

        {/* HERO */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-4 py-1.5 rounded-full text-xs font-bold mb-4">
            GRID Music Licensing
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Licence music. <span className="text-emerald-600">Get paid for yours.</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Cleared tracks from independent artists for videos, ads, films and games, with a signed agreement in seconds.
            Artists set their price and keep every penny of it.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
            <button type="button" onClick={() => go("browse")} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg shadow-emerald-600/30">
              Find music to licence
            </button>
            <button type="button" onClick={() => go("sell")} className="border-2 border-gray-300 dark:border-zinc-700 text-gray-800 dark:text-gray-200 font-bold px-8 py-4 rounded-xl hover:bg-white dark:hover:bg-zinc-900 transition-colors">
              Licence my tracks
            </button>
          </div>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6">
            {TRUST.map((t) => (
              <li key={t} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-zinc-400">
                <CheckIcon className="w-4 h-4 text-emerald-600" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* TABS */}
        <div ref={tabsRef} className="sticky top-16 z-20 -mx-4 px-4 py-3 bg-gray-50/95 dark:bg-zinc-950/95 backdrop-blur mb-6 scroll-mt-16">
          <div role="tablist" aria-label="Licensing sections" className="flex gap-2 overflow-x-auto">
            {HUB_TABS.map((t) => (
              <button
                key={t}
                role="tab"
                id={`tab-${t}`}
                aria-selected={tab === t}
                aria-controls={`panel-${t}`}
                onClick={() => go(t)}
                className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                  tab === t
                    ? "bg-emerald-600 text-white"
                    : "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-300 hover:border-emerald-400"
                }`}
              >
                {TAB_LABEL[t]}
              </button>
            ))}
          </div>
        </div>

        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
          {/* FIND MUSIC */}
          {tab === "browse" && (
            <div className="space-y-8">
              <TrackBrowser onSell={() => go("sell")} />

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Which licence do I need?</h2>
                <div className="grid gap-4 md:grid-cols-3">
                  {LICENCE_TYPES.map((t) => {
                    const i = LICENCE_INFO[t];
                    return (
                      <div key={t} className={card}>
                        <p className="font-bold text-gray-900 dark:text-white">{i.name}</p>
                        <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">{i.short}</p>
                        <ul className="mt-3 space-y-1.5 text-xs text-gray-600 dark:text-zinc-400">
                          <li className="flex gap-2"><CheckIcon className="w-4 h-4 text-emerald-600 flex-none" />{i.examples}</li>
                          <li className="flex gap-2"><CheckIcon className="w-4 h-4 text-emerald-600 flex-none" />Worldwide · {t === "commercial" ? "12 months" : "perpetual for your project"}</li>
                          <li className="flex gap-2 text-gray-500"><span className="w-4 flex-none text-center" aria-hidden="true">✕</span>Not for {i.excluded}</li>
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className={card}>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How licensing works</h2>
                <Steps steps={BUYER_STEPS} />
              </section>

              <section className={card}>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Questions from buyers</h2>
                <Faq items={BUYER_FAQ} />
              </section>
            </div>
          )}

          {/* SELL */}
          {tab === "sell" && (
            <div className="space-y-8">
              <div className="grid gap-6 lg:grid-cols-[1fr_360px] items-start">
                <section className={card}>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Licence your tracks to creators, brands and filmmakers</h2>
                  <p className="text-gray-600 dark:text-zinc-400 mt-2">
                    One track can earn again and again. You set the price for each licence, GRID handles the agreement, payment and delivery.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-zinc-300">
                    {[
                      "Free to list. You receive 100% of your licence fee",
                      "Non-exclusive: keep releasing and streaming your music",
                      "Buyers sign a standard agreement before they pay",
                      "Paid into your GRID seller balance, withdraw any time after 7 days",
                    ].map((t) => (
                      <li key={t} className="flex gap-2">
                        <CheckIcon className="w-4 h-4 text-emerald-600 flex-none mt-0.5" />
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Steps steps={SELLER_STEPS} />
                  </div>
                </section>
                <EarningsCalculator />
              </div>

              <section id="list-track">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">List a track</h2>
                {signedIn === null ? (
                  <p className="text-gray-500 py-8 text-center">Loading…</p>
                ) : signedIn ? (
                  <NewListingForm embedded />
                ) : (
                  <div className={`${card} text-center`}>
                    <p className="font-semibold text-gray-900 dark:text-white">Log in or join free to list your music</p>
                    <p className="text-sm text-gray-500 mt-1">It takes about 2 minutes once you have your audio file ready.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
                      <Link href={sellLogin} className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700">
                        Log in to list a track
                      </Link>
                      <Link href="/signup" className="px-5 py-2.5 rounded-xl font-bold text-sm border border-gray-300 dark:border-zinc-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800">
                        Join GRID free
                      </Link>
                    </div>
                  </div>
                )}
              </section>

              <section className={card}>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Questions from artists</h2>
                <Faq items={SELLER_FAQ} />
              </section>
            </div>
          )}

          {/* MY LICENCES */}
          {tab === "mine" && <MyLicences signedIn={signedIn} onBrowse={() => go("browse")} onSell={() => go("sell")} />}

          {/* GRID PROGRAMME (licensing to GRID itself + rights reference) */}
          {tab === "programme" && <ProgrammeSection />}
        </div>

        {/* CLOSING CTA */}
        {tab !== "mine" && (
          <div className="mt-10 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center gap-6 justify-between">
            <div>
              <h2 className="text-2xl font-bold">Your music could be in someone&apos;s next video.</h2>
              <p className="text-emerald-50/90 mt-1 text-sm">List a track in minutes. Free to list, non-exclusive, paid by card.</p>
            </div>
            <button type="button" onClick={() => go("sell")} className="flex-none px-6 py-3 rounded-xl font-bold bg-white text-emerald-800 hover:bg-emerald-50">
              Licence my tracks
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
