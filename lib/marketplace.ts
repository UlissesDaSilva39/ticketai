import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyServer } from "@/lib/notify-server";

// GRID Marketplace (server-only helpers).
// Buyers pay the item price + a 10% GRID fee; sellers earn the item price.

export const MARKETPLACE_FEE_RATE = 0.1;
export const MARKETPLACE_BUCKET = "marketplace-files";
export const MARKETPLACE_KINDS = ["beat", "sample_pack", "service", "merch"] as const;
export type MarketplaceKind = (typeof MARKETPLACE_KINDS)[number];
export const MIN_PRICE_PENCE = 100;
export const MAX_PRICE_PENCE = 500_000;

/** Kinds that are delivered as a download (the seller must upload a file). */
export const DOWNLOADABLE: MarketplaceKind[] = ["beat", "sample_pack"];

export const isKind = (v: unknown): v is MarketplaceKind => typeof v === "string" && (MARKETPLACE_KINDS as readonly string[]).includes(v);
export const feeFor = (pence: number) => Math.round(pence * MARKETPLACE_FEE_RATE);

/**
 * Marks a marketplace order paid once Stripe says the Checkout session is paid.
 * Safe to call more than once (from the return page and from the webhook).
 */
export async function fulfilMarketplaceSession(session: Stripe.Checkout.Session): Promise<{ orderId: string | null; paid: boolean }> {
  const orderId = session.metadata?.order_id ?? null;
  if (session.metadata?.type !== "marketplace" || !orderId) return { orderId: null, paid: false };
  if (session.payment_status !== "paid") return { orderId, paid: false };

  const admin = createAdminClient();
  const shipping = (session as unknown as { collected_information?: { shipping_details?: unknown } }).collected_information?.shipping_details
    ?? (session as unknown as { shipping_details?: unknown }).shipping_details
    ?? null;

  // Only the first caller flips pending -> paid, so counts and notifications happen once.
  const { data: updated } = await admin
    .from("marketplace_orders")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null,
      shipping,
    })
    .eq("id", orderId)
    .eq("stripe_session_id", session.id)
    .eq("status", "pending")
    .select("id, listing_id, seller_id, amount_pence")
    .maybeSingle();

  if (updated) {
    const { data: listing } = await admin.from("marketplace_listings").select("title, sales_count").eq("id", updated.listing_id).maybeSingle();
    await admin
      .from("marketplace_listings")
      .update({ sales_count: (listing?.sales_count ?? 0) + 1 })
      .eq("id", updated.listing_id);
    await notifyServer({
      userId: updated.seller_id,
      type: "marketplace_sale",
      title: `You made a sale: ${listing?.title ?? "your listing"}`,
      body: `You earned £${(updated.amount_pence / 100).toFixed(2)}.`,
      href: "/marketplace",
    }).catch(() => undefined);
    return { orderId, paid: true };
  }

  const { data: existing } = await admin.from("marketplace_orders").select("status").eq("id", orderId).maybeSingle();
  return { orderId, paid: existing?.status === "paid" };
}

/** Stripe webhook hook: returns true when the event was a marketplace checkout. */
export async function handleMarketplaceEvent(event: Stripe.Event): Promise<boolean> {
  if (event.type !== "checkout.session.completed" && event.type !== "checkout.session.async_payment_succeeded") return false;
  const session = event.data.object as Stripe.Checkout.Session;
  if (session.metadata?.type !== "marketplace") return false;
  await fulfilMarketplaceSession(session);
  return true;
}
