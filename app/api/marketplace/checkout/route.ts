import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { MAX_PRICE_PENCE, feeFor } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

// POST /api/marketplace/checkout { listingId, pricePence? }
// Creates a pending order and a Stripe Checkout session (item + 10% GRID fee).
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please log in to buy." }, { status: 401 });
  if (!rateLimit(`market-checkout:${user.id}`, 20, 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const listingId = String(body.listingId ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(listingId)) return NextResponse.json({ error: "Listing not found." }, { status: 404 });

  const admin = createAdminClient();
  const { data: listing } = await admin
    .from("marketplace_listings")
    .select("id, seller_id, kind, title, price_pence, pay_what_you_want, status")
    .eq("id", listingId)
    .maybeSingle();
  if (!listing || listing.status !== "active") return NextResponse.json({ error: "This listing is no longer available." }, { status: 404 });
  if (listing.seller_id === user.id) return NextResponse.json({ error: "You can't buy your own listing." }, { status: 400 });

  // Pay-what-you-want: the buyer may pay more, never less than the listed price.
  let amount = listing.price_pence;
  if (listing.pay_what_you_want && body.pricePence != null) {
    const chosen = Math.round(Number(body.pricePence));
    if (!Number.isFinite(chosen) || chosen < listing.price_pence) {
      return NextResponse.json({ error: `The minimum price is £${(listing.price_pence / 100).toFixed(2)}.` }, { status: 400 });
    }
    if (chosen > MAX_PRICE_PENCE) return NextResponse.json({ error: "That price is too high." }, { status: 400 });
    amount = chosen;
  }
  const fee = feeFor(amount);

  const { data: order, error } = await admin
    .from("marketplace_orders")
    .insert({ listing_id: listing.id, buyer_id: user.id, seller_id: listing.seller_id, amount_pence: amount, fee_pence: fee, total_pence: amount + fee })
    .select("id")
    .single();
  if (error || !order) {
    console.error("[marketplace/checkout]", error?.message);
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }

  const origin = req.headers.get("origin") ?? new URL(req.url).origin;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: user.id,
      customer_email: user.email ?? undefined,
      line_items: [
        { quantity: 1, price_data: { currency: "gbp", unit_amount: amount, product_data: { name: listing.title } } },
        { quantity: 1, price_data: { currency: "gbp", unit_amount: fee, product_data: { name: "GRID fee (10%)" } } },
      ].filter((l) => l.price_data.unit_amount > 0),
      ...(listing.kind === "merch" ? { shipping_address_collection: { allowed_countries: ["GB", "IE", "US", "CA", "AU", "DE", "FR", "ES", "IT", "NL"] } } : {}),
      metadata: { type: "marketplace", order_id: order.id, listing_id: listing.id, user_id: user.id },
      payment_intent_data: { metadata: { type: "marketplace", order_id: order.id } },
      success_url: `${origin}/marketplace?purchase=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/marketplace?purchase=cancelled`,
    });
    await admin.from("marketplace_orders").update({ stripe_session_id: session.id }).eq("id", order.id);
    return NextResponse.json({ url: session.url });
  } catch (e) {
    await admin.from("marketplace_orders").update({ status: "cancelled" }).eq("id", order.id);
    console.error("[marketplace/checkout] stripe", e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "Payment provider error." }, { status: 502 });
  }
}
