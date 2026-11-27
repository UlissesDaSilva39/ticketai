// Server-only: paid promotions ("Boost anything"). Payment by Stripe Checkout;
// the return page and the webhook both activate it, exactly once.
import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { isPromoKind, type PromoKind } from "./catalog";

/** What is being promoted, if the member owns it and it can still be promoted. */
export async function promotableTitle(kind: PromoKind, refId: string, userId: string): Promise<string | null> {
  const admin = createAdminClient();
  if (kind === "profile") return refId === userId ? "Your profile" : null;
  if (kind === "post") {
    const { data } = await admin.from("posts").select("author_id, body").eq("id", refId).maybeSingle();
    return data && data.author_id === userId ? `Post: ${String(data.body ?? "").slice(0, 60) || "your post"}` : null;
  }
  if (kind === "listing") {
    const { data } = await admin.from("marketplace_listings").select("seller_id, title, status").eq("id", refId).maybeSingle();
    return data && data.seller_id === userId && data.status === "active" ? `Listing: ${data.title}` : null;
  }
  const { data } = await admin.from("live_streams").select("host_id, title, status").eq("id", refId).maybeSingle();
  return data && data.host_id === userId && data.status !== "ended" ? `Live: ${data.title}` : null;
}

/** Turns a paid promotion on (idempotent). Returns the promotion row when active. */
export async function activatePromotion(session: Stripe.Checkout.Session) {
  const id = session.metadata?.promotion_id;
  if (session.metadata?.type !== "promotion" || !id || session.payment_status !== "paid") return null;
  const admin = createAdminClient();
  const { data: row } = await admin.from("promotions").select("*").eq("id", id).maybeSingle();
  if (!row) return null;
  if (row.status === "active") return row;
  if (row.stripe_session_id && row.stripe_session_id !== session.id) return null;

  const days = row.plan === "7d" ? 7 : row.plan === "3d" ? 3 : 1;
  const now = new Date();
  const ends = new Date(now.getTime() + days * 86400000).toISOString();
  // Only the first caller flips pending -> active.
  const { data: updated } = await admin
    .from("promotions")
    .update({ status: "active", starts_at: now.toISOString(), ends_at: ends, stripe_session_id: session.id })
    .eq("id", id)
    .eq("status", "pending")
    .select("*")
    .maybeSingle();
  if (!updated) return (await admin.from("promotions").select("*").eq("id", id).maybeSingle()).data;
  if (updated.kind === "post") {
    await admin.from("post_boosts").insert({ post_id: updated.ref_id, user_id: updated.owner_id, source: "paid", ends_at: ends });
  }
  return updated;
}

export async function handlePromotionEvent(event: Stripe.Event): Promise<boolean> {
  if (event.type !== "checkout.session.completed" && event.type !== "checkout.session.async_payment_succeeded") return false;
  const session = event.data.object as Stripe.Checkout.Session;
  if (session.metadata?.type !== "promotion") return false;
  await activatePromotion(session);
  return true;
}

/** Ids currently promoted for a kind (newest first). Empty if the table isn't there yet. */
export async function promotedIds(kind: PromoKind): Promise<string[]> {
  if (!isPromoKind(kind)) return [];
  const { data, error } = await createAdminClient()
    .from("promotions")
    .select("ref_id")
    .eq("kind", kind)
    .eq("status", "active")
    .gt("ends_at", new Date().toISOString())
    .order("starts_at", { ascending: false })
    .limit(20);
  if (error) return [];
  return [...new Set((data ?? []).map((r) => r.ref_id as string))];
}
