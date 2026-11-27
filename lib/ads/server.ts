// Server-only: self-serve ad campaigns. Paid by Stripe Checkout, then reviewed by
// a GRID admin before they show (so nothing unsafe goes live automatically).
import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

/** Marks a campaign as paid and waiting for review (idempotent). */
export async function markAdPaid(session: Stripe.Checkout.Session) {
  const id = session.metadata?.campaign_id;
  if (session.metadata?.type !== "ad" || !id || session.payment_status !== "paid") return null;
  const admin = createAdminClient();
  await admin
    .from("ad_campaigns")
    .update({ status: "in_review", paid_at: new Date().toISOString(), stripe_session_id: session.id })
    .eq("id", id)
    .eq("status", "pending_payment");
  const { data } = await admin.from("ad_campaigns").select("id, status").eq("id", id).maybeSingle();
  return data;
}

export async function handleAdEvent(event: Stripe.Event): Promise<boolean> {
  if (event.type !== "checkout.session.completed" && event.type !== "checkout.session.async_payment_succeeded") return false;
  const session = event.data.object as Stripe.Checkout.Session;
  if (session.metadata?.type !== "ad") return false;
  await markAdPaid(session);
  return true;
}

/** Only https links and images (no javascript:, data: etc.). */
export function cleanHttpsUrl(v: unknown, max = 500): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!s || s.length > max) return null;
  try {
    const u = new URL(s);
    return u.protocol === "https:" ? u.toString() : null;
  } catch {
    return null;
  }
}
