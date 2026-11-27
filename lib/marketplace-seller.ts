import type { SupabaseClient } from "@supabase/supabase-js";

// Seller balance rules (server-only). Earnings clear HOLD_DAYS after payment
// (refund/chargeback buffer); requested and paid withdrawals are deducted.
export const HOLD_DAYS = 7;
export const MIN_PAYOUT_PENCE = 1000;
const DAY = 86_400_000;

export type SellerBalance = {
  totalPence: number;
  pendingPence: number;
  availablePence: number;
  nextClearAt: string | null;
  thisMonthPence: number;
  lastMonthPence: number;
  payouts: { id: string; amount_pence: number; status: string; created_at: string; paid_at: string | null }[];
  orders: { id: string; listing_id: string; amount_pence: number; paid_at: string | null }[];
};

export async function sellerBalance(db: SupabaseClient, sellerId: string): Promise<SellerBalance> {
  const [{ data: orders }, payoutsRes, licencesRes, giftsRes, repliesRes, tipsRes, backstageRes] = await Promise.all([
    db.from("marketplace_orders").select("id, listing_id, amount_pence, paid_at").eq("seller_id", sellerId).eq("status", "paid"),
    db.from("marketplace_payouts").select("id, amount_pence, status, created_at, paid_at").eq("seller_id", sellerId).order("created_at", { ascending: false }),
    // Licence deals earn into the same balance (table may not exist yet: treat as none).
    db.from("licence_deals").select("id, listing_id, amount_pence, paid_at").eq("seller_id", sellerId).eq("status", "active"),
    // GRID LIVE gifts: the host's 70% share (table may not exist yet: treat as none).
    db.from("gift_sends").select("id, stream_id, host_earn_pence, created_at").eq("host_id", sellerId).eq("status", "active"),
    // Paid demos/priority messages the member answered (their 50% share).
    db.from("submissions").select("id, reviewer_earn_pence, replied_at").eq("reviewer_id", sellerId).eq("status", "replied"),
    // Coin tips on posts and profiles (creator's 70%).
    db.from("tip_sends").select("id, target_id, creator_earn_pence, created_at").eq("creator_id", sellerId).eq("status", "active"),
    // Backstage memberships (artist's 90% of each paid month).
    db.from("backstage_payments").select("id, artist_earn_pence, paid_at").eq("artist_id", sellerId),
  ]);
  const extra = [
    ...(repliesRes.error ? [] : (repliesRes.data ?? []).map((r) => ({ id: r.id, listing_id: "submission", amount_pence: r.reviewer_earn_pence, paid_at: r.replied_at }))),
    ...(tipsRes.error ? [] : (tipsRes.data ?? []).map((t) => ({ id: t.id, listing_id: t.target_id, amount_pence: t.creator_earn_pence, paid_at: t.created_at }))),
    ...(backstageRes.error ? [] : (backstageRes.data ?? []).map((b) => ({ id: b.id, listing_id: "backstage", amount_pence: b.artist_earn_pence, paid_at: b.paid_at }))),
  ];
  const gifts = giftsRes.error
    ? []
    : (giftsRes.data ?? []).map((g) => ({ id: g.id, listing_id: g.stream_id, amount_pence: g.host_earn_pence, paid_at: g.created_at }));
  const paid = [...(orders ?? []), ...(licencesRes.error ? [] : licencesRes.data ?? []), ...gifts, ...extra];
  const payouts = payoutsRes.error ? [] : payoutsRes.data ?? [];

  const now = Date.now();
  const clearsAt = (o: { paid_at: string | null }) => (o.paid_at ? new Date(o.paid_at).getTime() : now) + HOLD_DAYS * DAY;
  const totalPence = paid.reduce((s, o) => s + o.amount_pence, 0);
  const pending = paid.filter((o) => clearsAt(o) > now);
  const pendingPence = pending.reduce((s, o) => s + o.amount_pence, 0);
  const withdrawn = payouts.filter((p) => p.status !== "rejected").reduce((s, p) => s + p.amount_pence, 0);
  const nextClear = pending.length ? Math.min(...pending.map(clearsAt)) : null;

  const d = new Date();
  const monthStart = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
  const lastMonthStart = new Date(d.getFullYear(), d.getMonth() - 1, 1).getTime();
  const at = (o: { paid_at: string | null }) => (o.paid_at ? new Date(o.paid_at).getTime() : 0);

  return {
    totalPence,
    pendingPence,
    availablePence: Math.max(0, totalPence - pendingPence - withdrawn),
    nextClearAt: nextClear ? new Date(nextClear).toISOString() : null,
    thisMonthPence: paid.filter((o) => at(o) >= monthStart).reduce((s, o) => s + o.amount_pence, 0),
    lastMonthPence: paid.filter((o) => at(o) >= lastMonthStart && at(o) < monthStart).reduce((s, o) => s + o.amount_pence, 0),
    payouts,
    orders: paid,
  };
}
