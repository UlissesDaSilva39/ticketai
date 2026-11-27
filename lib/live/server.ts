import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";

// Server-only helpers for GRID LIVE.

export const UUID = /^[0-9a-f-]{36}$/i;

export async function currentUser() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export const displayName = (p: { full_name: string | null; username: string | null } | null | undefined) =>
  (p?.full_name && !p.full_name.includes("@") ? p.full_name : p?.username) || "GRID member";

/** Same-site path only (never an external URL). */
export const safePath = (v: unknown, fallback: string) =>
  typeof v === "string" && v.startsWith("/") && !v.startsWith("//") && v.length < 300 ? v : fallback;

/** Credits a paid coin pack exactly once (return page and webhook both call it). */
export async function fulfilCoinSession(session: Stripe.Checkout.Session): Promise<{ purchaseId: string | null; credited: boolean }> {
  const purchaseId = session.metadata?.purchase_id ?? null;
  if (session.metadata?.type !== "coins" || !purchaseId) return { purchaseId: null, credited: false };
  if (session.payment_status !== "paid") return { purchaseId, credited: false };
  const admin = createAdminClient();
  const { error } = await admin.rpc("grid_credit_coins", { p_purchase: purchaseId, p_session: session.id });
  if (error) console.error("[coins] credit failed:", error.message);
  const { data } = await admin.from("coin_purchases").select("status").eq("id", purchaseId).maybeSingle();
  return { purchaseId, credited: data?.status === "paid" };
}

/** Stripe webhook hook: returns true when the event was a coin purchase. */
export async function handleCoinsEvent(event: Stripe.Event): Promise<boolean> {
  if (event.type !== "checkout.session.completed" && event.type !== "checkout.session.async_payment_succeeded") return false;
  const session = event.data.object as Stripe.Checkout.Session;
  if (session.metadata?.type !== "coins") return false;
  await fulfilCoinSession(session);
  return true;
}

/** Posts a "someone bought X" line in a live room's chat (social proof). */
export async function announceLivePurchase(streamId: string, buyerId: string, title: string) {
  if (!UUID.test(streamId)) return;
  const admin = createAdminClient();
  const { data: p } = await admin.from("profiles").select("full_name, username").eq("id", buyerId).maybeSingle();
  await admin
    .from("live_messages")
    .insert({ stream_id: streamId, user_id: buyerId, kind: "purchase", body: `${displayName(p)} bought ${title}`.slice(0, 300) })
    .then(({ error }) => error && console.error("[live] purchase announce failed:", error.message));
}
