// Server-only: paying members out with Stripe Connect (Express accounts).
// A withdrawal is paid by a Stripe transfer to the member's connected account;
// without one (or if the transfer fails) it waits for an admin to pay by hand.
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export type PayoutAccount = { stripe_account_id: string; payouts_enabled: boolean; details_submitted: boolean } | null;

export async function getPayoutAccount(userId: string): Promise<PayoutAccount> {
  const { data, error } = await createAdminClient().from("payout_accounts").select("stripe_account_id, payouts_enabled, details_submitted").eq("user_id", userId).maybeSingle();
  return error ? null : data;
}

/** Re-reads the account from Stripe and stores whether it can receive payouts. */
export async function refreshPayoutAccount(userId: string): Promise<PayoutAccount> {
  const acc = await getPayoutAccount(userId);
  if (!acc) return null;
  try {
    const a = await stripe.accounts.retrieve(acc.stripe_account_id);
    const next = { payouts_enabled: !!a.payouts_enabled, details_submitted: !!a.details_submitted };
    if (next.payouts_enabled !== acc.payouts_enabled || next.details_submitted !== acc.details_submitted) {
      await createAdminClient().from("payout_accounts").update({ ...next, updated_at: new Date().toISOString() }).eq("user_id", userId);
    }
    return { ...acc, ...next };
  } catch (e) {
    console.error("[payouts] account refresh failed:", e instanceof Error ? e.message : e);
    return acc;
  }
}

/** Pays a requested withdrawal with a Stripe transfer. Safe to retry (idempotent). */
export async function payWithStripe(payoutId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = createAdminClient();
  const { data: p } = await admin.from("marketplace_payouts").select("id, seller_id, amount_pence, status").eq("id", payoutId).maybeSingle();
  if (!p) return { ok: false, error: "Withdrawal not found." };
  if (p.status !== "requested") return { ok: false, error: `This withdrawal is already ${p.status}.` };
  const acc = await refreshPayoutAccount(p.seller_id);
  if (!acc?.payouts_enabled) return { ok: false, error: "The member hasn't finished connecting their bank with Stripe." };
  try {
    const t = await stripe.transfers.create(
      { amount: p.amount_pence, currency: "gbp", destination: acc.stripe_account_id, metadata: { payout_id: p.id, user_id: p.seller_id } },
      { idempotencyKey: `grid-payout-${p.id}` }
    );
    await admin
      .from("marketplace_payouts")
      .update({ status: "paid", paid_at: new Date().toISOString(), method: "stripe", stripe_transfer_id: t.id })
      .eq("id", p.id)
      .eq("status", "requested");
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[payouts] transfer failed:", msg);
    return { ok: false, error: msg };
  }
}
