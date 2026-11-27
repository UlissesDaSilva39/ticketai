// Server-only: Backstage memberships (Stripe subscriptions tagged type=backstage).
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyServer } from "@/lib/notify-server";
import { ACTIVE_MEMBER_STATUSES, ARTIST_SHARE } from "./catalog";

const toIso = (unix?: number | null) => (unix ? new Date(unix * 1000).toISOString() : null);

/** Save a Backstage subscription onto backstage_members. */
export async function syncBackstageSub(sub: Stripe.Subscription) {
  const m = sub.metadata ?? {};
  if (m.type !== "backstage" || !m.artist_id || !m.fan_id) return;
  const anySub = sub as unknown as { current_period_end?: number; items?: { data?: { current_period_end?: number; price?: { unit_amount?: number | null } }[] } };
  const periodEnd = anySub.current_period_end ?? anySub.items?.data?.[0]?.current_period_end ?? null;
  const { error } = await createAdminClient()
    .from("backstage_members")
    .upsert(
      {
        artist_id: m.artist_id,
        fan_id: m.fan_id,
        tier_id: m.tier_id || null,
        price_pence: anySub.items?.data?.[0]?.price?.unit_amount ?? Number(m.price_pence || 0),
        status: sub.status,
        stripe_subscription_id: sub.id,
        current_period_end: toIso(periodEnd),
        cancel_at_period_end: !!sub.cancel_at_period_end,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "artist_id,fan_id" }
    );
  if (error) console.error("[backstage] member upsert failed:", error.message);
}

/** Record a paid month for the artist's balance (idempotent on the invoice id). */
async function recordInvoice(invoice: Stripe.Invoice) {
  if (!invoice.id || !invoice.amount_paid) return;
  const anyInv = invoice as unknown as {
    subscription?: string | { id: string } | null;
    subscription_details?: { metadata?: Record<string, string> | null } | null;
    parent?: { subscription_details?: { metadata?: Record<string, string> | null; subscription?: string | { id: string } | null } | null } | null;
  };
  let meta = anyInv.parent?.subscription_details?.metadata ?? anyInv.subscription_details?.metadata ?? null;
  if (!meta?.type) {
    const subRef = anyInv.parent?.subscription_details?.subscription ?? anyInv.subscription;
    const subId = typeof subRef === "string" ? subRef : subRef?.id;
    if (!subId) return;
    meta = (await stripe.subscriptions.retrieve(subId)).metadata;
  }
  if (meta?.type !== "backstage" || !meta.artist_id || !meta.fan_id) return;
  const admin = createAdminClient();
  const { error } = await admin.from("backstage_payments").insert({
    artist_id: meta.artist_id,
    fan_id: meta.fan_id,
    stripe_invoice_id: invoice.id,
    amount_pence: invoice.amount_paid,
    artist_earn_pence: Math.floor(invoice.amount_paid * ARTIST_SHARE),
    paid_at: toIso(invoice.status_transitions?.paid_at) ?? new Date().toISOString(),
  });
  // 23505 = already recorded (webhook retried): fine.
  if (error && error.code !== "23505") console.error("[backstage] payment insert failed:", error.message);
}

export async function handleBackstageEvent(event: Stripe.Event): Promise<boolean> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.metadata?.type !== "backstage") return false;
      if (session.subscription) {
        const id = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
        await syncBackstageSub(await stripe.subscriptions.retrieve(id));
      }
      return true;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      if (sub.metadata?.type !== "backstage") return false;
      await syncBackstageSub(sub);
      return true;
    }
    case "invoice.paid": {
      await recordInvoice(event.data.object as Stripe.Invoice);
      return false; // let other handlers see invoices too
    }
    default:
      return false;
  }
}

export async function isBackstageMember(artistId: string, fanId: string | null | undefined) {
  if (!fanId) return false;
  if (artistId === fanId) return true;
  const { data } = await createAdminClient().from("backstage_members").select("status").eq("artist_id", artistId).eq("fan_id", fanId).maybeSingle();
  return !!data && ACTIVE_MEMBER_STATUSES.includes(data.status);
}

/** Tell members about a new Backstage post. */
export async function notifyMembers(artistId: string, artistName: string, preview: string) {
  const { data } = await createAdminClient().from("backstage_members").select("fan_id").eq("artist_id", artistId).in("status", ACTIVE_MEMBER_STATUSES).limit(500);
  const { data: p } = await createAdminClient().from("profiles").select("username").eq("id", artistId).maybeSingle();
  await Promise.all(
    (data ?? []).map((m) =>
      notifyServer({ userId: m.fan_id, type: "posts", title: `New on ${artistName}'s Backstage`, body: preview.slice(0, 120), href: p?.username ? `/backstage/${p.username}` : "/backstage" }).catch(() => undefined)
    )
  );
}
