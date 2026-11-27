import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ACTIVE_MEMBER_STATUSES, BACKSTAGE_PRICES, isBackstagePrice } from "@/lib/backstage/catalog";

export const dynamic = "force-dynamic";

async function me() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// GET: my Backstage (tiers, members, this month's income, posts).
export async function GET() {
  const user = await me();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const admin = createAdminClient();
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const [tiers, members, pays, posts, profile] = await Promise.all([
    admin.from("backstage_tiers").select("id, name, price_pence, perks, active").eq("artist_id", user.id).order("price_pence"),
    admin.from("backstage_members").select("price_pence, status").eq("artist_id", user.id).in("status", ACTIVE_MEMBER_STATUSES),
    admin.from("backstage_payments").select("artist_earn_pence").eq("artist_id", user.id).gte("paid_at", monthStart),
    admin.from("backstage_posts").select("id, body, media_url, created_at").eq("artist_id", user.id).order("created_at", { ascending: false }).limit(30),
    admin.from("profiles").select("username").eq("id", user.id).maybeSingle(),
  ]);
  if (tiers.error) return NextResponse.json({ setupPending: true });
  return NextResponse.json({
    username: profile.data?.username ?? null,
    tiers: tiers.data ?? [],
    memberCount: (members.data ?? []).length,
    monthlyPence: (members.data ?? []).reduce((s, m) => s + (m.price_pence ?? 0), 0),
    earnedThisMonthPence: (pays.data ?? []).reduce((s, p) => s + p.artist_earn_pence, 0),
    posts: posts.data ?? [],
  });
}

// PUT: save tiers [{ price_pence, name, perks, active }] (one per price).
export async function PUT(req: NextRequest) {
  const user = await me();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const { tiers } = await req.json().catch(() => ({}));
  if (!Array.isArray(tiers)) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const rows = tiers
    .filter((t) => isBackstagePrice(t?.price_pence))
    .map((t) => ({
      artist_id: user.id,
      price_pence: t.price_pence,
      name: String(t.name ?? "").trim().slice(0, 40),
      perks: String(t.perks ?? "").trim().slice(0, 300) || null,
      active: !!t.active,
    }));
  if (rows.some((r) => r.active && r.name.length < 2)) return NextResponse.json({ error: "Give each membership you switch on a name." }, { status: 400 });
  if (!rows.some((r) => r.active)) return NextResponse.json({ error: `Switch on at least one membership (${BACKSTAGE_PRICES.map((p) => `£${p / 100}`).join(", ")}).` }, { status: 400 });
  const { error } = await createAdminClient().from("backstage_tiers").upsert(
    rows.map((r) => ({ ...r, name: r.name || "Membership" })),
    { onConflict: "artist_id,price_pence" }
  );
  if (error) return NextResponse.json({ error: "Backstage is being set up. Please try again soon." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
