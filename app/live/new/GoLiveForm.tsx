"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HOST_SHARE, LIVE_CATEGORIES, formatGbp, parseStreamLink, type LiveCategory } from "@/lib/live/catalog";

type Listing = { kind: "marketplace" | "licence"; id: string; title: string; sub: string; pence: number };
type LinkRow = { title: string; url: string; price: string };

const input =
  "w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500";
const label = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5";
const card = "bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 sm:p-6";

export default function GoLiveForm({ listings }: { listings: Listing[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<LiveCategory>("performance");
  const [link, setLink] = useState("");
  const [when, setWhen] = useState<"now" | "later">("now");
  const [scheduledFor, setScheduledFor] = useState("");
  const [goal, setGoal] = useState("");
  const [goalLabel, setGoalLabel] = useState("");
  const [picked, setPicked] = useState<Set<string>>(new Set(listings.slice(0, 3).map((l) => l.id)));
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const source = link ? parseStreamLink(link) : null;
  const goalCoins = Math.round(Number(goal) || 0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (title.trim().length < 3) return setError("Give your live a title.");
    if (!source) return setError("Paste your YouTube Live or Twitch channel link.");
    if (when === "later" && !scheduledFor) return setError("Pick when you'll go live.");
    if (goal && goalCoins < 100) return setError("Goals start at 100 coins.");
    setBusy(true);
    try {
      const res = await fetch("/api/live", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          link,
          goLiveNow: when === "now",
          scheduledFor: when === "later" ? new Date(scheduledFor).toISOString() : null,
          goalCoins: goal ? goalCoins : null,
          goalLabel,
          products: [
            ...listings.filter((l) => picked.has(l.id)).map((l) => ({ kind: l.kind, refId: l.id })),
            ...links.filter((l) => l.title.trim() && l.url.trim()).map((l) => ({ kind: "link", title: l.title, url: l.url, pricePence: l.price ? Math.round(parseFloat(l.price) * 100) : null })),
          ],
        }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Couldn't set up your live.");
      router.push(`/live/${d.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't set up your live.");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 sm:py-12 px-4">
      <form onSubmit={submit} className="max-w-2xl mx-auto space-y-6">
        <div>
          <Link href="/live" className="text-xs font-semibold text-gray-500 hover:text-emerald-600 mb-4 inline-block">← GRID LIVE</Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🔴 Go live</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Stream on YouTube Live or Twitch; GRID adds chat, gifts, a goal and your shop around it. You keep {Math.round(HOST_SHARE * 100)}% of every gift.</p>
        </div>

        <section className={card + " space-y-4"}>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">1. Your live</h2>
          <div>
            <label htmlFor="title" className={label}>Title *</label>
            <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="e.g. Friday night tech house set from the studio" className={input} />
          </div>
          <fieldset>
            <legend className={label}>Type *</legend>
            <div className="flex flex-wrap gap-2">
              {LIVE_CATEGORIES.map((c) => (
                <label key={c.id} className={`cursor-pointer px-3.5 py-2 rounded-full text-sm font-semibold border has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-500 ${category === c.id ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300"}`}>
                  <input type="radio" name="category" className="sr-only" checked={category === c.id} onChange={() => setCategory(c.id)} />
                  {c.label}
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor="desc" className={label}>Description</label>
            <textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={1000} rows={3} placeholder="What will fans hear? Any new tracks?" className={input} />
          </div>
        </section>

        <section className={card + " space-y-4"}>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">2. Where you&apos;re streaming</h2>
          <div>
            <label htmlFor="link" className={label}>YouTube Live or Twitch link *</label>
            <input id="link" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://www.youtube.com/live/… or https://www.twitch.tv/yourname" className={input} />
            <p className={`text-xs mt-1 ${link && !source ? "text-red-600" : "text-gray-500"}`}>
              {source ? `✓ ${source.provider === "youtube" ? "YouTube" : "Twitch"} stream found` : link ? "That doesn't look like a YouTube or Twitch link yet." : "Start your stream in the YouTube or Twitch app (or OBS), then paste its link here."}
            </p>
          </div>
          <fieldset className="flex flex-wrap gap-3">
            <legend className="sr-only">When</legend>
            {(["now", "later"] as const).map((w) => (
              <label key={w} className={`cursor-pointer px-4 py-2 rounded-xl border-2 text-sm font-semibold ${when === w ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300" : "border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300"}`}>
                <input type="radio" name="when" className="sr-only" checked={when === w} onChange={() => setWhen(w)} />
                {w === "now" ? "🔴 Go live now" : "📅 Schedule for later"}
              </label>
            ))}
          </fieldset>
          {when === "later" && (
            <div>
              <label htmlFor="sched" className={label}>Start time *</label>
              <input id="sched" type="datetime-local" value={scheduledFor} onChange={(e) => setScheduledFor(e.target.value)} className={input} />
              <p className="text-xs text-gray-500 mt-1">Fans can open the page and chat before you start. Your followers are notified when you press Start.</p>
            </div>
          )}
        </section>

        <section className={card + " space-y-4"}>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">3. Goal (optional)</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 -mt-2">A visible goal gets fans gifting together. 1 coin = 1p of gift value.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="goal" className={label}>Goal (coins)</label>
              <input id="goal" inputMode="numeric" value={goal} onChange={(e) => setGoal(e.target.value.replace(/\D/g, ""))} placeholder="e.g. 5000" className={input} />
              {goalCoins >= 100 && <p className="text-xs text-gray-500 mt-1">You&apos;d earn {formatGbp(Math.floor(goalCoins * HOST_SHARE))} when it&apos;s reached.</p>}
            </div>
            <div>
              <label htmlFor="goal-label" className={label}>What it&apos;s for</label>
              <input id="goal-label" value={goalLabel} onChange={(e) => setGoalLabel(e.target.value)} maxLength={80} placeholder="e.g. New studio monitors" className={input} />
            </div>
          </div>
        </section>

        <section className={card + " space-y-4"}>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">4. Shop this live</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 -mt-2">Pin products fans can buy without leaving. The first one is pinned at the start; you can change it during the live.</p>
          {listings.length > 0 ? (
            <ul className="space-y-2">
              {listings.map((l) => (
                <li key={l.id}>
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={picked.has(l.id)}
                      onChange={(e) => setPicked((s) => { const n = new Set(s); if (e.target.checked) n.add(l.id); else n.delete(l.id); return n; })}
                      className="w-5 h-5 accent-emerald-600"
                    />
                    <span className="flex-1 min-w-0">
                      <span className="block font-semibold text-sm text-gray-900 dark:text-white truncate">{l.title}</span>
                      <span className="text-xs text-gray-500 capitalize">{l.sub} · {l.kind === "licence" ? "from " : ""}{Number.isFinite(l.pence) ? formatGbp(l.pence) : ""}</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">You have no Marketplace or Licensing listings yet. <Link href="/marketplace" className="underline">Sell beats or merch</Link> or <Link href="/licensing?tab=sell" className="underline">list a track for licensing</Link>, or add a link below.</p>
          )}
          {links.map((l, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_110px_auto] items-start">
              <input aria-label="Link title" value={l.title} onChange={(e) => setLinks((x) => x.map((y, j) => (j === i ? { ...y, title: e.target.value } : y)))} placeholder="e.g. Tickets: London, 12 Dec" maxLength={120} className={input} />
              <input aria-label="Link address" value={l.url} onChange={(e) => setLinks((x) => x.map((y, j) => (j === i ? { ...y, url: e.target.value } : y)))} placeholder="https://…" className={input} />
              <input aria-label="Price in pounds (optional)" value={l.price} inputMode="decimal" onChange={(e) => setLinks((x) => x.map((y, j) => (j === i ? { ...y, price: e.target.value.replace(/[^0-9.]/g, "") } : y)))} placeholder="£ (opt.)" className={input} />
              <button type="button" onClick={() => setLinks((x) => x.filter((_, j) => j !== i))} className="px-3 py-3 text-sm font-semibold text-red-700 dark:text-red-400">Remove</button>
            </div>
          ))}
          {links.length < 6 && (
            <button type="button" onClick={() => setLinks((x) => [...x, { title: "", url: "", price: "" }])} className="text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:underline">
              + Add a link (tickets, merch store, pre-save…)
            </button>
          )}
        </section>

        {error && <p role="alert" className="rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 p-3 text-sm">{error}</p>}

        <button type="submit" disabled={busy} className="w-full py-4 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60">
          {busy ? "Setting up…" : when === "now" ? "🔴 Go live now" : "📅 Schedule live"}
        </button>
      </form>
    </div>
  );
}
