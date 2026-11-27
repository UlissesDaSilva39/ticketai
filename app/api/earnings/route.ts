import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { HOLD_DAYS, MIN_PAYOUT_PENCE, sellerBalance } from "@/lib/marketplace-seller";
import { refreshPayoutAccount } from "@/lib/payouts";

export const dynamic = "force-dynamic";

// GET /api/earnings: everything this member has earned on GRID, and payout status.
export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const [balance, account] = await Promise.all([sellerBalance(createAdminClient(), user.id), refreshPayoutAccount(user.id)]);
  return NextResponse.json({
    balance: {
      totalPence: balance.totalPence,
      pendingPence: balance.pendingPence,
      availablePence: balance.availablePence,
      nextClearAt: balance.nextClearAt,
      thisMonthPence: balance.thisMonthPence,
      lastMonthPence: balance.lastMonthPence,
      bySource: balance.bySource,
    },
    payouts: balance.payouts,
    recent: [...balance.orders].sort((a, b) => String(b.paid_at).localeCompare(String(a.paid_at))).slice(0, 20),
    account: account ? { connected: true, payoutsEnabled: account.payouts_enabled, detailsSubmitted: account.details_submitted } : { connected: false, payoutsEnabled: false, detailsSubmitted: false },
    minPayoutPence: MIN_PAYOUT_PENCE,
    holdDays: HOLD_DAYS,
  });
}
