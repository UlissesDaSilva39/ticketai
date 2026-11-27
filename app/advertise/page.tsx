"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BarChart3, Check, ExternalLink, ImagePlus, Megaphone, ShieldCheck, Target, X } from "lucide-react";
import { AD_PLANS, type AdPlan } from "@/lib/ads/catalog";
import { uploadMedia } from "@/components/grid/media";

const gbp = (p: number) => `£${(p / 100).toFixed(p % 100 ? 2 : 0)}`;
const input =
  "w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500";
const label = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5";

const PLANS: { id: AdPlan | "enterprise"; name: string; price: string; per: string; blurb: string; features: string[]; popular?: boolean }[] = [
  {
    id: "basic",
    name: "Basic",
    price: gbp(AD_PLANS.basic.pence),
    per: `/ ${AD_PLANS.basic.days} days`,
    blurb: "A single event, release or offer.",
    features: ["Sponsored card on GRID home pages", `Runs for ${AD_PLANS.basic.days} days`, "Views and clicks report", "Reviewed within 24 hours"],
  },
  {
    id: "premium",
    name: "Premium",
    price: gbp(AD_PLANS.premium.pence),
    per: `/ ${AD_PLANS.premium.days} days`,
    blurb: "For promoters, venues, labels and brands.",
    features: ["Everything in Basic", `Runs for ${AD_PLANS.premium.days} days`, "Shown twice as often as Basic", "Views and clicks report"],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    per: "",
    blurb: "Festivals, brands and big campaigns.",
    features: ["Homepage takeover", "Newsletter features", "Campaign planning with our team"],
  },
];

function AdvertiseInner() {
  const sp = useSearchParams();
  const [plan, setPlan] = useState<AdPlan | null>(null);
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [contact, setContact] = useState({ name: "", email: "", promote: "", newsletter: false });
  const [sent, setSent] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const cancelled = sp.get("ad") === "cancelled";

  useEffect(() => {
    if (plan) document.getElementById("launch")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [plan]);

  async function onFile(f: File | undefined) {
    if (!f) return;
    if (!f.type.startsWith("image/")) return setError("Choose an image (JPG, PNG or WebP).");
    setError("");
    setUploading(true);
    try {
      const up = await uploadMedia(f);
      setImage(up.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function launch(e: React.FormEvent) {
    e.preventDefault();
    if (!plan) return;
    setError("");
    setBusy(true);
    const r = await fetch("/api/ads/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ plan, headline, body, linkUrl: link, imageUrl: image }),
    });
    const d = await r.json().catch(() => ({}));
    if (r.status === 401) return void (window.location.href = "/login?redirect=/advertise");
    if (r.ok && d.url) return void (window.location.href = d.url);
    setError(d.error || "Couldn't start checkout.");
    setBusy(false);
  }

  async function sendContact(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const r = await fetch("/api/advertise", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...contact, plan: "Enterprise" }) });
    setBusy(false);
    if (r.ok) setSent(true);
    else setError("Something went wrong. Please try again.");
  }

  let host = "";
  try {
    host = link ? new URL(link).hostname.replace(/^www\./, "") : "";
  } catch {}

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-950 pb-20">
      <section className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-zinc-950 text-white px-4 py-16 sm:py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wide">
            <Megaphone className="w-3.5 h-3.5" aria-hidden="true" /> GRID Ads
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mt-4">Put your music business in front of the industry</h1>
          <p className="text-lg text-emerald-50/90 mt-4">Artists, producers, DJs, promoters, venues and labels use GRID every day. Launch a sponsored ad in minutes and pay by card.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#plans" className="px-6 py-3 rounded-full bg-white text-emerald-800 font-bold hover:bg-emerald-50 transition-colors">See plans</a>
            <Link href="/boost" className="px-6 py-3 rounded-full border border-white/40 font-bold hover:bg-white/10 transition-colors">Boost a post from £2.99</Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4">
        {cancelled && <p role="status" className="mt-6 rounded-xl bg-gray-100 dark:bg-zinc-800 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Payment cancelled. You haven&apos;t been charged.</p>}

        <div className="grid gap-4 sm:grid-cols-3 mt-10">
          {[
            [Target, "Reach the right people", "Shown to music professionals and fans on GRID, not random traffic."],
            [ShieldCheck, "Reviewed, then live", "Our team checks each ad within 24 hours. If we can't run it, you get a full refund."],
            [BarChart3, "See what it did", "Track views and clicks for every campaign in your ads dashboard."],
          ].map(([Icon, t, d]) => {
            const I = Icon as typeof Target;
            return (
              <div key={t as string} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5">
                <span className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 grid place-items-center mb-3" aria-hidden="true"><I className="w-5 h-5" /></span>
                <p className="font-bold text-gray-900 dark:text-white">{t as string}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{d as string}</p>
              </div>
            );
          })}
        </div>

        <h2 id="plans" className="text-3xl font-bold text-gray-900 dark:text-white text-center mt-16">Choose your plan</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mt-2">One-off payment. No contract.</p>
        <div className="grid gap-6 md:grid-cols-3 mt-8">
          {PLANS.map((p) => (
            <div key={p.id} className={`relative bg-white dark:bg-zinc-900 rounded-2xl border-2 p-6 flex flex-col ${p.popular ? "border-emerald-600 shadow-xl" : "border-gray-200 dark:border-zinc-800"}`}>
              {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold">MOST POPULAR</span>}
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{p.name}</h3>
              <p className="text-sm text-gray-500">{p.blurb}</p>
              <p className="my-5"><span className="text-4xl font-bold text-gray-900 dark:text-white">{p.price}</span> <span className="text-sm text-gray-500">{p.per}</span></p>
              <ul className="space-y-2 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 text-emerald-600 flex-none mt-0.5" aria-hidden="true" /> {f}
                  </li>
                ))}
              </ul>
              {p.id === "enterprise" ? (
                <a href="#contact" className="mt-6 block text-center py-3 rounded-full font-bold border-2 border-emerald-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">Talk to us</a>
              ) : (
                <button type="button" onClick={() => setPlan(p.id as AdPlan)} className={`mt-6 py-3 rounded-full font-bold transition-colors ${plan === p.id ? "bg-emerald-800 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"}`}>
                  {plan === p.id ? "Selected" : `Launch ${p.name} ad`}
                </button>
              )}
            </div>
          ))}
        </div>

        {plan && (
          <section id="launch" className="mt-12 scroll-mt-24 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create your {AD_PLANS[plan].name} ad</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{gbp(AD_PLANS[plan].pence)} for {AD_PLANS[plan].days} days. Starts once approved (within 24 hours).</p>
              </div>
              <button type="button" onClick={() => setPlan(null)} aria-label="Close" className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800"><X className="w-5 h-5" aria-hidden="true" /></button>
            </div>
            <div className="grid gap-8 lg:grid-cols-[1fr_320px] mt-6">
              <form onSubmit={launch} className="space-y-4">
                <div>
                  <label htmlFor="ad-headline" className={label}>Headline *</label>
                  <input id="ad-headline" value={headline} onChange={(e) => setHeadline(e.target.value)} maxLength={80} placeholder="e.g. Tickets out now: Night Drive, London 12 Dec" className={input} />
                </div>
                <div>
                  <label htmlFor="ad-body" className={label}>Text</label>
                  <textarea id="ad-body" value={body} onChange={(e) => setBody(e.target.value)} maxLength={200} rows={3} placeholder="One or two lines about your offer" className={input} />
                  <p className="text-xs text-gray-500 mt-1">{200 - body.length} characters left</p>
                </div>
                <div>
                  <label htmlFor="ad-link" className={label}>Link *</label>
                  <input id="ad-link" value={link} onChange={(e) => setLink(e.target.value)} inputMode="url" placeholder="https://…" className={input} />
                </div>
                <div>
                  <span className={label}>Image</span>
                  <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} aria-label="Ad image" />
                  <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-300 dark:border-zinc-700 text-sm font-bold text-gray-700 dark:text-gray-200 hover:border-emerald-500">
                    <ImagePlus className="w-4 h-4" aria-hidden="true" /> {uploading ? "Uploading…" : image ? "Change image" : "Upload image"}
                  </button>
                  {image && <button type="button" onClick={() => setImage(null)} className="ml-3 text-sm font-semibold text-red-700 dark:text-red-400">Remove</button>}
                </div>
                {error && <p role="alert" className="rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 p-3 text-sm">{error}</p>}
                <button type="submit" disabled={busy || uploading} className="w-full py-4 rounded-full font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 transition-colors">
                  {busy ? "Opening secure checkout…" : `Pay ${gbp(AD_PLANS[plan].pence)} & submit for review`}
                </button>
                <p className="text-xs text-gray-500 text-center">Secure payment by Stripe. Full refund if we can&apos;t approve your ad. No adult, gambling, misleading or illegal content.</p>
              </form>

              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Preview</p>
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                  <p className="px-4 pt-3 text-[11px] font-bold uppercase tracking-wide text-gray-500">Sponsored</p>
                  <div className="p-4">
                    {image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image} alt="" className="w-full aspect-[16/9] object-cover rounded-lg mb-3" />
                    )}
                    <p className="font-bold text-gray-900 dark:text-white">{headline || "Your headline"}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{body || "Your text appears here."}</p>
                    <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 dark:text-emerald-400">{host || "yourwebsite.com"} <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /></p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <p className="text-center mt-10">
          <Link href="/advertise/campaigns" className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline">See my campaigns →</Link>
        </p>

        <section id="contact" className="mt-12 scroll-mt-24 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 sm:p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Planning something bigger?</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mt-1">Tell us about your campaign and we&apos;ll reply within 24 hours.</p>
          {sent ? (
            <p role="status" className="mt-6 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-200 p-4 text-center font-semibold">Thanks! We&apos;ll be in touch within 24 hours.</p>
          ) : (
            <form onSubmit={sendContact} className="mt-6 space-y-4">
              <div>
                <label htmlFor="c-name" className={label}>Your name</label>
                <input id="c-name" required value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} className={input} />
              </div>
              <div>
                <label htmlFor="c-email" className={label}>Email</label>
                <input id="c-email" required type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className={input} />
              </div>
              <div>
                <label htmlFor="c-what" className={label}>What do you want to promote?</label>
                <select id="c-what" required value={contact.promote} onChange={(e) => setContact({ ...contact, promote: e.target.value })} className={input}>
                  <option value="">Select an option</option>
                  <option value="Event">An event or festival</option>
                  <option value="Venue">A venue</option>
                  <option value="Brand">A brand</option>
                  <option value="Artist">An artist or label</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input type="checkbox" checked={contact.newsletter} onChange={(e) => setContact({ ...contact, newsletter: e.target.checked })} className="w-4 h-4 accent-emerald-600" />
                I&apos;m also interested in a GRID newsletter feature
              </label>
              <button type="submit" disabled={busy} className="w-full py-3.5 rounded-full font-bold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 disabled:opacity-60">{busy ? "Sending…" : "Send"}</button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}

export default function AdvertisePage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-gray-50 dark:bg-zinc-950" />}>
      <AdvertiseInner />
    </Suspense>
  );
}
