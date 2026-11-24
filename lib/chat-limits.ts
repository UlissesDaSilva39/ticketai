// Server-only: weekly limit on starting NEW conversations by tier.
// Free 5 / Pro 30 / Premium unlimited. Replying in existing chats is never limited.
import { createAdminClient } from "@/lib/supabase/admin";
import { getTier, NEW_CHATS_PER_WEEK, type Tier } from "@/lib/pro";

export type ChatAllowance = { ok: boolean; tier: Tier; used: number; limit: number };

export async function checkNewChatAllowance(userId: string): Promise<ChatAllowance> {
  const tier = await getTier(userId);
  const limit = NEW_CHATS_PER_WEEK[tier];
  if (!Number.isFinite(limit)) return { ok: true, tier, used: 0, limit };

  const since = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
  const { count } = await createAdminClient()
    .from("conversations")
    .select("id", { count: "exact", head: true })
    .eq("started_by", userId)
    .gte("created_at", since);
  const used = count ?? 0;
  return { ok: used < limit, tier, used, limit };
}

export function chatLimitMessage(a: ChatAllowance) {
  return a.tier === "free"
    ? `You've started ${a.used} new chats this week (Free limit ${a.limit}). Upgrade to Pro for 30 a week, or Premium for unlimited.`
    : `You've started ${a.used} new chats this week (Pro limit ${a.limit}). Upgrade to Premium for unlimited messaging.`;
}
