import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { MIN_PAYOUT_PENCE, sellerBalance } from "@/lib/marketplace-seller";

export const dynamic = "force-dynamic";

// POST /api/marketplace/payouts: request a withdrawal of the full available
// balance. GRID pays it out and marks it paid.
export async function POST() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (!rateLimit(`market-payout:${user.id}`, 5, 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  const admin = createAdminClient();
  const balance = await sellerBalance(admin, user.id);
  if (balance.payouts.some((p) => p.status === "requested")) {
    return NextResponse.json({ error: "You already have a withdrawal in progress." }, { status: 400 });
  }
  if (balance.availablePence < MIN_PAYOUT_PENCE) {
    return NextResponse.json({ error: `The minimum withdrawal is £${(MIN_PAYOUT_PENCE / 100).toFixed(2)}.` }, { status: 400 });
  }

  const { data, error } = await admin
    .from("marketplace_payouts")
    .insert({ seller_id: user.id, amount_pence: balance.availablePence })
    .select("id, amount_pence, status, created_at, paid_at")
    .single();
  if (error || !data) {
    console.error("[marketplace/payouts]", error?.message);
    return NextResponse.json({ error: "Withdrawals aren't available yet. Please try again later." }, { status: 500 });
  }
  return NextResponse.json({ payout: data });
}
