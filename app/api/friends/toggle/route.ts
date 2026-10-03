import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendFriendRequestEmail } from "@/lib/email";

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

    // Notify recipient by email (fire-and-forget)
    console.log("[friend-request] new request from", user.id, "to", friendId);
    try {
      const admin = createAdminClient();
      const { data: recipientAuth, error: authErr } = await admin.auth.admin.getUserById(friendId);
      if (authErr) console.error("[friend-request] recipient lookup failed:", authErr.message);
      const { data: senderProfile } = await admin
        .from("profiles")
        .select("full_name, username")
        .eq("id", user.id)
        .maybeSingle();

      console.log("[friend-request] recipient email:", recipientAuth?.user?.email || "(none)");
      console.log("[friend-request] sender profile:", senderProfile);

      if (recipientAuth?.user?.email) {
        const siteUrl = process.env.NEXT_PUBLIC_ROOT_URL || "https://ticketai.org.uk";
        await sendFriendRequestEmail({
          toEmail: recipientAuth.user.email,
          toName: recipientAuth.user.email.split("@")[0],
          fromName: senderProfile?.full_name || senderProfile?.username || "Someone",
          fromUsername: senderProfile?.username || null,
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
