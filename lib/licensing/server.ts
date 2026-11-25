import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyServer } from "@/lib/notify-server";
import { LICENCE_INFO, formatGbp, isLicenceType, type ListingPrices } from "./agreement";

// GRID Licensing (server-only helpers). Licensees pay the licence fee + 10% GRID
// fee; licensors earn the licence fee into the same seller balance as the
// Marketplace (see lib/marketplace-seller.ts).

export const LICENCE_BUCKET = "marketplace-files";

export const displayName = (p: { full_name: string | null; username: string | null } | null | undefined) =>
  (p?.full_name && !p.full_name.includes("@") ? p.full_name : p?.username) || "GRID member";

export const pricesOf = (r: { price_creator: number | null; price_commercial: number | null; price_sync: number | null }): ListingPrices => ({
  creator: r.price_creator,
  commercial: r.price_commercial,
  sync: r.price_sync,
});

/**
 * Activates a licence once Stripe says the Checkout session is paid.
 * Safe to call more than once (return page and webhook both call it).
 */
export async function fulfilLicenceSession(session: Stripe.Checkout.Session): Promise<{ dealId: string | null; active: boolean }> {
  const dealId = session.metadata?.deal_id ?? null;
  if (session.metadata?.type !== "licence" || !dealId) return { dealId: null, active: false };
  if (session.payment_status !== "paid") return { dealId, active: false };

  const admin = createAdminClient();
  // Only the first caller flips pending -> active, so counts and notifications happen once.
  const { data: updated } = await admin
    .from("licence_deals")
    .update({
      status: "active",
      paid_at: new Date().toISOString(),
      stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null,
    })
    .eq("id", dealId)
    .eq("stripe_session_id", session.id)
    .eq("status", "pending")
    .select("id, listing_id, seller_id, buyer_id, amount_pence, licence_type, project_title")
    .maybeSingle();

  if (updated) {
    const { data: listing } = await admin.from("licence_listings").select("track_title, deals_count").eq("id", updated.listing_id).maybeSingle();
    await admin
      .from("licence_listings")
      .update({ deals_count: (listing?.deals_count ?? 0) + 1 })
      .eq("id", updated.listing_id);
    const typeName = isLicenceType(updated.licence_type) ? LICENCE_INFO[updated.licence_type].name : "Licence";
    await Promise.all([
      notifyServer({
        userId: updated.seller_id,
        type: "licence_sale",
        title: `New ${typeName}: ${listing?.track_title ?? "your track"}`,
        body: `Licensed for "${updated.project_title}". You earned ${formatGbp(updated.amount_pence)}.`,
        href: `/licences/${updated.id}`,
      }).catch(() => undefined),
      notifyServer({
        userId: updated.buyer_id,
        type: "licence_purchase",
        title: `Your licence for ${listing?.track_title ?? "the track"} is active`,
        body: "Download the track and your signed agreement.",
        href: `/licences/${updated.id}`,
      }).catch(() => undefined),
    ]);
    return { dealId, active: true };
  }

  const { data: existing } = await admin.from("licence_deals").select("status").eq("id", dealId).maybeSingle();
  return { dealId, active: existing?.status === "active" };
}

/** Stripe webhook hook: returns true when the event was a licence checkout. */
export async function handleLicenceEvent(event: Stripe.Event): Promise<boolean> {
  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.metadata?.type !== "licence") return false;
    await fulfilLicenceSession(session);
    return true;
  }
  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.metadata?.type !== "licence" || !session.metadata.deal_id) return false;
    await createAdminClient()
      .from("licence_deals")
      .update({ status: "cancelled" })
      .eq("id", session.metadata.deal_id)
      .eq("status", "pending");
    return true;
  }
  if (event.type === "charge.refunded" || event.type === "charge.dispute.created") {
    // Clause 4.3: a refunded or charged-back payment ends the licence.
    const obj = event.data.object as { payment_intent?: string | { id: string } | null };
    const pi = typeof obj.payment_intent === "string" ? obj.payment_intent : obj.payment_intent?.id;
    if (!pi) return false;
    const { data } = await createAdminClient()
      .from("licence_deals")
      .update({ status: event.type === "charge.refunded" ? "refunded" : "revoked" })
      .eq("stripe_payment_intent", pi)
      .eq("status", "active")
      .select("id");
    return !!data?.length;
  }
  return false;
}
