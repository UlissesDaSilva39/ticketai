import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ensurePlanProduct, getProStatus, isBilling, isPlan, planPrice, PRO_TRIAL_DAYS, type Billing, type Plan } from "@/lib/pro";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// Start GRID Pro (£5) or Premium (£15): creates a Stripe Checkout session
// (monthly subscription, 30-day free trial the first time) and returns its URL.
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please log in first." }, { status: 401 });

  if (!rateLimit(`checkout:${user.id}`, 10, 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const { plan: rawPlan, billing: rawBilling } = await req.json().catch(() => ({}));
  const plan: Plan = isPlan(rawPlan) ? rawPlan : "pro";
  const billing: Billing = isBilling(rawBilling) ? rawBilling : "month";

  const pro = await getProStatus(user.id);
  if (pro.active && pro.source === "subscription") {
    return NextResponse.json({ error: "You already have a plan. Use “Switch plan” instead." }, { status: 400 });
  }

  // Reuse (or create) this member's Stripe customer.
  const admin = createAdminClient();
  const { data: profile } = await admin.from("profiles").select("stripe_customer_id, full_name").eq("id", user.id).maybeSingle();
  let customerId = profile?.stripe_customer_id ?? null;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      name: profile?.full_name && !profile.full_name.includes("@") ? profile.full_name : undefined,
      metadata: { user_id: user.id },
    });
    customerId = customer.id;
    await admin.from("profiles").update({ stripe_customer_id: customerId }).eq("id", user.id);
  }

  const origin = req.headers.get("origin") ?? new URL(req.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: user.id,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "gbp",
          unit_amount: planPrice(plan, billing),
          recurring: { interval: billing },
          product: await ensurePlanProduct(plan),
        },
      },
    ],
    subscription_data: {
      metadata: { type: "pro", plan, billing, user_id: user.id },
      // Free trial only the first time someone subscribes.
      ...(pro.hadSubscription ? {} : { trial_period_days: PRO_TRIAL_DAYS }),
    },
    payment_method_collection: "always",
    allow_promotion_codes: true,
    metadata: { type: "pro", plan, billing, user_id: user.id },
    success_url: `${origin}/pro?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pro?checkout=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
