"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CATEGORIES, FREQUENCIES, type CategoryId, type FrequencyId } from "@/lib/newsletters/format";
import { uploadImage } from "@/components/newsletters/uploadImage";

const input =
  "w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500";
const label = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5";

const IDEAS = ["Studio Notes", "Basement Gig Diary", "The Release Room", "Tech House Weekly", "Producer Tips"];

export default function NewNewsletterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CategoryId>("releases");
  const [frequency, setFrequency] = useState<FrequencyId>("monthly");
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  async function onCover(file: File | undefined) {
    if (!file) return;
    setBusy("cover");
    setError("");
    try {
      setCoverUrl(await uploadImage(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy("");
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (name.trim().length < 3) return setError("Give your newsletter a name (at least 3 characters).");
    if (description.trim().length < 10) return setError("Describe it in a sentence (at least 10 characters).");
    setBusy("save");
    try {
      const res = await fetch("/api/newsletters", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, description, category, frequency, coverUrl }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Couldn't create the newsletter.");
      router.push(`/newsletters/${d.slug}?created=1`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't create the newsletter.");
      setBusy("");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 sm:py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Link href="/newsletters" className="text-xs font-semibold text-gray-500 hover:text-emerald-600 mb-4 inline-block">← Newsletters</Link>
        <div className="grid gap-8 lg:grid-cols-[1fr_340px] items-start">
          <form onSubmit={submit} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 sm:p-8 space-y-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Create a newsletter</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Build a following around your music. Subscribers get a notification every time you publish an edition.</p>
            </div>

            <div>
              <label htmlFor="name" className={label}>Newsletter name *</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} placeholder={`e.g. ${IDEAS[0]}`} className={input} />
              <p className="text-xs text-gray-500 mt-1">Ideas: {IDEAS.slice(1).join(" · ")}</p>
            </div>

            <div>
              <label htmlFor="desc" className={label}>Description *</label>
              <textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={300} rows={3} placeholder="What will subscribers get? e.g. Monthly notes from the studio: new releases, works-in-progress and the gear I'm using." className={input} />
              <p className="text-xs text-gray-500 mt-1 text-right">{description.length}/300</p>
            </div>

            <fieldset>
              <legend className={label}>Topic *</legend>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <label key={c.id} className={`cursor-pointer px-3.5 py-2 rounded-full text-sm font-semibold border has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-500 ${category === c.id ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:border-emerald-400"}`}>
                    <input type="radio" name="category" value={c.id} checked={category === c.id} onChange={() => setCategory(c.id)} className="sr-only" />
                    {c.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="freq" className={label}>How often will you publish? *</label>
              <select id="freq" value={frequency} onChange={(e) => setFrequency(e.target.value as FrequencyId)} className={input}>
                {FREQUENCIES.map((f) => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
            </div>

            <div>
              <span className={label}>Cover image</span>
              <label className="inline-block cursor-pointer px-4 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:border-emerald-500">
                {busy === "cover" ? "Uploading…" : coverUrl ? "Change image" : "Upload image"}
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => onCover(e.target.files?.[0])} />
              </label>
              <span className="text-xs text-gray-500 ml-3">Wide images look best (e.g. 1200×500).</span>
            </div>

            {error && <p role="alert" className="rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 p-3 text-sm">{error}</p>}

            <button type="submit" disabled={busy !== ""} className="w-full py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60">
              {busy === "save" ? "Creating…" : "Create newsletter"}
            </button>
          </form>

          {/* Live preview */}
          <aside className="lg:sticky lg:top-20">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Preview</p>
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
              <div className="aspect-[2.4/1]">
                {coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-emerald-800 flex items-center justify-center text-white text-3xl font-bold">{(name || "N")[0].toUpperCase()}</div>
                )}
              </div>
              <div className="p-4">
                <p className="font-bold text-gray-900 dark:text-white">{name || "Your newsletter name"}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {CATEGORIES.find((c) => c.id === category)?.label} · {FREQUENCIES.find((f) => f.id === frequency)?.label}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{description || "Your description appears here."}</p>
                <span className="inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-bold text-white bg-emerald-600">Subscribe</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
