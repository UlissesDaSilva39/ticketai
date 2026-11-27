"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, CircleCheck, Crown, Lock, Users } from "lucide-react";
import { openBillingPortal } from "@/lib/hooks/useProStatus";

type Tier = { id: string; name: string; price_pence: number; perks: string | null };
type Post = { id: string; body: string; mediaUrl: string | null; createdAt: string; locked: boolean };
type Data = {
  artist: { id: string; name: string; username: string; avatar: string | null; role: string | null; city: string | null; bio: string | null };
  tiers: Tier[];
  memberCount: number;
  isOwner: boolean;
  isMember: boolean;
  signedIn: boolean;
  posts: Post[];
  setupPending?: boolean;
};

const gbp = (p: number) => `£${(p / 100).toFixed(p % 100 ? 2 : 0)}`;
const card = "bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800";

export default function ArtistBackstage({ username }: { username: string }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [data, setData] = useState<Data | null>(null);
  const [missing, setMissing] = useState(false);
  const [busy, setBusy] = useState("");
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(() =>
    sp.get("joined") === "cancelled" ? { ok: false, text: "Payment cancelled. You haven't been charged." } : null
  );

  const load = useCallback(async () => {
    const r = await fetch(`/api/backstage/artist/${encodeURIComponent(username)}`, { cache: "no-store" });
    if (r.status === 404) return setMissing(true);
    setData(await r.json());
  }, [username]);

  useEffect(() => {
    (async () => {
      const sessionId = sp.get("session_id");
      if (sp.get("joined") === "success" && sessionId) {
        await fetch("/api/backstage/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sessionId }) });
        setNote({ ok: true, text: "Welcome to Backstage! Everything below is unlocked for you." });
      }
      if (sp.get("joined")) router.replace(`/backstage/${username}`, { scroll: false });
      await load();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function join(tierId: string) {
    if (!data?.signedIn) return router.push(`/login?redirect=${encodeURIComponent(`/backstage/${username}`)}`);
    setBusy(tierId);
    const r = await fetch("/api/backstage/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ tierId }) });
    const d = await r.json().catch(() => ({}));
    if (r.ok && d.url) return void (window.location.href = d.url);
    setBusy("");
    setNote({ ok: false, text: d.error || "Couldn't start checkout." });
  }

  if (missing) return <div className="min-h-screen grid place-items-center text-gray-600 dark:text-gray-400">This artist wasn&apos;t found.</div>;
  if (!data) return <div className="min-h-screen bg-gray-50 dark:bg-zinc-950" aria-busy="true" />;
  const a = data.artist;
  const popular = data.tiers.length > 1 ? data.tiers[1]?.id : data.tiers[0]?.id;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pb-16">
      <section className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-zinc-950 text-white px-4 pt-12 pb-20 text-center">
        {a.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={a.avatar} alt="" className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-white/30" />
        ) : (
          <span className="w-24 h-24 rounded-full bg-emerald-600 grid place-items-center mx-auto ring-4 ring-white/30 text-3xl font-bold">{a.name[0]}</span>
        )}
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-emerald-200 inline-flex items-center gap-1.5"><Crown className="w-3.5 h-3.5" aria-hidden="true" /> Backstage</p>
        <h1 className="text-3xl sm:text-4xl font-bold mt-1">{a.name}</h1>
        <p className="text-emerald-50/80 mt-1 capitalize">{[a.role, a.city].filter(Boolean).join(" · ")}</p>
        {data.memberCount > 0 && <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold"><Users className="w-4 h-4" aria-hidden="true" /> {data.memberCount} member{data.memberCount === 1 ? "" : "s"}</p>}
      </section>

      <div className="max-w-4xl mx-auto px-4 -mt-12 space-y-6">
        {note && (
          <p role="status" className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow ${note.ok ? "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200" : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200"}`}>
            {note.ok && <CircleCheck className="w-5 h-5 text-emerald-600 flex-none" aria-hidden="true" />} {note.text}
          </p>
        )}

        {data.isOwner && (
          <div className={`${card} p-4 flex flex-wrap items-center justify-between gap-3`}>
            <p className="text-sm text-gray-700 dark:text-gray-300">This is your Backstage page as fans see it.</p>
            <Link href="/backstage" className="px-4 py-2 rounded-full text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700">Manage Backstage</Link>
          </div>
        )}

        {data.tiers.length === 0 ? (
          <div className={`${card} p-8 text-center`}>
            <p className="font-semibold text-gray-900 dark:text-white">{a.name} hasn&apos;t opened Backstage yet.</p>
            {a.username && <Link href={`/u/${a.username}`} className="inline-block mt-3 text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:underline">View profile</Link>}
          </div>
        ) : !data.isMember ? (
          <section aria-label="Memberships" className={`grid gap-4 ${data.tiers.length === 1 ? "max-w-sm mx-auto" : data.tiers.length === 2 ? "md:grid-cols-2 max-w-2xl mx-auto w-full" : "md:grid-cols-3"}`}>
            {data.tiers.map((t) => (
              <div key={t.id} className={`relative ${card} p-6 flex flex-col ${t.id === popular ? "border-2 border-emerald-600 shadow-xl" : ""}`}>
                {t.id === popular && data.tiers.length > 1 && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold">MOST POPULAR</span>}
                <p className="font-bold text-gray-900 dark:text-white">{t.name}</p>
                <p className="mt-2"><span className="text-3xl font-bold text-gray-900 dark:text-white">{gbp(t.price_pence)}</span> <span className="text-sm text-gray-500">/ month</span></p>
                <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300 flex-1">
                  {["All Backstage posts and early tracks", ...(t.perks ? t.perks.split(/\n|,/).map((x) => x.trim()).filter(Boolean) : []), "Supporter badge", "Cancel anytime"].map((f) => (
                    <li key={f} className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-600 flex-none mt-0.5" aria-hidden="true" /> {f}</li>
                  ))}
                </ul>
                <button type="button" disabled={!!busy || data.isOwner} onClick={() => join(t.id)} className="mt-5 py-3 rounded-full font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 transition-colors">
                  {busy === t.id ? "Opening secure checkout…" : `Join for ${gbp(t.price_pence)}/month`}
                </button>
              </div>
            ))}
          </section>
        ) : (
          !data.isOwner && <p className={`${card} p-4 text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2`}><Crown className="w-4 h-4 text-emerald-600" aria-hidden="true" /> You&apos;re a member. <button type="button" onClick={() => openBillingPortal()} className="font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">Manage or cancel</button></p>
        )}

        <section aria-label="Backstage posts" className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Posts</h2>
          {data.posts.length === 0 && <p className="text-sm text-gray-500">No posts yet.</p>}
          {data.posts.map((p) => (
            <article key={p.id} className={`${card} p-5 relative overflow-hidden`}>
              <p className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
              {p.locked ? (
                <>
                  <p className="mt-2 text-gray-800 dark:text-gray-200 blur-[3px] select-none" aria-hidden="true">New post from {a.name}. Join Backstage to read it and hear what&apos;s inside.</p>
                  <div className="absolute inset-0 grid place-items-center bg-white/60 dark:bg-zinc-900/60">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 text-white text-sm font-bold"><Lock className="w-4 h-4" aria-hidden="true" /> Members only</span>
                  </div>
                </>
              ) : (
                <>
                  <p className="mt-2 text-gray-800 dark:text-gray-200 whitespace-pre-line">{p.body}</p>
                  {p.mediaUrl && (
                    <a href={p.mediaUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:underline break-all">{p.mediaUrl}</a>
                  )}
                </>
              )}
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
