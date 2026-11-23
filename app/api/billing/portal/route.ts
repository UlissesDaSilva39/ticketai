import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// "Manage subscription": Stripe's own page to cancel, change card or see invoices.
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { data: profile } = await createAdminClient().from("profiles").select("stripe_customer_id").eq("id", user.id).maybeSingle();
  if (!profile?.stripe_customer_id) return NextResponse.json({ error: "No subscription to manage yet." }, { status: 400 });

  const origin = req.headers.get("origin") ?? new URL(req.url).origin;
  try {
    const portal = await stripe.billingPortal.sessions.create({ customer: profile.stripe_customer_id, return_url: `${origin}/pro` });
    return NextResponse.json({ url: portal.url });
  } catch (e) {
    console.error("[billing/portal]", e);
    return NextResponse.json(
      { error: "Subscription management isn't set up yet. (Stripe: save the Customer portal settings once.)" },
      { status: 503 }
    );
  }
}
