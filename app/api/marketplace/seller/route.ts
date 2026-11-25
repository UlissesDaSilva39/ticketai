import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { DOWNLOADABLE } from "@/lib/marketplace";
import { HOLD_DAYS, MIN_PAYOUT_PENCE, sellerBalance } from "@/lib/marketplace-seller";

export const dynamic = "force-dynamic";

// GET /api/marketplace/seller: the signed-in seller's products, real sales and
// revenue per product, balance (pending / available) and withdrawals.
export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const [{ data: listings, error }, balance, { count: connections }] = await Promise.all([
    supabase
      .from("marketplace_listings")
      .select("id, kind, title, description, price_pence, pay_what_you_want, cover_url, status, sales_count, created_at")
      .eq("seller_id", user.id)
      .neq("status", "deleted")
      .order("created_at", { ascending: false }),
    sellerBalance(supabase, user.id),
    supabase.from("friendships").select("id", { count: "exact", head: true }).eq("status", "accepted").or(`user_id.eq.${user.id},friend_id.eq.${user.id}`),
  ]);
  if (error) return NextResponse.json({ error: "Could not load your products." }, { status: 500 });

  const revenueByListing = new Map<string, { sales: number; pence: number }>();
  for (const o of balance.orders) {
    const r = revenueByListing.get(o.listing_id) ?? { sales: 0, pence: 0 };
    r.sales += 1;
    r.pence += o.amount_pence;
    revenueByListing.set(o.listing_id, r);
  }

  return NextResponse.json({
    products: (listings ?? []).map((l) => ({
      id: l.id,
      kind: l.kind,
      title: l.title,
      description: l.description,
      pricePence: l.price_pence,
      payWhatYouWant: l.pay_what_you_want,
      coverUrl: l.cover_url,
      status: l.status,
      sales: revenueByListing.get(l.id)?.sales ?? 0,
      revenuePence: revenueByListing.get(l.id)?.pence ?? 0,
      downloadable: (DOWNLOADABLE as string[]).includes(l.kind),
    })),
    balance: {
      totalPence: balance.totalPence,
      pendingPence: balance.pendingPence,
      availablePence: balance.availablePence,
      nextClearAt: balance.nextClearAt,
      thisMonthPence: balance.thisMonthPence,
      lastMonthPence: balance.lastMonthPence,
      holdDays: HOLD_DAYS,
      minPayoutPence: MIN_PAYOUT_PENCE,
    },
    payouts: balance.payouts,
    connections: connections ?? 0,
  });
}
