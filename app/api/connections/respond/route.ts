import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyServer } from "@/lib/notify-server";

export const dynamic = "force-dynamic";

// Accept or ignore a connection request (friendships, status pending -> accepted/declined).
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { senderId, action } = await req.json().catch(() => ({}));
  if (typeof senderId !== "string" || (action !== "accept" && action !== "ignore")) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("friendships")
    .update({ status: action === "accept" ? "accepted" : "declined" })
    .eq("user_id", senderId)
    .eq("friend_id", user.id)
    .eq("status", "pending")
    .select("id");
  if (error) return NextResponse.json({ error: "Could not update the request" }, { status: 500 });
  if (!data?.length) return NextResponse.json({ error: "Request not found" }, { status: 404 });

  if (action === "accept") {
    const { data: me } = await createAdminClient().from("profiles").select("full_name, username").eq("id", user.id).maybeSingle();
    const name = (me?.full_name && !me.full_name.includes("@") ? me.full_name : me?.username) || "Someone";
    await notifyServer({
      userId: senderId,
      type: "friend_accepted",
      title: `${name} accepted your connection request`,
      href: me?.username ? `/u/${me.username}` : "/network",
    });
  }
  return NextResponse.json({ ok: true });
}
