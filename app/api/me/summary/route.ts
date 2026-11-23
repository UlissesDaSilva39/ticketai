import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getProStatus } from "@/lib/pro";

export const dynamic = "force-dynamic";

// The logged-in user's own profile and header counts, for the navbar and home page.
export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // Logged out is a normal state on public pages: answer quietly, not with an error.
  if (!user) return NextResponse.json({ user: null });

  const [profileRes, followersRes, followingRes, notifRes, convRes, trackRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, username, full_name, role, avatar_url, cover_image, bio, city, genre, label, website, instagram, twitter, spotify, youtube, soundcloud")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("follows")
      .select("id", { count: "exact", head: true })
      .eq("target_type", "user")
      .eq("target_id", user.id),
    supabase
      .from("follows")
      .select("id", { count: "exact", head: true })
      .eq("follower_id", user.id),
    supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .is("read_at", null),
    supabase
      .from("conversations")
      .select("id, participant_a, participant_b, participant_a_last_read, participant_b_last_read")
      .or(`participant_a.eq.${user.id},participant_b.eq.${user.id}`)
      .limit(50),
    // Latest track = the user's newest post with audio.
    supabase
      .from("posts")
      .select("id, audio_url, audio_title, created_at")
      .eq("author_id", user.id)
      .not("audio_url", "is", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  // Unread messages = messages from the other person newer than my last-read time.
  let unreadMessages = 0;
  const conversations = convRes.data ?? [];
  const counts = await Promise.all(
    conversations.map((c) => {
      const lastRead = c.participant_a === user.id ? c.participant_a_last_read : c.participant_b_last_read;
      let q = supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("conversation_id", c.id)
        .neq("sender_id", user.id);
      if (lastRead) q = q.gt("created_at", lastRead);
      return q;
    })
  );
  for (const r of counts) unreadMessages += r.count ?? 0;

  const meta = user.user_metadata ?? {};
  const profile = profileRes.data ?? {
    id: user.id,
    username: meta.username ?? null,
    full_name: meta.full_name ?? null,
    role: meta.role ?? null,
  };

  let pro: Awaited<ReturnType<typeof getProStatus>> | null = null;
  try {
    pro = await getProStatus(user.id);
  } catch (e) {
    console.error("[me/summary] pro status failed:", e);
  }

  return NextResponse.json({
    user: { id: user.id, email: user.email },
    profile,
    pro,
    latestTrack: trackRes.data
      ? { postId: trackRes.data.id, url: trackRes.data.audio_url, title: trackRes.data.audio_title ?? "Untitled track" }
      : null,
    counts: {
      followers: followersRes.count ?? 0,
      following: followingRes.count ?? 0,
      unreadNotifications: notifRes.count ?? 0,
      unreadMessages,
    },
  });
}
