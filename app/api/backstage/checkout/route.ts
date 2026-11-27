import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { isBackstageMember } from "@/lib/backstage/server";

export const dynamic = "force-dynamic";
const UUID = /^[0-9a-f-]{36}$/i;

// POST /api/backstage/checkout { tierId } -> Stripe Checkout (monthly subscription).
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please log in to join." }, { status: 401 });
  if (!rateLimit(`backstage:${user.id}`, 10, 60 * 60 * 1000).ok) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  const { tierId } = await req.json().catch(() => ({}));
  if (typeof tierId !== "string" || !UUID.test(tierId)) return NextResponse.json({ error: "Choose a membership." }, { status: 400 });

  const admin = createAdminClient();
  const { data: tier } = await admin.from("backstage_tiers").select("id, artist_id, name, price_pence, active").eq("id", tierId).maybeSingle();
  if (!tier?.active) return NextResponse.json({ error: "That membership isn't available." }, { status: 404 });
  if (tier.artist_id === user.id) return NextResponse.json({ error: "You can't join your own Backstage." }, { status: 400 });
  if (await isBackstageMember(tier.artist_id, user.id)) return NextResponse.json({ error: "You're already a member." }, { status: 409 });

  const [{ data: artist }, { data: profile }] = await Promise.all([
    admin.from("profiles").select("full_name, username").eq("id", tier.artist_id).maybeSingle(),
    admin.from("profiles").select("stripe_customer_id, full_name").eq("id", user.id).maybeSingle(),
  ]);
  const artistName = (artist?.full_name && !artist.full_name.includes("@") ? artist.full_name : artist?.username) ?? "Artist";
  let customerId = profile?.stripe_customer_id ?? null;
  if (!customerId) {
    const c = await stripe.customers.create({ email: user.email ?? undefined, metadata: { user_id: user.id } });
    customerId = c.id;
    await admin.from("profiles").update({ stripe_customer_id: customerId }).eq("id", user.id);
  }
  const meta = { type: "backstage", artist_id: tier.artist_id, fan_id: user.id, tier_id: tier.id, price_pence: String(tier.price_pence) };
  const origin = req.headers.get("origin") ?? new URL(req.url).origin;
  const back = `/backstage/${artist?.username ?? ""}`;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: user.id,
    line_items: [{ quantity: 1, price_data: { currency: "gbp", unit_amount: tier.price_pence, recurring: { interval: "month" }, product_data: { name: `${artistName} Backstage: ${tier.name}` } } }],
    subscription_data: { metadata: meta },
    metadata: meta,
    success_url: `${origin}${back}?joined=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}${back}?joined=cancelled`,
  });
  return NextResponse.json({ url: session.url });
}
