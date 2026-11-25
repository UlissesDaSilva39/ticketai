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
  const [{ data: orders }, payoutsRes, licencesRes] = await Promise.all([
    db.from("marketplace_orders").select("id, listing_id, amount_pence, paid_at").eq("seller_id", sellerId).eq("status", "paid"),
    db.from("marketplace_payouts").select("id, amount_pence, status, created_at, paid_at").eq("seller_id", sellerId).order("created_at", { ascending: false }),
    // Licence deals earn into the same balance (table may not exist yet: treat as none).
    db.from("licence_deals").select("id, listing_id, amount_pence, paid_at").eq("seller_id", sellerId).eq("status", "active"),
  ]);
  const paid = [...(orders ?? []), ...(licencesRes.error ? [] : licencesRes.data ?? [])];
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
