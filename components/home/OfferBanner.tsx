"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Offer = { id: string; text: string; cta: string; href: string };

// EDIT THESE. Keep every claim true: no fake countdowns, fake scarcity or invented numbers.
const OFFERS: Offer[] = [
  { id: "pro", text: "Try GRID Pro free for 30 days", cta: "Start free trial", href: "/pro" },
  { id: "escrow", text: "Get paid safely with Escrow protection", cta: "See how it works", href: "/payments" },
  { id: "licensing", text: "Earn from licensing and royalty splits", cta: "Explore licensing", href: "/licensing" },
  { id: "verified", text: "Get verified and build trust", cta: "Get verified", href: "/verify" },
];

const STORAGE_KEY = "grid_offer_banner_dismissed";

export default function OfferBanner() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") setDismissed(true);
    } catch {}
    try {
      setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    } catch {}
  }, []);

  useEffect(() => {
    if (dismissed || paused || reduced || OFFERS.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % OFFERS.length), 6000);
    return () => clearInterval(t);
  }, [dismissed, paused, reduced]);

  function dismiss() {
    setDismissed(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  }

  if (dismissed) return null;
  const offer = OFFERS[index];

  return (
    <div
      role="region"
      aria-label="GRID offers"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="sticky top-16 z-30 w-full bg-gradient-to-r from-amber-400 to-orange-400 text-neutral-900 shadow"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-1 text-xs">
        <button
          type="button"
          aria-label="Previous offer"
          onClick={() => setIndex((i) => (i - 1 + OFFERS.length) % OFFERS.length)}
          className="hidden px-1 text-base leading-none opacity-70 hover:opacity-100 sm:block"
        >
          &lsaquo;
        </button>

        <p key={offer.id} className="flex-1 truncate font-medium">
          {offer.text}
        </p>

        <Link
          href={offer.href}
          data-cta={"offer-banner-" + offer.id}
          className="shrink-0 rounded-full bg-neutral-900 px-3 py-0.5 text-xs font-semibold text-white hover:bg-neutral-700"
        >
          {offer.cta} &rarr;
        </Link>

        <button
          type="button"
          aria-label="Next offer"
          onClick={() => setIndex((i) => (i + 1) % OFFERS.length)}
          className="hidden px-1 text-base leading-none opacity-70 hover:opacity-100 sm:block"
        >
          &rsaquo;
        </button>

        <div className="hidden items-center gap-1 md:flex" aria-hidden="true">
          {OFFERS.map((o, i) => (
            <span key={o.id} className={"h-1.5 w-1.5 rounded-full " + (i === index ? "bg-neutral-900" : "bg-neutral-900/30")} />
          ))}
        </div>

        <button
          type="button"
          aria-label="Dismiss offers"
          onClick={dismiss}
          className="px-1 text-base leading-none opacity-70 hover:opacity-100"
        >
          &times;
        </button>
      </div>
    </div>
  );
}