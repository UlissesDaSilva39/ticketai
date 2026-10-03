const fs = require("fs");
const p = "app/api/friends/toggle/route.ts";
let t = fs.readFileSync(p, "utf8");
const before = t;

// Add import
if (!t.includes("sendFriendRequestEmail")) {
  t = t.replace(
    'import { createServerSupabase } from "@/lib/supabase/server";',
    'import { createServerSupabase } from "@/lib/supabase/server";\nimport { createAdminClient } from "@/lib/supabase/admin";\nimport { sendFriendRequestEmail } from "@/lib/email";'
  );
  console.log("Import added.");
}

// Replace the insert block to also send the email
const oldInsert = `    await supabase.from("friendships").insert({
      user_id: user.id,
      friend_id: friendId,
      status: "pending",
    });
    return NextResponse.json({ status: "accepted" });`;

const newInsert = `    const { error: insertError } = await supabase.from("friendships").insert({
      user_id: user.id,
      friend_id: friendId,
      status: "pending",
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Fire-and-forget: notify the recipient by email
    try {
      const admin = createAdminClient();
      const { data: recipientAuth } = await admin.auth.admin.getUserById(friendId);
      const { data: senderProfile } = await admin
        .from("profiles")
        .select("full_name, username")
        .eq("id", user.id)
        .maybeSingle();

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
      console.error("Failed to send friend request email:", e);
    }

    return NextResponse.json({ status: "pending" });`;

if (t.includes(oldInsert)) {
  t = t.replace(oldInsert, newInsert);
  console.log("Insert block updated with email notification.");
} else {
  console.log("Insert anchor not found. Inspect the file.");
}

if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("File saved.");
}