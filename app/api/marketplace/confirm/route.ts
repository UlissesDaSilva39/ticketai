import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DOWNLOADABLE, fulfilMarketplaceSession } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

// POST /api/marketplace/confirm { sessionId }: called when the buyer returns from
// Stripe, so the purchase unlocks straight away even before the webhook arrives.
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { sessionId } = await req.json().catch(() => ({}));
  if (typeof sessionId !== "string" || !sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.client_reference_id !== user.id || session.metadata?.type !== "marketplace") {
    return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
  }

  const { orderId, paid } = await fulfilMarketplaceSession(session);
  if (!orderId) return NextResponse.json({ error: "Purchase not found" }, { status: 404 });

  const admin = createAdminClient();
  const { data: order } = await admin.from("marketplace_orders").select("id, listing_id, seller_id, total_pence").eq("id", orderId).maybeSingle();
  const { data: listing } = order
    ? await admin.from("marketplace_listings").select("title, kind").eq("id", order.listing_id).maybeSingle()
    : { data: null };
  const { data: seller } = order
    ? await admin.from("profiles").select("full_name, username").eq("id", order.seller_id).maybeSingle()
    : { data: null };

  return NextResponse.json({
    paid,
    orderId,
    title: listing?.title ?? null,
    kind: listing?.kind ?? null,
    sellerId: order?.seller_id ?? null,
    sellerName: (seller?.full_name && !seller.full_name.includes("@") ? seller.full_name : seller?.username) || "the seller",
    totalPence: order?.total_pence ?? null,
    downloadable: !!listing && (DOWNLOADABLE as string[]).includes(listing.kind),
  });
}
