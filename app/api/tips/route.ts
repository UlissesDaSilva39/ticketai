import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { HOST_SHARE } from "@/lib/live/catalog";
import { TIP_AMOUNTS } from "@/lib/tips";
import { notifyServer } from "@/lib/notify-server";

export const dynamic = "force-dynamic";
const UUID = /^[0-9a-f-]{36}$/i;

// POST /api/tips { targetType: "post" | "profile", targetId, coins }: tip a creator with GRID coins.
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please log in to tip.", code: "login" }, { status: 401 });
  if (!rateLimit(`tip:${user.id}`, 30, 60 * 1000).ok) return NextResponse.json({ error: "Slow down a little." }, { status: 429 });
  const { targetType, targetId, coins } = await req.json().catch(() => ({}));
  if ((targetType !== "post" && targetType !== "profile") || typeof targetId !== "string" || !UUID.test(targetId) || !TIP_AMOUNTS.includes(coins)) {
    return NextResponse.json({ error: "Pick a tip amount." }, { status: 400 });
  }
  const admin = createAdminClient();
  let creatorId: string | null = null;
  if (targetType === "post") {
    const { data } = await admin.from("posts").select("author_id").eq("id", targetId).maybeSingle();
    creatorId = data?.author_id ?? null;
  } else {
    const { data } = await admin.from("profiles").select("id").eq("id", targetId).maybeSingle();
    creatorId = data?.id ?? null;
  }
  if (!creatorId) return NextResponse.json({ error: "Not found." }, { status: 404 });
  if (creatorId === user.id) return NextResponse.json({ error: "You can't tip yourself." }, { status: 400 });

  const { data: balance, error } = await admin.rpc("grid_send_tip", { p_sender: user.id, p_creator: creatorId, p_target_type: targetType, p_target: targetId, p_coins: coins, p_share: HOST_SHARE });
  if (error) {
    if (error.message.includes("insufficient_coins")) return NextResponse.json({ error: "Not enough coins.", code: "insufficient_coins" }, { status: 402 });
    console.error("[tips]", error.message);
    return NextResponse.json({ error: "Tips are being set up. Please try again soon." }, { status: 500 });
  }
  const { data: me } = await admin.from("profiles").select("full_name, username").eq("id", user.id).maybeSingle();
  const name = (me?.full_name && !me.full_name.includes("@") ? me.full_name : me?.username) ?? "Someone";
  await notifyServer({ userId: creatorId, type: "likes", title: `${name} tipped you ${coins} coins`, body: `That's £${((coins * HOST_SHARE) / 100).toFixed(2)} in your GRID balance.`, href: "/seller" }).catch(() => undefined);
  return NextResponse.json({ balance });
}
