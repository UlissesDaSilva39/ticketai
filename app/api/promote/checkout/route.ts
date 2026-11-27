import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { isPromoKind, promoPlan } from "@/lib/promote/catalog";
import { promotableTitle } from "@/lib/promote/server";
import { safePath } from "@/lib/live/server";

export const dynamic = "force-dynamic";
const UUID = /^[0-9a-f-]{36}$/i;

// POST /api/promote/checkout { kind, refId, plan, returnTo } -> Stripe Checkout URL.
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please log in to promote." }, { status: 401 });
  if (!rateLimit(`promote:${user.id}`, 20, 60 * 60 * 1000).ok) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });

  const { kind, refId, plan: planId, returnTo } = await req.json().catch(() => ({}));
  const plan = promoPlan(planId);
  if (!isPromoKind(kind) || !plan || typeof refId !== "string" || !UUID.test(refId)) {
    return NextResponse.json({ error: "Choose what to promote and for how long." }, { status: 400 });
  }
  const title = await promotableTitle(kind, refId, user.id);
  if (!title) return NextResponse.json({ error: "You can only promote your own posts, listings, lives or profile." }, { status: 403 });

  const admin = createAdminClient();
  const { data: row, error } = await admin
    .from("promotions")
    .insert({ owner_id: user.id, kind, ref_id: refId, plan: plan.id, amount_pence: plan.pence })
    .select("id")
    .single();
  if (error || !row) {
    console.error("[promote/checkout]", error?.message);
    return NextResponse.json({ error: "Promotions are being set up. Please try again soon." }, { status: 500 });
  }

  const origin = req.headers.get("origin") ?? new URL(req.url).origin;
  const back = safePath(returnTo, "/boost");
  const sep = back.includes("?") ? "&" : "?";
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    client_reference_id: user.id,
    customer_email: user.email ?? undefined,
    line_items: [{ quantity: 1, price_data: { currency: "gbp", unit_amount: plan.pence, product_data: { name: `GRID Boost (${plan.label})`, description: title.slice(0, 200) } } }],
    metadata: { type: "promotion", promotion_id: row.id, user_id: user.id },
    success_url: `${origin}${back}${sep}promoted=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}${back}${sep}promoted=cancelled`,
  });
  await admin.from("promotions").update({ stripe_session_id: session.id }).eq("id", row.id);
  return NextResponse.json({ url: session.url });
}
