import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { packById } from "@/lib/live/catalog";
import { currentUser, safePath } from "@/lib/live/server";

export const dynamic = "force-dynamic";

// POST /api/coins/checkout { packId, returnTo }: Stripe Checkout for a coin pack.
export async function POST(req: NextRequest) {
  const { user } = await currentUser();
  if (!user) return NextResponse.json({ error: "Please log in to buy coins." }, { status: 401 });
  if (!rateLimit(`coins-checkout:${user.id}`, 20, 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }
  const b = await req.json().catch(() => ({}));
  const pack = typeof b.packId === "string" ? packById(b.packId) : undefined;
  if (!pack) return NextResponse.json({ error: "Choose a coin pack." }, { status: 400 });
  const returnTo = safePath(b.returnTo, "/live");

  const admin = createAdminClient();
  const { data: purchase, error } = await admin
    .from("coin_purchases")
    .insert({ user_id: user.id, pack_id: pack.id, coins: pack.coins, amount_pence: pack.pence, return_to: returnTo })
    .select("id")
    .single();
  if (error || !purchase) {
    console.error("[coins checkout]", error?.message);
    return NextResponse.json({ error: "Coins are being set up. Please try again soon." }, { status: 500 });
  }

  const origin = req.headers.get("origin") ?? new URL(req.url).origin;
  const sep = returnTo.includes("?") ? "&" : "?";
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: user.id,
      customer_email: user.email ?? undefined,
      line_items: [{ quantity: 1, price_data: { currency: "gbp", unit_amount: pack.pence, product_data: { name: `${pack.coins.toLocaleString("en-GB")} GRID coins`, description: "Send gifts to artists during GRID LIVE" } } }],
      metadata: { type: "coins", purchase_id: purchase.id, user_id: user.id },
      payment_intent_data: { metadata: { type: "coins", purchase_id: purchase.id } },
      success_url: `${origin}${returnTo}${sep}coins=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${returnTo}${sep}coins=cancelled`,
    });
    await admin.from("coin_purchases").update({ stripe_session_id: session.id }).eq("id", purchase.id);
    return NextResponse.json({ url: session.url });
  } catch (e) {
    await admin.from("coin_purchases").update({ status: "cancelled" }).eq("id", purchase.id);
    console.error("[coins checkout] stripe", e);
    return NextResponse.json({ error: "Payments aren't available right now. Please try again." }, { status: 502 });
  }
}
