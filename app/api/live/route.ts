import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { isLiveCategory, parseStreamLink } from "@/lib/live/catalog";
import { UUID, currentUser, displayName } from "@/lib/live/server";
import { notifyServer } from "@/lib/notify-server";

export const dynamic = "force-dynamic";

type ProductIn = { kind?: string; refId?: string; url?: string; title?: string; pricePence?: number };

// POST /api/live: set up a live room (go live now or schedule it).
export async function POST(req: NextRequest) {
  const { user } = await currentUser();
  if (!user) return NextResponse.json({ error: "Please log in to go live." }, { status: 401 });
  if (!rateLimit(`live-new:${user.id}`, 10, 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: "You've set up a lot of lives. Try again later." }, { status: 429 });
  }

  const b = await req.json().catch(() => ({}));
  const title = String(b.title ?? "").trim().slice(0, 120);
  const description = String(b.description ?? "").trim().slice(0, 1000) || null;
  const source = parseStreamLink(String(b.link ?? ""));
  if (title.length < 3) return NextResponse.json({ error: "Give your live a title." }, { status: 400 });
  if (!isLiveCategory(b.category)) return NextResponse.json({ error: "Choose what kind of live it is." }, { status: 400 });
  if (!source) return NextResponse.json({ error: "Paste your YouTube Live or Twitch channel link." }, { status: 400 });

  const goLiveNow = b.goLiveNow === true;
  let scheduledFor: string | null = null;
  if (!goLiveNow) {
    const t = Date.parse(String(b.scheduledFor ?? ""));
    if (!Number.isFinite(t) || t < Date.now() - 5 * 60_000) return NextResponse.json({ error: "Pick a start time in the future, or go live now." }, { status: 400 });
    scheduledFor = new Date(t).toISOString();
  }
  const goalCoins = b.goalCoins ? Math.round(Number(b.goalCoins)) : null;
  if (goalCoins !== null && !(goalCoins >= 100 && goalCoins <= 10_000_000)) return NextResponse.json({ error: "Goals start at 100 coins." }, { status: 400 });
  const goalLabel = goalCoins ? String(b.goalLabel ?? "").trim().slice(0, 80) || null : null;

  const admin = createAdminClient();

  // Products: only the host's own active listings, or https links (tickets, merch store, pre-save…).
  const rawProducts: ProductIn[] = Array.isArray(b.products) ? b.products.slice(0, 12) : [];
  const products: Record<string, unknown>[] = [];
  for (const [i, p] of rawProducts.entries()) {
    if (p.kind === "marketplace" && typeof p.refId === "string" && UUID.test(p.refId)) {
      const { data: l } = await admin.from("marketplace_listings").select("id, seller_id, title, price_pence, cover_url, status").eq("id", p.refId).maybeSingle();
      if (l && l.seller_id === user.id && l.status === "active") products.push({ kind: "marketplace", ref_id: l.id, title: l.title, price_pence: l.price_pence, image_url: l.cover_url, position: i });
    } else if (p.kind === "licence" && typeof p.refId === "string" && UUID.test(p.refId)) {
      const { data: l } = await admin.from("licence_listings").select("id, owner_id, track_title, price_creator, price_commercial, price_sync, cover_url, status").eq("id", p.refId).maybeSingle();
      if (l && l.owner_id === user.id && l.status === "active") {
        const from = Math.min(...[l.price_creator, l.price_commercial, l.price_sync].filter((x): x is number => x != null));
        products.push({ kind: "licence", ref_id: l.id, title: `Licence "${l.track_title}"`.slice(0, 120), price_pence: Number.isFinite(from) ? from : null, image_url: l.cover_url, position: i });
      }
    } else if (p.kind === "link" && typeof p.url === "string" && /^https:\/\/\S+$/.test(p.url.trim())) {
      const t = String(p.title ?? "").trim().slice(0, 120);
      if (t) {
        const price = p.pricePence == null || p.pricePence === ("" as unknown) ? null : Math.round(Number(p.pricePence));
        products.push({ kind: "link", url: p.url.trim().slice(0, 500), title: t, price_pence: price != null && price >= 0 && price <= 1_000_000 ? price : null, position: i });
      }
    }
  }

  const { data, error } = await admin
    .from("live_streams")
    .insert({
      host_id: user.id,
      title,
      description,
      category: b.category,
      provider: source.provider,
      provider_ref: source.ref,
      status: goLiveNow ? "live" : "scheduled",
      scheduled_for: scheduledFor,
      started_at: goLiveNow ? new Date().toISOString() : null,
      goal_coins: goalCoins,
      goal_label: goalLabel,
    })
    .select("id")
    .single();
  if (error || !data) {
    console.error("[live POST]", error?.message);
    return NextResponse.json({ error: "GRID LIVE is being set up. Please try again soon." }, { status: 500 });
  }
  if (products.length) {
    products[0].pinned = true;
    await admin.from("live_products").insert(products.map((p) => ({ ...p, stream_id: data.id })));
  }
  await admin.from("live_messages").insert({ stream_id: data.id, kind: "system", body: goLiveNow ? "The live has started. Say hi! 👋" : "Live scheduled. Chat opens now." });
  if (goLiveNow) {
    const { data: me } = await admin.from("profiles").select("full_name, username").eq("id", user.id).maybeSingle();
    const { data: followers } = await admin.from("follows").select("follower_id").eq("target_type", "user").eq("target_id", user.id).limit(1000);
    for (const f of followers ?? []) {
      await notifyServer({ userId: f.follower_id, type: "live", title: `🔴 ${displayName(me)} is live: ${title}`, body: "Join now and send a gift.", href: `/live/${data.id}` }).catch(() => undefined);
    }
  }
  return NextResponse.json({ id: data.id });
}
