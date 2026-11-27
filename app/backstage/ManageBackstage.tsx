"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, Crown, PenLine, Users, Wallet } from "lucide-react";
import { ARTIST_SHARE, BACKSTAGE_PRICES, DEFAULT_TIER_NAMES, type BackstagePrice } from "@/lib/backstage/catalog";

type Tier = { price_pence: BackstagePrice; name: string; perks: string; active: boolean };
type Post = { id: string; body: string; media_url: string | null; created_at: string };

const gbp = (p: number) => `£${(p / 100).toFixed(2)}`;
const card = "bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800";
const input = "w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500";

export default function ManageBackstage() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [setupPending, setSetupPending] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [tiers, setTiers] = useState<Tier[]>(BACKSTAGE_PRICES.map((p) => ({ price_pence: p, name: DEFAULT_TIER_NAMES[p], perks: "", active: p === 500 })));
  const [stats, setStats] = useState({ members: 0, monthly: 0, earned: 0 });
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasTiers, setHasTiers] = useState(false);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState("");
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/backstage/manage", { cache: "no-store" }).then(async (r) => {
      if (r.status === 401) return router.replace("/login?redirect=/backstage");
      const d = await r.json().catch(() => ({}));
      if (d.setupPending) setSetupPending(true);
      setUsername(d.username ?? null);
      if (d.tiers?.length) {
        setHasTiers(d.tiers.some((t: { active: boolean }) => t.active));
        setTiers(BACKSTAGE_PRICES.map((p) => {
          const t = d.tiers.find((x: { price_pence: number }) => x.price_pence === p);
          return t ? { price_pence: p, name: t.name, perks: t.perks ?? "", active: t.active } : { price_pence: p, name: DEFAULT_TIER_NAMES[p], perks: "", active: false };
        }));
      }
      setStats({ members: d.memberCount ?? 0, monthly: d.monthlyPence ?? 0, earned: d.earnedThisMonthPence ?? 0 });
      setPosts(d.posts ?? []);
      setLoaded(true);
    });
  }, [router]);

  async function saveTiers() {
    setBusy("tiers");
    setNote(null);
    const r = await fetch("/api/backstage/manage", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ tiers }) });
    const d = await r.json().catch(() => ({}));
    setBusy("");
    if (!r.ok) return setNote({ ok: false, text: d.error || "Couldn't save." });
    setHasTiers(true);
    setNote({ ok: true, text: "Saved. Share your Backstage link with fans." });
  }

  async function post() {
    setBusy("post");
    setNote(null);
    const r = await fetch("/api/backstage/posts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ body }) });
    const d = await r.json().catch(() => ({}));
    setBusy("");
    if (!r.ok) return setNote({ ok: false, text: d.error || "Couldn't post." });
    setPosts((p) => [d.post, ...p]);
    setBody("");
    setNote({ ok: true, text: "Posted. Your members have been notified." });
  }

  const link = username && typeof window !== "undefined" ? `${window.location.origin}/backstage/${username}` : "";

  if (!loaded) return <div className="min-h-screen bg-gray-50 dark:bg-zinc-950" aria-busy="true" />;
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <header>
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1.5"><Crown className="w-3.5 h-3.5" aria-hidden="true" /> Backstage</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-1">Get paid every month by your biggest fans</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Fans pay £3, £5 or £10 a month for your members-only posts, early tracks and a supporter badge. You keep {Math.round(ARTIST_SHARE * 100)}%.</p>
        </header>
        {setupPending && <p className="rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-900 dark:text-amber-200 px-4 py-3 text-sm">Backstage is being set up. Please check back soon.</p>}
        {note && <p role={note.ok ? "status" : "alert"} className={`rounded-xl px-4 py-3 text-sm font-semibold ${note.ok ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-200" : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300"}`}>{note.text}</p>}

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            [Users, "Members", String(stats.members)],
            [Crown, "Monthly (before fees)", gbp(stats.monthly)],
            [Wallet, "Earned this month", gbp(stats.earned)],
          ].map(([Icon, k, v]) => {
            const I = Icon as typeof Users;
            return (
              <div key={k as string} className={`${card} p-5`}>
                <span className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 grid place-items-center" aria-hidden="true"><I className="w-4 h-4" /></span>
                <p className="text-sm text-gray-500 mt-3">{k as string}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{v as string}</p>
              </div>
            );
          })}
        </div>

        {hasTiers && username && (
          <div className={`${card} p-4 flex flex-wrap items-center gap-3`}>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex-1 min-w-0 truncate">{link}</p>
            <button type="button" onClick={() => navigator.clipboard.writeText(link).then(() => setNote({ ok: true, text: "Link copied." }))} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-200 hover:border-emerald-500"><Copy className="w-4 h-4" aria-hidden="true" /> Copy link</button>
            <Link href={`/backstage/${username}`} className="px-4 py-2 rounded-full text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700">View page</Link>
          </div>
        )}

        <section className={`${card} p-5 sm:p-6`}>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Memberships</h2>
          <p className="text-sm text-gray-500 mt-1">Switch on one, two or all three. Most artists start with £5.</p>
          <ul className="mt-4 space-y-3">
            {tiers.map((t, i) => (
              <li key={t.price_pence} className={`rounded-xl border-2 p-4 ${t.active ? "border-emerald-500" : "border-gray-200 dark:border-zinc-700"}`}>
                <label className="flex items-center gap-3 font-bold text-gray-900 dark:text-white">
                  <input type="checkbox" checked={t.active} onChange={(e) => setTiers((x) => x.map((y, j) => (j === i ? { ...y, active: e.target.checked } : y)))} className="w-5 h-5 accent-emerald-600" />
                  {gbp(t.price_pence)} / month
                  <span className="text-xs font-semibold text-gray-500">(you get {gbp(Math.floor(t.price_pence * ARTIST_SHARE))})</span>
                </label>
                {t.active && (
                  <div className="grid gap-3 sm:grid-cols-2 mt-3">
                    <input aria-label={`Name for the ${gbp(t.price_pence)} membership`} value={t.name} onChange={(e) => setTiers((x) => x.map((y, j) => (j === i ? { ...y, name: e.target.value } : y)))} maxLength={40} className={input} placeholder="Name" />
                    <input aria-label={`Extra perks for the ${gbp(t.price_pence)} membership`} value={t.perks} onChange={(e) => setTiers((x) => x.map((y, j) => (j === i ? { ...y, perks: e.target.value } : y)))} maxLength={300} className={input} placeholder="Extra perks, comma separated (optional)" />
                  </div>
                )}
              </li>
            ))}
          </ul>
          <button type="button" onClick={saveTiers} disabled={busy === "tiers"} className="mt-4 px-6 py-3 rounded-full font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60">{busy === "tiers" ? "Saving…" : hasTiers ? "Save memberships" : "Open my Backstage"}</button>
        </section>

        {hasTiers && (
          <section className={`${card} p-5 sm:p-6`}>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white inline-flex items-center gap-2"><PenLine className="w-5 h-5 text-emerald-600" aria-hidden="true" /> Post to members</h2>
            <label htmlFor="bs-body" className="sr-only">Members-only post</label>
            <textarea id="bs-body" value={body} onChange={(e) => setBody(e.target.value)} rows={4} maxLength={5000} className={`${input} mt-3`} placeholder="Share a demo link, studio news, presale code… only members can see this." />
            <button type="button" onClick={post} disabled={busy === "post" || !body.trim()} className="mt-3 px-6 py-3 rounded-full font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50">{busy === "post" ? "Posting…" : "Post to members"}</button>
            <ul className="mt-5 divide-y divide-gray-100 dark:divide-zinc-800">
              {posts.map((p) => (
                <li key={p.id} className="py-3">
                  <p className="text-xs text-gray-500">{new Date(p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line mt-1">{p.body}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
