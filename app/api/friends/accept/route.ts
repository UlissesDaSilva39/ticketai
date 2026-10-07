import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendFriendAcceptedEmail } from "@/lib/email";
import { notifyServer } from "@/lib/notify-server";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));

  const form = await req.formData();
  const senderId = String(form.get("senderId") || "");
  if (!senderId) return NextResponse.redirect(new URL("/friends/requests", req.url));

  const { error } = await supabase
    .from("friendships")
    .update({ status: "accepted" })
    .eq("user_id", senderId)
    .eq("friend_id", user.id)
    .eq("status", "pending");

  if (!error) {
    try {
      const admin = createAdminClient();
      const { data: senderAuth } = await admin.auth.admin.getUserById(senderId);
      const { data: accepterProfile } = await admin
        .from("profiles")
        .select("full_name, username")
        .eq("id", user.id)
        .maybeSingle();

      const accepterName = accepterProfile?.full_name || accepterProfile?.username || "Someone";
      const accepterUsername = accepterProfile?.username || null;

      // In-app notification
      await notifyServer({
        userId: senderId,
        type: "friend_accepted",
        title: "Friend request accepted",
        body: accepterName + " accepted your friend request",
        href: "/friends",
      });

      // Email
      if (senderAuth?.user?.email) {
        const siteUrl = process.env.NEXT_PUBLIC_ROOT_URL || "https://ticketai.org.uk";
        await sendFriendAcceptedEmail({
          toEmail: senderAuth.user.email,
          toName: senderAuth.user.email.split("@")[0],
          accepterName,
          accepterUsername,
          siteUrl,
        });
      }
    } catch (e) {
      console.error("Failed to send friend accepted email:", e);
    }
  }

  return NextResponse.redirect(new URL("/notifications", req.url));
}
