// Server-only: GRID Pro status and Stripe subscription syncing (service key).
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const PRO_PRICE_PENCE = 500; // £5 / month
export const PRO_TRIAL_DAYS = 30;
export const REFERRAL_REWARD_DAYS = 30;

// Stripe statuses that count as "has Pro". past_due keeps access while Stripe retries the card.
const ACTIVE_STATUSES = new Set(["trialing", "active", "past_due"]);

export type ProStatus = {
  active: boolean;
  source: "subscription" | "grant" | null;
  status: string | null; // Stripe status, when there is a subscription
  trialing: boolean;
  until: string | null; // when the current trial/period/grant ends
  cancelAtPeriodEnd: boolean;
  hasSubscription: boolean; // can open "Manage subscription"
  hadSubscription: boolean; // already used the free trial before
};

export async function getProStatus(userId: string): Promise<ProStatus> {
  const admin = createAdminClient();
  const now = new Date().toISOString();
  const [{ data: sub }, { data: grant }] = await Promise.all([
    admin.from("subscriptions").select("status, trial_end, current_period_end, cancel_at_period_end, stripe_customer_id").eq("user_id", userId).maybeSingle(),
    admin.from("pro_grants").select("expires_at").eq("user_id", userId).gt("expires_at", now).order("expires_at", { ascending: false }).limit(1).maybeSingle(),
  ]);

  const subActive = !!sub && ACTIVE_STATUSES.has(sub.status);
  if (subActive) {
    const trialing = sub.status === "trialing";
    return {
      active: true,
      source: "subscription",
      status: sub.status,
      trialing,
      until: (trialing ? sub.trial_end : sub.current_period_end) ?? null,
      cancelAtPeriodEnd: !!sub.cancel_at_period_end,
      hasSubscription: true,
      hadSubscription: true,
    };
  }
  if (grant) {
    return {
      active: true,
      source: "grant",
      status: sub?.status ?? null,
      trialing: false,
      until: grant.expires_at,
      cancelAtPeriodEnd: false,
      hasSubscription: !!sub?.stripe_customer_id,
      hadSubscription: !!sub,
    };
  }
  return {
    active: false,
    source: null,
    status: sub?.status ?? null,
    trialing: false,
    until: null,
    cancelAtPeriodEnd: false,
    hasSubscription: !!sub?.stripe_customer_id,
    hadSubscription: !!sub,
  };
}

const toIso = (unix?: number | null) => (unix ? new Date(unix * 1000).toISOString() : null);

/** Save a Stripe subscription onto the member it belongs to. */
export async function syncSubscription(sub: Stripe.Subscription, userIdHint?: string | null) {
  const admin = createAdminClient();
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  let userId = userIdHint || (sub.metadata?.user_id as string | undefined) || null;
  if (!userId) {
    const { data } = await admin.from("subscriptions").select("user_id").eq("stripe_customer_id", customerId).maybeSingle();
    userId = data?.user_id ?? null;
  }
  if (!userId) {
    console.error("[pro] subscription without a GRID user:", sub.id);
    return;
  }

  // Newer Stripe API versions keep the period end on the subscription item.
  const anySub = sub as unknown as { current_period_end?: number; items?: { data?: { current_period_end?: number }[] } };
  const periodEnd = anySub.current_period_end ?? anySub.items?.data?.[0]?.current_period_end ?? null;

  const { error } = await admin.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: sub.id,
      plan: "pro",
      status: sub.status,
      trial_end: toIso(sub.trial_end),
      current_period_end: toIso(periodEnd),
      cancel_at_period_end: !!sub.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
  if (error) console.error("[pro] subscription upsert failed:", error.message);
}

/**
 * Handle Pro-related Stripe webhook events. Returns true when the event was a
 * Pro event (handled), false when the caller should keep processing it.
 */
export async function handleBillingEvent(event: Stripe.Event): Promise<boolean> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.metadata?.type !== "pro") return false;
      if (session.subscription) {
        const subId = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
        const sub = await stripe.subscriptions.retrieve(subId);
        await syncSubscription(sub, session.client_reference_id || session.metadata?.user_id);
      }
      return true;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      if (sub.metadata?.type && sub.metadata.type !== "pro") return false;
      await syncSubscription(sub);
      return true;
    }
    default:
      return false;
  }
}

/** Give free Pro time (e.g. referral reward). Returns false if already given. */
export async function grantPro(userId: string, source: "referral" | "admin", days: number, note?: string) {
  const admin = createAdminClient();
  const expires = new Date(Date.now() + days * 24 * 3600 * 1000).toISOString();
  const { error } = await admin.from("pro_grants").insert({ user_id: userId, source, expires_at: expires, note: note ?? null });
  if (error) {
    if (error.code !== "23505") console.error("[pro] grant failed:", error.message);
    return false;
  }
  return true;
}
