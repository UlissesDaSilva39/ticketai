"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LICENCE_INFO, LICENCE_TYPES, formatGbp, gridFeeFor, type LicenceType } from "@/lib/licensing/agreement";

const SUGGESTED: Record<LicenceType, string> = { creator: "29", commercial: "199", sync: "499" };

const input =
  "w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500";
const label = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5";

export default function NewListingForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    trackTitle: "",
    artistName: "",
    genre: "",
    composer: "",
    publisher: "",
    isrc: "",
    description: "",
    previewUrl: "",
    coverUrl: "",
  });
  const [enabled, setEnabled] = useState<Record<LicenceType, boolean>>({ creator: true, commercial: true, sync: false });
  const [prices, setPrices] = useState<Record<LicenceType, string>>(SUGGESTED);
  const [file, setFile] = useState<File | null>(null);
  const [rights, setRights] = useState({ master: false, composition: false, samples: false });
  const [busy, setBusy] = useState<"" | "uploading" | "saving">("");
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const pence = (t: LicenceType) => Math.round(parseFloat(prices[t] || "0") * 100);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.trackTitle.trim() || !form.artistName.trim() || !form.composer.trim()) return setError("Fill in the track title, artist and composer.");
    const chosen = LICENCE_TYPES.filter((t) => enabled[t]);
    if (!chosen.length) return setError("Offer at least one licence type.");
    for (const t of chosen) {
      const p = pence(t);
      if (!(p >= 100 && p <= 500000)) return setError(`${LICENCE_INFO[t].name}: price must be between £1 and £5,000.`);
    }
    if (!file) return setError("Upload the full-quality track (WAV, FLAC, AIFF or MP3, under 50 MB).");
    if (!rights.master || !rights.composition || !rights.samples) return setError("Please confirm all three rights statements.");

    try {
      setBusy("uploading");
      const urlRes = await fetch("/api/marketplace/file-url", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ contentType: file.type, size: file.size, name: file.name }),
      });
      const t = await urlRes.json();
      if (!urlRes.ok) throw new Error(t.error || "Upload failed.");
      const { error: upErr } = await createClient().storage.from(t.bucket).uploadToSignedUrl(t.path, t.token, file, {
        contentType: file.type || "application/octet-stream",
      });
      if (upErr) throw new Error("Upload failed. Please try again.");

      setBusy("saving");
      const res = await fetch("/api/licensing/listings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...form,
          prices: Object.fromEntries(LICENCE_TYPES.map((t) => [t, enabled[t] ? pence(t) : null])),
          rightsConfirmed: true,
          file: { path: t.path, name: file.name },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not list the track.");
      router.push(`/licensing/deal/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy("");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 sm:py-12 px-4">
      <form onSubmit={submit} className="max-w-2xl mx-auto space-y-6">
        <div>
          <Link href="/licensing/tracks" className="text-xs font-semibold text-gray-500 hover:text-emerald-600 mb-4 inline-block">
            ← Licence music
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">List a track for licensing</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Set your prices once. Buyers sign the GRID Standard Music Licence and pay by card; you earn the full licence fee.
          </p>
        </div>

        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 sm:p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Track details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="trackTitle" className={label}>Track title *</label>
              <input id="trackTitle" value={form.trackTitle} onChange={set("trackTitle")} maxLength={120} className={input} />
            </div>
            <div>
              <label htmlFor="artistName" className={label}>Artist name *</label>
              <input id="artistName" value={form.artistName} onChange={set("artistName")} maxLength={120} className={input} />
            </div>
            <div>
              <label htmlFor="composer" className={label}>Composer(s) *</label>
              <input id="composer" value={form.composer} onChange={set("composer")} maxLength={200} placeholder="Everyone who wrote it" className={input} />
            </div>
            <div>
              <label htmlFor="publisher" className={label}>Publisher</label>
              <input id="publisher" value={form.publisher} onChange={set("publisher")} maxLength={200} placeholder="Leave empty if self-published" className={input} />
            </div>
            <div>
              <label htmlFor="genre" className={label}>Genre</label>
              <input id="genre" value={form.genre} onChange={set("genre")} maxLength={40} placeholder="e.g. Tech House" className={input} />
            </div>
            <div>
              <label htmlFor="isrc" className={label}>ISRC</label>
              <input id="isrc" value={form.isrc} onChange={set("isrc")} maxLength={15} placeholder="e.g. GBABC2400001" className={input} />
            </div>
          </div>
          <div>
            <label htmlFor="description" className={label}>Mood / description</label>
            <textarea id="description" value={form.description} onChange={set("description")} maxLength={1000} rows={3} placeholder="Upbeat, driving, great for fashion and fitness videos" className={input} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="previewUrl" className={label}>Preview link</label>
              <input id="previewUrl" value={form.previewUrl} onChange={set("previewUrl")} placeholder="https://soundcloud.com/…" className={input} />
            </div>
            <div>
              <label htmlFor="coverUrl" className={label}>Cover image link</label>
              <input id="coverUrl" value={form.coverUrl} onChange={set("coverUrl")} placeholder="https://…" className={input} />
            </div>
          </div>
          <div>
            <label htmlFor="file" className={label}>Full-quality track *</label>
            <input
              id="file"
              type="file"
              accept=".wav,.flac,.aiff,.aif,.mp3,audio/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-gray-700 dark:text-gray-300 file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 file:font-semibold"
            />
            <p className="text-xs text-gray-500 mt-1">Kept private. Only people who buy a licence can download it. WAV, FLAC, AIFF or MP3, under 50 MB.</p>
          </div>
        </section>

        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Licences and prices</h2>
          <p className="text-sm text-gray-500 mb-4">All licences are non-exclusive: you keep ownership and can licence the track again.</p>
          <div className="space-y-3">
            {LICENCE_TYPES.map((t) => (
              <div key={t} className={`rounded-xl border p-4 ${enabled[t] ? "border-emerald-500" : "border-gray-200 dark:border-zinc-800"}`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={enabled[t]} onChange={(e) => setEnabled((s) => ({ ...s, [t]: e.target.checked }))} className="mt-1 w-5 h-5 accent-emerald-600" />
                  <span className="flex-1">
                    <span className="block font-bold text-gray-900 dark:text-white">{LICENCE_INFO[t].name}</span>
                    <span className="block text-xs text-gray-500">{LICENCE_INFO[t].short} {LICENCE_INFO[t].examples}.</span>
                  </span>
                </label>
                {enabled[t] && (
                  <div className="mt-3 ml-8 flex flex-wrap items-center gap-3">
                    <label htmlFor={`price-${t}`} className="text-sm text-gray-700 dark:text-gray-300">Price £</label>
                    <input
                      id={`price-${t}`}
                      inputMode="decimal"
                      value={prices[t]}
                      onChange={(e) => setPrices((p) => ({ ...p, [t]: e.target.value.replace(/[^0-9.]/g, "") }))}
                      className="w-28 px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white"
                    />
                    <span className="text-xs text-gray-500">
                      You earn {formatGbp(pence(t))} · buyer pays {formatGbp(pence(t) + gridFeeFor(pence(t)))}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 sm:p-6 space-y-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Your rights</h2>
          {[
            ["master", "I own or control 100% of the sound recording (master), or have written permission from every co-owner and performer."],
            ["composition", "I own or control the song (composition), or have written permission from every co-writer and publisher to licence it this way."],
            ["samples", "The track contains no uncleared samples, and isn't signed exclusively to a label or music library that would stop me licensing it."],
          ].map(([k, text]) => (
            <label key={k} className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={rights[k as keyof typeof rights]}
                onChange={(e) => setRights((r) => ({ ...r, [k]: e.target.checked }))}
                className="mt-0.5 w-5 h-5 accent-emerald-600 flex-none"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{text}</span>
            </label>
          ))}
          <p className="text-xs text-gray-500">
            These statements form part of every licence you issue (clause 7). False statements can make you liable to the buyer.
          </p>
        </section>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 p-3 text-sm">
            {error}
          </p>
        )}

        <button type="submit" disabled={!!busy} className="w-full py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60">
          {busy === "uploading" ? "Uploading track…" : busy === "saving" ? "Listing track…" : "List track for licensing"}
        </button>
      </form>
    </div>
  );
}
