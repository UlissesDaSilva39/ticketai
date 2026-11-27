// Server-only: paid submissions. Payment by Stripe Checkout; reviewers must reply
// within REPLY_DAYS or the sender is refunded in full.
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyServer } from "@/lib/notify-server";
import { REPLY_DAYS } from "./catalog";

/** Marks a submission as paid and delivered (idempotent). */
export async function markSubmissionPaid(session: Stripe.Checkout.Session) {
  const id = session.metadata?.submission_id;
  if (session.metadata?.type !== "submission" || !id || session.payment_status !== "paid") return null;
  const admin = createAdminClient();
  const now = new Date();
  const { data: updated } = await admin
    .from("submissions")
    .update({ status: "sent", paid_at: now.toISOString(), due_at: new Date(now.getTime() + REPLY_DAYS * 86400000).toISOString(), stripe_session_id: session.id })
    .eq("id", id)
    .eq("status", "pending_payment")
    .select("id, kind, reviewer_id, title")
    .maybeSingle();
  if (updated) {
    await notifyServer({
      userId: updated.reviewer_id,
      type: "messages",
      title: updated.kind === "demo" ? `New demo: ${updated.title ?? "a new track"}` : "New priority message",
      body: `Reply within ${REPLY_DAYS} days to earn your share.`,
      href: "/submit/inbox",
    }).catch(() => undefined);
  }
  return (await admin.from("submissions").select("id, status").eq("id", id).maybeSingle()).data;
}

export async function handleSubmissionEvent(event: Stripe.Event): Promise<boolean> {
  if (event.type !== "checkout.session.completed" && event.type !== "checkout.session.async_payment_succeeded") return false;
  const session = event.data.object as Stripe.Checkout.Session;
  if (session.metadata?.type !== "submission") return false;
  await markSubmissionPaid(session);
  return true;
}

/** Refunds paid submissions nobody answered in time. Safe to call often. */
export async function refundOverdue(limit = 25) {
  const admin = createAdminClient();
  const { data: overdue, error } = await admin
    .from("submissions")
    .select("id, sender_id, stripe_session_id")
    .eq("status", "sent")
    .lt("due_at", new Date().toISOString())
    .limit(limit);
  if (error) return 0;
  let n = 0;
  for (const s of overdue ?? []) {
    // Claim it first so two callers can't refund twice.
    const { data: claimed } = await admin.from("submissions").update({ status: "refunded" }).eq("id", s.id).eq("status", "sent").select("id").maybeSingle();
    if (!claimed) continue;
    try {
      if (s.stripe_session_id) {
        const cs = await stripe.checkout.sessions.retrieve(s.stripe_session_id);
        const pi = typeof cs.payment_intent === "string" ? cs.payment_intent : cs.payment_intent?.id;
        if (pi) await stripe.refunds.create({ payment_intent: pi }, { idempotencyKey: `submission-refund-${s.id}` });
      }
      n++;
      await notifyServer({ userId: s.sender_id, type: "messages", title: "No reply in time: you've been refunded", body: "Your submission fee is on its way back to your card.", href: "/submit/sent" }).catch(() => undefined);
    } catch (e) {
      // Put it back so the next run tries again.
      console.error("[submissions] refund failed", s.id, e instanceof Error ? e.message : e);
      await admin.from("submissions").update({ status: "sent" }).eq("id", s.id).eq("status", "refunded");
    }
  }
  return n;
}
