"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AGREEMENT_VERSION,
  LICENCE_INFO,
  LICENCE_TYPES,
  buildAgreement,
  formatGbp,
  gridFeeFor,
  todayUtc,
  type LicenceType,
  type ListingPrices,
} from "@/lib/licensing/agreement";

type Listing = {
  id: string;
  trackTitle: string;
  artistName: string;
  genre: string | null;
  isrc: string | null;
  composer: string;
  publisher: string | null;
  description: string | null;
  coverUrl: string | null;
  previewUrl: string | null;
  prices: ListingPrices;
  dealsCount: number;
  active: boolean;
  feeRate: number;
};

const CheckIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const input =
  "w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500";

export default function DealForm({
  listing,
  licensorName,
  viewer,
  initialType,
}: {
  listing: Listing;
  licensorName: string;
  viewer: { signedIn: boolean; isOwner: boolean };
  initialType: LicenceType | null;
}) {
  const offered = LICENCE_TYPES.filter((t) => listing.prices[t] != null);
  const [type, setType] = useState<LicenceType | null>(initialType && offered.includes(initialType) ? initialType : offered[0] ?? null);
  const [projectTitle, setProjectTitle] = useState("");
  const [legalName, setLegalName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const amount = type ? listing.prices[type] ?? 0 : 0;
  const fee = gridFeeFor(amount, listing.feeRate);
  const total = amount + fee;

  const agreement = useMemo(
    () =>
      type
        ? buildAgreement({
            licenceType: type,
            trackTitle: listing.trackTitle,
            artistName: listing.artistName,
            isrc: listing.isrc,
            composer: listing.composer,
            publisher: listing.publisher,
            licensorName,
            licenseeName: legalName.trim() || "[your full legal name]",
            projectTitle: projectTitle.trim() || "[your project]",
            licenceFeePence: amount,
            effectiveDate: todayUtc(),
            feeRate: listing.feeRate,
          })
        : "",
    [type, listing, licensorName, legalName, projectTitle, amount]
  );

  const ready = !!type && projectTitle.trim().length >= 2 && legalName.trim().length >= 2 && agreed;

  async function agreeAndPay(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!type) return setError("Choose a licence type.");
    if (projectTitle.trim().length < 2) return setError("Tell us the name of your project.");
    if (legalName.trim().length < 2) return setError("Type your full legal name to sign.");
    if (!agreed) return setError("Please tick the box to accept the licence agreement.");
    setBusy(true);
    try {
      const res = await fetch("/api/licensing/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ listingId: listing.id, licenceType: type, projectTitle, legalName, agreed, agreementVersion: AGREEMENT_VERSION }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.error || "Could not start checkout.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout.");
      setBusy(false);
    }
  }

  const loginHref = `/login?redirect=${encodeURIComponent(`/licensing/deal/${listing.id}${type ? `?licence=${type}` : ""}`)}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px] items-start">
      {/* LEFT: track, licence choice, project, agreement */}
      <form id="deal-form" onSubmit={agreeAndPay} className="space-y-6 min-w-0">
        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 sm:p-6 flex gap-4 items-start">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-800 flex-none overflow-hidden flex items-center justify-center text-white text-3xl">
            {listing.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={listing.coverUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span aria-hidden="true">♫</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Licence deal</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white break-words">{listing.trackTitle}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {listing.artistName}
              {listing.genre ? ` · ${listing.genre}` : ""}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Licensed by {licensorName}
              {listing.dealsCount > 0 ? ` · ${listing.dealsCount} licence${listing.dealsCount === 1 ? "" : "s"} issued` : ""}
            </p>
            {listing.previewUrl && (
              <a href={listing.previewUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">
                ▶ Listen to a preview
              </a>
            )}
            {listing.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{listing.description}</p>}
          </div>
        </section>

        {!listing.active && (
          <p className="rounded-xl bg-gray-100 dark:bg-zinc-900 px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
            This track isn&apos;t available to licence right now.
          </p>
        )}

        <fieldset className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 sm:p-6">
          <legend className="sr-only">Choose a licence</legend>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">1. Choose your licence</h2>
          <p className="text-sm text-gray-500 mb-4">All licences are non-exclusive and cover one project.</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {LICENCE_TYPES.map((t) => {
              const price = listing.prices[t];
              const info = LICENCE_INFO[t];
              const selected = type === t;
              const disabled = price == null;
              return (
                <label
                  key={t}
                  className={`relative rounded-xl border-2 p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-500 ${
                    disabled
                      ? "opacity-50 cursor-not-allowed border-gray-200 dark:border-zinc-800"
                      : selected
                        ? "cursor-pointer border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"
                        : "cursor-pointer border-gray-200 dark:border-zinc-700 hover:border-emerald-300"
                  }`}
                >
                  <input type="radio" name="licence" value={t} checked={selected} disabled={disabled} onChange={() => setType(t)} className="sr-only" />
                  <span className="block font-bold text-gray-900 dark:text-white">{info.name}</span>
                  <span className="block text-xl font-bold text-gray-900 dark:text-white mt-1">{price != null ? formatGbp(price) : "Not offered"}</span>
                  <span className="block text-xs text-gray-600 dark:text-gray-400 mt-2">{info.short}</span>
                  <span className="block text-xs text-gray-500 mt-1">{info.examples}</span>
                  {selected && (
                    <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <CheckIcon className="w-3 h-3" />
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>

        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">2. Your project</h2>
          <label htmlFor="project" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Project name
          </label>
          <input
            id="project"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            maxLength={200}
            placeholder="e.g. Summer Lookbook 2027 (YouTube)"
            className={input}
          />
          <p className="text-xs text-gray-500 mt-1.5">The licence covers this one project only.</p>
        </section>

        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">3. Review and sign the agreement</h2>
          <p className="text-sm text-gray-500 mb-4">
            GRID Standard Music Licence · {AGREEMENT_VERSION}. Your details fill in as you type.
          </p>
          <div
            tabIndex={0}
            role="region"
            aria-label="Licence agreement"
            className="h-80 overflow-y-auto rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 p-4 text-[13px] leading-relaxed text-gray-800 dark:text-gray-300 whitespace-pre-wrap font-[ui-serif,Georgia,serif] focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {agreement || "Choose a licence to see the agreement."}
          </div>

          <label htmlFor="legal-name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mt-5 mb-1.5">
            Full legal name (your signature)
          </label>
          <input
            id="legal-name"
            value={legalName}
            onChange={(e) => setLegalName(e.target.value)}
            maxLength={200}
            autoComplete="name"
            placeholder="e.g. Jane Smith, or Acme Studios Ltd"
            className={`${input} font-[ui-serif,Georgia,serif] text-lg`}
          />
          <p className="text-xs text-gray-500 mt-1.5">If you&apos;re licensing for a company, enter the company&apos;s registered name.</p>

          <label className="mt-5 flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-5 h-5 accent-emerald-600 flex-none"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              I have read and agree to the <strong>GRID Standard Music Licence ({type ? LICENCE_INFO[type].name : "licence"})</strong> above,
              and I understand that typing my name and paying has the same effect as signing it.
            </span>
          </label>
        </section>
      </form>

      {/* RIGHT: summary + action */}
      <aside className="lg:sticky lg:top-20 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Deal summary</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Licence</dt>
            <dd className="font-semibold text-gray-900 dark:text-white text-right">{type ? LICENCE_INFO[type].name : "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Term</dt>
            <dd className="text-gray-900 dark:text-white text-right">{type === "commercial" ? "12 months" : type ? "Perpetual" : "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Territory</dt>
            <dd className="text-gray-900 dark:text-white">Worldwide</dd>
          </div>
          <div className="border-t border-gray-200 dark:border-zinc-800 my-3" />
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Licence fee (to {licensorName})</dt>
            <dd className="text-gray-900 dark:text-white">{formatGbp(amount)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">GRID fee ({Math.round(listing.feeRate * 100)}%)</dt>
            <dd className="text-gray-900 dark:text-white">{formatGbp(fee)}</dd>
          </div>
          <div className="flex justify-between gap-4 text-base pt-1">
            <dt className="font-bold text-gray-900 dark:text-white">Total</dt>
            <dd className="font-bold text-gray-900 dark:text-white">{formatGbp(total)}</dd>
          </div>
        </dl>

        <ul className="mt-5 space-y-2 text-xs text-gray-600 dark:text-gray-400">
          {["Secure payment by Stripe", "Instant download of the full-quality track", "Signed agreement saved to your account"].map((t) => (
            <li key={t} className="flex gap-2">
              <CheckIcon className="w-4 h-4 text-emerald-600 flex-none" />
              {t}
            </li>
          ))}
        </ul>

        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 p-3 text-sm">
            {error}
          </p>
        )}

        {viewer.isOwner ? (
          <p className="mt-5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-3 text-sm text-emerald-800 dark:text-emerald-300">
            This is your track. Share this page&apos;s link with anyone who wants to licence it.
          </p>
        ) : !viewer.signedIn ? (
          <Link href={loginHref} className="mt-5 block text-center w-full py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700">
            Log in to licence this track
          </Link>
        ) : (
          <button
            type="submit"
            form="deal-form"
            disabled={busy || !listing.active || !type}
            className={`mt-5 w-full py-3.5 rounded-xl font-bold text-white transition-colors ${
              ready ? "bg-emerald-600 hover:bg-emerald-700" : "bg-emerald-600/50"
            } disabled:opacity-60`}
          >
            {busy ? "Opening secure payment…" : `Agree & pay ${formatGbp(total)}`}
          </button>
        )}
        <p className="mt-3 text-[11px] text-gray-500 text-center">
          Your licence starts once payment clears. Questions? <a href="mailto:licensing@grid.app" className="underline">licensing@grid.app</a>
        </p>
      </aside>
    </div>
  );
}
