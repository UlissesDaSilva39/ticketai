import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProStatus, PRO_PRICE_PENCE, PRO_TRIAL_DAYS } from "@/lib/pro";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// Start GRID Pro: creates a Stripe Checkout session (subscription, £5/month,
// 30-day free trial the first time) and returns its URL.
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please log in first." }, { status: 401 });

  if (!rateLimit(`checkout:${user.id}`, 10, 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const pro = await getProStatus(user.id);
  if (pro.active && pro.source === "subscription") {
    return NextResponse.json({ error: "You already have GRID Pro." }, { status: 400 });
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
          unit_amount: PRO_PRICE_PENCE,
          recurring: { interval: "month" },
          product_data: { name: "GRID Pro", description: "Unlimited applications, priority matching, analytics and a Pro badge." },
        },
      },
    ],
    subscription_data: {
      metadata: { type: "pro", user_id: user.id },
      // Free trial only the first time someone subscribes.
      ...(pro.hadSubscription ? {} : { trial_period_days: PRO_TRIAL_DAYS }),
    },
    payment_method_collection: "always",
    allow_promotion_codes: true,
    metadata: { type: "pro", user_id: user.id },
    success_url: `${origin}/pro?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pro?checkout=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
