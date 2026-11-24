import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ensurePlanProduct, getProStatus, isPlan, PLANS, syncSubscription } from "@/lib/pro";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// Switch an existing subscription between Pro (£5) and Premium (£15).
// Stripe prorates the difference on the next invoice; a trial carries on as is.
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  if (!rateLimit(`change-plan:${user.id}`, 5, 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: "Too many plan changes. Try again later." }, { status: 429 });
  }

  const { plan } = await req.json().catch(() => ({}));
  if (!isPlan(plan)) return NextResponse.json({ error: "Unknown plan" }, { status: 400 });

  const status = await getProStatus(user.id);
  if (status.source !== "subscription") {
    return NextResponse.json({ error: "You don't have a paid plan to switch." }, { status: 400 });
  }
  if (status.plan === plan) return NextResponse.json({ pro: status });

  const { data: row } = await createAdminClient().from("subscriptions").select("stripe_subscription_id").eq("user_id", user.id).maybeSingle();
  if (!row?.stripe_subscription_id) return NextResponse.json({ error: "Subscription not found" }, { status: 404 });

  try {
    const sub = await stripe.subscriptions.retrieve(row.stripe_subscription_id);
    const item = sub.items.data[0];
    if (!item) return NextResponse.json({ error: "Subscription has no items" }, { status: 400 });

    const updated = await stripe.subscriptions.update(sub.id, {
      items: [
        {
          id: item.id,
          price_data: { currency: "gbp", unit_amount: PLANS[plan].pence, recurring: { interval: "month" }, product: await ensurePlanProduct(plan) },
        },
      ],
      proration_behavior: "create_prorations",
      metadata: { ...sub.metadata, type: "pro", plan, user_id: user.id },
    });

    await syncSubscription(updated, user.id);
    return NextResponse.json({ pro: await getProStatus(user.id) });
  } catch (e) {
    // Surface Stripe's reason instead of a blank 500.
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[billing/change-plan] Stripe error:", msg);
    return NextResponse.json({ error: `Stripe couldn't switch your plan: ${msg}` }, { status: 502 });
  }
}
