import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { AD_PLANS, isAdPlan } from "@/lib/ads/catalog";
import { cleanHttpsUrl } from "@/lib/ads/server";

export const dynamic = "force-dynamic";

// POST /api/ads/checkout { plan, headline, body, imageUrl, linkUrl } -> Stripe Checkout URL.
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please log in to launch an ad." }, { status: 401 });
  if (!rateLimit(`ads:${user.id}`, 10, 60 * 60 * 1000).ok) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });

  const b = await req.json().catch(() => ({}));
  if (!isAdPlan(b.plan)) return NextResponse.json({ error: "Choose a plan." }, { status: 400 });
  const headline = typeof b.headline === "string" ? b.headline.trim() : "";
  const body = typeof b.body === "string" ? b.body.trim().slice(0, 200) : "";
  const link = cleanHttpsUrl(b.linkUrl);
  const image = b.imageUrl ? cleanHttpsUrl(b.imageUrl) : null;
  if (headline.length < 3 || headline.length > 80) return NextResponse.json({ error: "Write a headline (3 to 80 characters)." }, { status: 400 });
  if (!link) return NextResponse.json({ error: "Add the https:// link people should open." }, { status: 400 });
  if (b.imageUrl && !image) return NextResponse.json({ error: "The image must be an https:// link or an upload." }, { status: 400 });

  const plan = AD_PLANS[b.plan as keyof typeof AD_PLANS];
  const admin = createAdminClient();
  const { data: row, error } = await admin
    .from("ad_campaigns")
    .insert({ owner_id: user.id, plan: b.plan, headline, body: body || null, image_url: image, link_url: link, amount_pence: plan.pence, days: plan.days })
    .select("id")
    .single();
  if (error || !row) {
    console.error("[ads/checkout]", error?.message);
    return NextResponse.json({ error: "Advertising is being set up. Please try again soon." }, { status: 500 });
  }

  const origin = req.headers.get("origin") ?? new URL(req.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    client_reference_id: user.id,
    customer_email: user.email ?? undefined,
    line_items: [{ quantity: 1, price_data: { currency: "gbp", unit_amount: plan.pence, product_data: { name: `GRID ad: ${plan.name} (${plan.days} days)`, description: headline } } }],
    metadata: { type: "ad", campaign_id: row.id, user_id: user.id },
    success_url: `${origin}/advertise/campaigns?ad=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/advertise?ad=cancelled`,
  });
  await admin.from("ad_campaigns").update({ stripe_session_id: session.id }).eq("id", row.id);
  return NextResponse.json({ url: session.url });
}
