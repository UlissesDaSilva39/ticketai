import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Gift, Radio, ShoppingBag } from "lucide-react";
import { CoinIcon, LiveDot } from "@/components/live/icons";
import { HOST_SHARE, liveCategoryLabel } from "@/lib/live/catalog";
import { displayName } from "@/lib/live/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "GRID LIVE | Live music, DJ sets and studio sessions" };

type Row = { id: string; host_id: string; title: string; category: string; status: string; scheduled_for: string | null; started_at: string | null; ended_at: string | null };

const card = "bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800";

export default async function LiveHubPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const cols = "id, host_id, title, category, status, scheduled_for, started_at, ended_at";
  const [liveRes, upcomingRes, mineRes] = await Promise.all([
    supabase.from("live_streams").select(cols).eq("status", "live").order("started_at", { ascending: false }).limit(24),
    supabase.from("live_streams").select(cols).eq("status", "scheduled").order("scheduled_for", { ascending: true }).limit(12),
    user ? supabase.from("live_streams").select(cols).eq("host_id", user.id).order("created_at", { ascending: false }).limit(6) : Promise.resolve({ data: [] as Row[], error: null }),
  ]);
  if (liveRes.error) return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-600 dark:text-gray-400">GRID LIVE is being set up. Please check back soon.</div>;

  const live = (liveRes.data ?? []) as Row[];
  const upcoming = (upcomingRes.data ?? []) as Row[];
  const mine = (mineRes.data ?? []) as Row[];
  const all = [...live, ...upcoming, ...mine];
  const admin = createAdminClient();
  const hostIds = [...new Set(all.map((r) => r.host_id))];
  const liveIds = live.map((r) => r.id);
  const [{ data: hosts }, { data: gifts }] = await Promise.all([
    hostIds.length ? admin.from("profiles").select("id, full_name, username, avatar_url").in("id", hostIds) : Promise.resolve({ data: [] as { id: string; full_name: string | null; username: string | null; avatar_url: string | null }[] }),
    liveIds.length ? admin.from("gift_sends").select("stream_id, coins").in("stream_id", liveIds) : Promise.resolve({ data: [] as { stream_id: string; coins: number }[] }),
  ]);
  const hostById = new Map((hosts ?? []).map((h) => [h.id, h]));
  const raised = new Map<string, number>();
  for (const g of gifts ?? []) raised.set(g.stream_id, (raised.get(g.stream_id) ?? 0) + g.coins);

  const Card = ({ r }: { r: Row }) => {
    const h = hostById.get(r.host_id);
    return (
      <li>
        <Link href={`/live/${r.id}`} className={`${card} block overflow-hidden hover:border-emerald-400 transition-colors`}>
          <div className="relative aspect-video bg-gradient-to-br from-emerald-600 to-zinc-900 flex items-center justify-center text-white">
            {h?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={h.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover ring-4 ring-white/30" />
            ) : (
              <span className="text-4xl font-bold">{displayName(h)[0]}</span>
            )}
            {r.status === "live" ? (
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-red-600 text-xs font-bold inline-flex items-center gap-1.5"><LiveDot /> LIVE</span>
            ) : r.status === "scheduled" ? (
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-xs font-bold">
                {r.scheduled_for ? new Date(r.scheduled_for).toLocaleString("en-GB", { weekday: "short", hour: "2-digit", minute: "2-digit" }) : "Soon"}
              </span>
            ) : (
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-xs font-bold">Ended</span>
            )}
            {(raised.get(r.id) ?? 0) > 0 && <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur text-xs font-bold inline-flex items-center gap-1"><CoinIcon className="w-3.5 h-3.5" /> {raised.get(r.id)!.toLocaleString("en-GB")}</span>}
          </div>
          <div className="p-3">
            <p className="font-bold text-gray-900 dark:text-white truncate">{r.title}</p>
            <p className="text-xs text-gray-500 truncate">{displayName(h)} · {liveCategoryLabel(r.category)}</p>
          </div>
        </Link>
      </li>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 sm:py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-2"><LiveDot className="text-red-600" /> GRID LIVE</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Live music, DJ sets and studio sessions</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 max-w-2xl">Watch artists live, chat, send gifts and shop their merch, beats and tickets without leaving the stream.</p>
          </div>
          <Link href="/live/new" className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"><Radio className="w-5 h-5" aria-hidden="true" /> Go live</Link>
        </header>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Live now</h2>
          {live.length ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{live.map((r) => <Card key={r.id} r={r} />)}</ul>
          ) : (
            <div className={`${card} p-10 text-center`}>
              <p className="font-semibold text-gray-900 dark:text-white">Nobody is live right now.</p>
              <p className="text-sm text-gray-500 mt-1">Be the first. Go live and get gifts from your fans.</p>
              <Link href="/live/new" className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"><Radio className="w-4 h-4" aria-hidden="true" /> Go live</Link>
            </div>
          )}
        </section>

        {upcoming.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Coming up</h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{upcoming.map((r) => <Card key={r.id} r={r} />)}</ul>
          </section>
        )}

        {mine.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your lives</h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{mine.map((r) => <Card key={r.id} r={r} />)}</ul>
          </section>
        )}

        <section className="grid gap-4 md:grid-cols-3">
          {[
            [Radio, "Go live your way", "Stream from your phone or OBS to YouTube Live or Twitch. GRID adds chat, gifts, goals and your shop around it."],
            [Gift, "Earn from gifts", `Fans buy coins and send gifts while you play. You keep ${Math.round(HOST_SHARE * 100)}% of every gift, paid into your GRID balance.`],
            [ShoppingBag, "Sell while you play", "Pin your merch, beats, licences or ticket links. Fans buy in a tap and the whole room sees it."],
          ].map(([Icon, t, d]) => (
            <div key={t as string} className={`${card} p-5`}>
              <span className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 grid place-items-center mb-3" aria-hidden="true"><Icon className="w-5 h-5" /></span>
              <p className="font-bold text-gray-900 dark:text-white">{t as string}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{d as string}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
