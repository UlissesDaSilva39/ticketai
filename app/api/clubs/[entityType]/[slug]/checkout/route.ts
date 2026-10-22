import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ entityType: string; slug: string }> }
) {
  const { entityType, slug } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const body = await req.json();
  const tierId = body.tierId;
  if (!tierId) return NextResponse.json({ error: "Missing tierId" }, { status: 400 });

  // Look up tier to get price
  const { data: tier } = await supabase
    .from("club_tiers")
    .select("id, name, price_monthly")
    .eq("id", tierId)
    .eq("entity_type", entityType)
    .eq("entity_id", slug)
    .maybeSingle();

  if (!tier) return NextResponse.json({ error: "Tier not found" }, { status: 404 });

  // Check for Stripe key
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  
  if (!stripeKey) {
    // FALLBACK: If no Stripe key, create membership directly (dev mode)
    console.warn("STRIPE_SECRET_KEY not set — using direct membership (dev mode)");
    
    const { data: membership, error } = await supabase
      .from("user_memberships")
      .upsert({
        user_id: user.id,
        entity_type: entityType,
        entity_id: slug,
        tier_id: tier.id,
        status: "active",
        stripe_payment_status: "dev_mode",
        amount_paid: tier.price_monthly,
        currency: "gbp",
      }, { onConflict: "user_id,entity_type,entity_id" })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({
      checkout_url: `/clubs/success?tier=${tier.name}&entity=${slug}&dev=1`,
      dev_mode: true,
    });
  }

  // PRODUCTION: Create Stripe Checkout Session
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(stripeKey, { apiVersion: "2024-11-20.acacia" as any });

  const origin = new URL(req.url).origin;
  
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{
        price_data: {
          currency: "gbp",
          product_data: {
            name: `${slug.replace(/-/g, ' ')} — ${tier.name}`,
            description: `Monthly membership · Cancel anytime`,
          },
          unit_amount: Math.round(Number(tier.price_monthly) * 100),
          recurring: { interval: "month" },
        },
        quantity: 1,
      }],
      subscription_data: {
        metadata: {
          user_id: user.id,
          entity_type: entityType,
          entity_id: slug,
          tier_id: tier.id,
        },
      },
      success_url: `${origin}/clubs/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/clubs/${entityType}/${slug}?canceled=1`,
      customer_email: user.email,
    });

    return NextResponse.json({ checkout_url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Stripe error" }, { status: 500 });
  }
}