import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { UUID, displayName } from "@/lib/live/server";

export const dynamic = "force-dynamic";

// GET /api/live/<id>/feed?after=<messageId>: what the room polls every ~2s:
// new chat/gift/purchase messages, status, goal progress, top supporters, pinned product.
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) return NextResponse.json({ error: "Live not found." }, { status: 404 });
  const after = Math.max(0, Number(req.nextUrl.searchParams.get("after") ?? 0) || 0);

  const admin = createAdminClient();
  const [{ data: s }, { data: msgs }, { data: gifts }, { data: pinned }] = await Promise.all([
    admin.from("live_streams").select("status, goal_coins").eq("id", id).maybeSingle(),
    admin.from("live_messages").select("id, user_id, kind, body, gift_id, coins, created_at").eq("stream_id", id).gt("id", after).order("id", { ascending: true }).limit(after ? 100 : 60),
    admin.from("gift_sends").select("sender_id, coins").eq("stream_id", id).eq("status", "active"),
    admin.from("live_products").select("id").eq("stream_id", id).eq("pinned", true).maybeSingle(),
  ]);
  if (!s) return NextResponse.json({ error: "Live not found." }, { status: 404 });

  const totals = new Map<string, number>();
  for (const g of gifts ?? []) totals.set(g.sender_id, (totals.get(g.sender_id) ?? 0) + g.coins);
  const raised = [...totals.values()].reduce((a, b) => a + b, 0);
  const top = [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const ids = [...new Set([...(msgs ?? []).map((m) => m.user_id).filter((x): x is string => !!x), ...top.map(([u]) => u)])];
  const { data: people } = ids.length ? await admin.from("profiles").select("id, full_name, username").in("id", ids) : { data: [] as { id: string; full_name: string | null; username: string | null }[] };
  const name = new Map((people ?? []).map((p) => [p.id, displayName(p)]));

  return NextResponse.json(
    {
      status: s.status,
      raisedCoins: raised,
      goalCoins: s.goal_coins,
      pinnedId: pinned?.id ?? null,
      supporters: top.map(([u, coins]) => ({ name: name.get(u) ?? "GRID member", coins })),
      messages: (msgs ?? []).map((m) => ({
        id: m.id,
        kind: m.kind,
        body: m.body,
        giftId: m.gift_id,
        coins: m.coins,
        name: m.user_id ? name.get(m.user_id) ?? "GRID member" : null,
        at: m.created_at,
      })),
    },
    { headers: { "cache-control": "no-store" } }
  );
}
