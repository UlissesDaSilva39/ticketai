// Server-only helpers for invite codes and referrals (service key; never import in client code).
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyServer } from "@/lib/notify-server";

export const REFERRAL_GOAL = 3; // friends who join = 1 free Pro month

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid typos

function newCode(len = 8) {
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

export function normaliseCode(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const c = raw.trim().toUpperCase();
  return /^[A-Z0-9]{6,12}$/.test(c) ? c : null;
}

/** The member's invite code, creating one the first time. */
export async function ensureReferralCode(userId: string): Promise<string> {
  const admin = createAdminClient();
  const { data: existing } = await admin.from("referral_codes").select("code").eq("user_id", userId).maybeSingle();
  if (existing?.code) return existing.code;

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = newCode();
    const { error } = await admin.from("referral_codes").insert({ user_id: userId, code });
    if (!error) return code;
    if (error.code === "23505") {
      // Either the code clashed (retry) or another request created this user's code first.
      const { data: again } = await admin.from("referral_codes").select("code").eq("user_id", userId).maybeSingle();
      if (again?.code) return again.code;
      continue;
    }
    throw error;
  }
  throw new Error("Could not create invite code");
}

/**
 * Record that `referredId` joined with `code`. Safe to call more than once:
 * a person can only be referred once, and self-referrals are ignored.
 */
export async function recordReferral(referredId: string, rawCode: unknown, referredName?: string | null) {
  const code = normaliseCode(rawCode);
  if (!code) return;
  const admin = createAdminClient();

  const { data: owner } = await admin.from("referral_codes").select("user_id").eq("code", code).maybeSingle();
  if (!owner || owner.user_id === referredId) return;

  const { error } = await admin.from("referrals").insert({ referrer_id: owner.user_id, referred_id: referredId, code });
  if (error) {
    if (error.code !== "23505") console.error("[referrals] insert failed:", error.message);
    return; // 23505 = already referred
  }

  const { count } = await admin.from("referrals").select("id", { count: "exact", head: true }).eq("referrer_id", owner.user_id);
  const total = count ?? 1;
  const who = referredName && !referredName.includes("@") ? referredName : "Someone";
  await notifyServer({
    userId: owner.user_id,
    type: "referral",
    title: `${who} joined GRID with your invite 🎉`,
    body:
      total >= REFERRAL_GOAL
        ? `That's ${total} friends — you've unlocked a free month of GRID Pro.`
        : `${total} of ${REFERRAL_GOAL} friends joined. ${REFERRAL_GOAL - total} more for a free Pro month.`,
    href: "/home",
  });
}
