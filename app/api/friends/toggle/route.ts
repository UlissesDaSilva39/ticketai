import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendFriendRequestEmail } from "@/lib/email";
import { notifyServer } from "@/lib/notify-server";

export async function POST(req: NextRequest) {
  try {
    const { friendId } = await req.json();
    if (!friendId) return NextResponse.json({ error: "friendId required" }, { status: 400 });

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    if (user.id === friendId) return NextResponse.json({ error: "Cannot add yourself" }, { status: 400 });

    const { data: existing } = await supabase
      .from("friendships")
      .select("id")
      .or("and(user_id.eq." + user.id + ",friend_id.eq." + friendId + "),and(user_id.eq." + friendId + ",friend_id.eq." + user.id + ")")
      .maybeSingle();

    if (existing) {
      await supabase.from("friendships").delete().eq("id", existing.id);
      return NextResponse.json({ status: null });
    }

    const { error: insertError } = await supabase.from("friendships").insert({
      user_id: user.id,
      friend_id: friendId,
      status: "pending",
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Look up sender profile once, use for both in-app notification and email
    const admin = createAdminClient();
    const { data: senderProfile } = await admin
      .from("profiles")
      .select("full_name, username")
      .eq("id", user.id)
      .maybeSingle();

    const senderName = senderProfile?.full_name || senderProfile?.username || "Someone";
    const senderUsername = senderProfile?.username || null;

    // In-app notification
    await notifyServer({
      userId: friendId,
      type: "friend_request",
      title: "New friend request",
      body: senderName + " wants to be friends",
      href: "/friends/requests",
    });

    // Email (fire-and-forget)
    console.log("[friend-request] new request from", user.id, "to", friendId);
    try {
      const { data: recipientAuth, error: authErr } = await admin.auth.admin.getUserById(friendId);
      if (authErr) console.error("[friend-request] recipient lookup failed:", authErr.message);

      console.log("[friend-request] recipient email:", recipientAuth?.user?.email || "(none)");
      console.log("[friend-request] sender profile:", senderProfile);

      if (recipientAuth?.user?.email) {
        const siteUrl = process.env.NEXT_PUBLIC_ROOT_URL || "https://ticketai.org.uk";
        await sendFriendRequestEmail({
          toEmail: recipientAuth.user.email,
          toName: recipientAuth.user.email.split("@")[0],
          fromName: senderName,
          fromUsername: senderUsername,
          siteUrl,
        });
      }
    } catch (e) {
      console.error("[friend-request] email failed:", e);
    }

    return NextResponse.json({ status: "pending" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
