import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTier } from "@/lib/pro";

export const dynamic = "force-dynamic";

const BOOST_HOURS = 24;
const FREE_BOOSTS_PER_MONTH = 1; // included with Premium

// Boost your own post: pinned at the top of the feed for 24 hours (Premium perk).
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  if ((await getTier(user.id)) !== "premium") {
    return NextResponse.json({ error: "Boosting posts is a GRID Premium feature.", upgrade: "/pro" }, { status: 402 });
  }

  const admin = createAdminClient();
  const { data: post } = await admin.from("posts").select("id, author_id").eq("id", id).maybeSingle();
  if (!post || post.author_id !== user.id) return NextResponse.json({ error: "You can only boost your own posts." }, { status: 403 });

  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
  const { count } = await admin
    .from("post_boosts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("source", "premium_monthly")
    .gte("starts_at", monthStart);
  if ((count ?? 0) >= FREE_BOOSTS_PER_MONTH) {
    return NextResponse.json({ error: "You've used this month's boost. A new one is available on the 1st." }, { status: 429 });
  }

  const endsAt = new Date(now.getTime() + BOOST_HOURS * 3600 * 1000).toISOString();
  const { error } = await admin.from("post_boosts").insert({ post_id: id, user_id: user.id, source: "premium_monthly", ends_at: endsAt });
  if (error) return NextResponse.json({ error: "Could not boost the post." }, { status: 500 });

  return NextResponse.json({ ok: true, endsAt });
}
