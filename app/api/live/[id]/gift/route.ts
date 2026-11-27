import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { HOST_SHARE, giftById } from "@/lib/live/catalog";
import { UUID, currentUser, displayName } from "@/lib/live/server";

export const dynamic = "force-dynamic";

const ERRORS: Record<string, [number, string]> = {
  insufficient_coins: [402, "Not enough coins. Top up to send this gift."],
  stream_not_live: [409, "Gifts open when the live starts."],
  own_stream: [400, "You can't send gifts to your own live."],
  stream_not_found: [404, "Live not found."],
};

// POST /api/live/<id>/gift { giftId }: price comes from the server's catalogue.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await currentUser();
  if (!user) return NextResponse.json({ error: "Log in to send gifts." }, { status: 401 });
  if (!UUID.test(id)) return NextResponse.json({ error: "Live not found." }, { status: 404 });
  if (!rateLimit(`live-gift:${user.id}`, 30, 60_000).ok) return NextResponse.json({ error: "Too many gifts at once. Take a breath 🙂" }, { status: 429 });

  const { giftId } = await req.json().catch(() => ({}));
  const gift = typeof giftId === "string" ? giftById(giftId) : undefined;
  if (!gift) return NextResponse.json({ error: "Choose a gift." }, { status: 400 });

  const admin = createAdminClient();
  const { data: me } = await admin.from("profiles").select("full_name, username").eq("id", user.id).maybeSingle();
  const { data: balance, error } = await admin.rpc("grid_send_gift", {
    p_stream: id,
    p_sender: user.id,
    p_gift: gift.id,
    p_coins: gift.coins,
    p_host_share: HOST_SHARE,
    p_label: `${displayName(me)} sent ${gift.name}`,
  });
  if (error) {
    const key = Object.keys(ERRORS).find((k) => error.message.includes(k));
    if (key) return NextResponse.json({ error: ERRORS[key][1], code: key }, { status: ERRORS[key][0] });
    console.error("[live gift]", error.message);
    return NextResponse.json({ error: "Couldn't send the gift. You haven't been charged." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, balance });
}
