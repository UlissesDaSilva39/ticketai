import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { displayName } from "@/lib/live/server";
import { promotedIds } from "@/lib/promote/server";
import { liveCategoryLabel, snapshotBucket, snapshotUrl } from "@/lib/live/catalog";

export const dynamic = "force-dynamic";

// GET /api/live/now: who is live right now (+ the next few scheduled), for the home
// page strip and the sidebar. Public data only: titles, host names and avatars.
export async function GET() {
  const admin = createAdminClient();
  const cols = "id, host_id, title, category, provider, provider_ref, status, scheduled_for, started_at";
  const [liveRes, soonRes] = await Promise.all([
    admin.from("live_streams").select(cols).eq("status", "live").order("started_at", { ascending: false }).limit(12),
    admin.from("live_streams").select(cols).eq("status", "scheduled").gt("scheduled_for", new Date(Date.now() - 60 * 60 * 1000).toISOString()).order("scheduled_for", { ascending: true }).limit(6),
  ]);
  if (liveRes.error) return NextResponse.json({ live: [], upcoming: [] }, { headers: { "cache-control": "no-store" } });

  // Paid promotions ("GRID Boost") go first among the lives on air.
  const boosted = new Set(await promotedIds("live"));
  const liveRows = [...(liveRes.data ?? [])].sort((a, b) => Number(boosted.has(b.id)) - Number(boosted.has(a.id)));
  const rows = [...liveRows, ...(soonRes.data ?? [])];
  const hostIds = [...new Set(rows.map((r) => r.host_id))];
  const liveIds = liveRows.map((r) => r.id);
  const [{ data: hosts }, { data: gifts }] = await Promise.all([
    hostIds.length ? admin.from("profiles").select("id, full_name, username, avatar_url").in("id", hostIds) : Promise.resolve({ data: [] as { id: string; full_name: string | null; username: string | null; avatar_url: string | null }[] }),
    liveIds.length ? admin.from("gift_sends").select("stream_id, coins").in("stream_id", liveIds).eq("status", "active") : Promise.resolve({ data: [] as { stream_id: string; coins: number }[] }),
  ]);
  const hostById = new Map((hosts ?? []).map((h) => [h.id, h]));
  const raised = new Map<string, number>();
  for (const g of gifts ?? []) raised.set(g.stream_id, (raised.get(g.stream_id) ?? 0) + g.coins);
  const bucket = snapshotBucket();

  const shape = (r: (typeof rows)[number]) => {
    const h = hostById.get(r.host_id);
    return {
      id: r.id,
      title: r.title,
      category: liveCategoryLabel(r.category),
      host: displayName(h),
      avatar: h?.avatar_url ?? null,
      snapshot: r.status === "live" ? snapshotUrl({ provider: r.provider, ref: r.provider_ref }, bucket) : null,
      startedAt: r.started_at,
      scheduledFor: r.scheduled_for,
      raisedCoins: raised.get(r.id) ?? 0,
      promoted: boosted.has(r.id),
    };
  };
  return NextResponse.json(
    { live: liveRows.map(shape), upcoming: (soonRes.data ?? []).map(shape) },
    { headers: { "cache-control": "public, max-age=0, s-maxage=15, stale-while-revalidate=30" } }
  );
}
