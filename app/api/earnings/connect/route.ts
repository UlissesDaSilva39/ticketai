import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { getPayoutAccount } from "@/lib/payouts";

export const dynamic = "force-dynamic";

// POST /api/earnings/connect: start (or continue) Stripe's secure bank set-up.
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (!rateLimit(`connect:${user.id}`, 10, 60 * 60 * 1000).ok) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  const origin = req.headers.get("origin") ?? new URL(req.url).origin;
  try {
    let acc = await getPayoutAccount(user.id);
    if (!acc) {
      const a = await stripe.accounts.create({
        type: "express",
        country: "GB",
        email: user.email ?? undefined,
        capabilities: { transfers: { requested: true } },
        metadata: { user_id: user.id },
      });
      const { error } = await createAdminClient().from("payout_accounts").insert({ user_id: user.id, stripe_account_id: a.id });
      if (error) {
        console.error("[earnings/connect]", error.message);
        return NextResponse.json({ error: "Payouts are being set up. Please try again soon." }, { status: 500 });
      }
      acc = { stripe_account_id: a.id, payouts_enabled: false, details_submitted: false };
    }
    if (acc.details_submitted) {
      // Already set up: open their Stripe Express dashboard instead.
      const login = await stripe.accounts.createLoginLink(acc.stripe_account_id);
      return NextResponse.json({ url: login.url });
    }
    const link = await stripe.accountLinks.create({
      account: acc.stripe_account_id,
      type: "account_onboarding",
      refresh_url: `${origin}/earnings?connect=refresh`,
      return_url: `${origin}/earnings?connect=return`,
    });
    return NextResponse.json({ url: link.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[earnings/connect] Stripe:", msg);
    // Most common cause: Connect isn't switched on in the GRID Stripe account yet.
    return NextResponse.json({ error: "Bank set-up isn't available yet. You can still request a withdrawal and we'll pay you by hand." }, { status: 503 });
  }
}
