import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { ensureReferralCode, REFERRAL_GOAL } from "@/lib/referrals";

export const dynamic = "force-dynamic";

// The logged-in member's invite code, link path and who has joined through it.
export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  let code: string;
  try {
    code = await ensureReferralCode(user.id);
  } catch (e) {
    console.error("[referrals/me]", e);
    return NextResponse.json({ error: "Invites aren't available right now." }, { status: 503 });
  }

  const { data: rows, count } = await supabase
    .from("referrals")
    .select("referred_id, created_at", { count: "exact" })
    .eq("referrer_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const ids = (rows ?? []).map((r) => r.referred_id);
  const { data: people } = ids.length
    ? await supabase.from("profiles").select("id, full_name, username, avatar_url").in("id", ids)
    : { data: [] };
  const byId = Object.fromEntries((people ?? []).map((p) => [p.id, p]));

  return NextResponse.json({
    code,
    path: `/signup?ref=${code}`,
    joined: count ?? 0,
    goal: REFERRAL_GOAL,
    recent: (rows ?? []).map((r) => {
      const p = byId[r.referred_id];
      const name = p?.full_name && !p.full_name.includes("@") ? p.full_name : p?.username;
      return { name: name || "New member", username: p?.username ?? null, avatar: p?.avatar_url ?? null, joinedAt: r.created_at };
    }),
  });
}
