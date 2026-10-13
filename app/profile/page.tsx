import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar/Sidebar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import PostCard from "@/components/feed/PostCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Profile",
  description: "Your GRID profile.",
};

export default async function ProfilePage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, full_name, avatar_url, cover_image, bio, city, genre, role, website, instagram, twitter, spotify, youtube, soundcloud, is_public")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) redirect("/profile/edit");

  const [postsRes, eventsRes, followingRes, followersRes] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("author_id", user.id),
    supabase.from("events").select("id", { count: "exact", head: true }).eq("organizer_id", user.id),
    supabase.from("follows").select("id", { count: "exact", head: true }).eq("follower_id", user.id),
    supabase.from("follows").select("id", { count: "exact", head: true }).eq("target_id", user.id),
  ]);

  const stats = {
    posts: postsRes.count || 0,
    events: eventsRes.count || 0,
    following: followingRes.count || 0,
    followers: followersRes.count || 0,
  };

  const { data: myPostsRaw } = await supabase
    .from("posts")
    .select("id, body, author_id, like_count, comment_count, share_count, created_at, image_url, audio_url")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const myPosts = myPostsRaw || [];
  const postIds = myPosts.map((p) => p.id);

  const { data: commentsRaw } = postIds.length
    ? await supabase
        .from("post_comments")
        .select("id, post_id, author_id, body, created_at")
        .in("post_id", postIds)
        .order("created_at", { ascending: true })
    : { data: [] };

  const { data: likedRaw } = postIds.length
    ? await supabase.from("post_likes").select("post_id").eq("user_id", user.id).in("post_id", postIds)
    : { data: [] };
  const likedSet = new Set((likedRaw || []).map((l) => l.post_id));

  const author = {
    name: profile.full_name || profile.username || "You",
    username: profile.username,
    avatar: profile.avatar_url,
  };

  const commentsByPost: Record<string, any[]> = {};
  for (const c of commentsRaw || []) {
    if (!commentsByPost[c.post_id]) commentsByPost[c.post_id] = [];
    commentsByPost[c.post_id].push({
      id: c.id,
      body: c.body,
      authorName: "Someone",
      authorAvatar: null,
    });
  }

  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  const postsTab = (
    <div className="space-y-4">
      {myPosts.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-600 mb-3">You have not posted yet.</p>
          <Link href="/home" className="text-sm underline hover:text-black">
            Go to the feed to post
          </Link>
        </div>
      ) : (
        myPosts.map((p) => (
          <PostCard
            key={p.id}
            post={p}
            author={author}
            liked={likedSet.has(p.id)}
            comments={commentsByPost[p.id] || []}
            fmtTime={fmtTime}
          />
        ))
      )}
    </div>
  );

  const eventsTab = (
    <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
      <p className="text-gray-600 mb-3">No events yet.</p>
      <Link href="/organizer/events/new" className="text-sm underline hover:text-black">
        Create your first event
      </Link>
    </div>
  );

  const followingTab = (
    <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
      <p className="text-gray-600 mb-3">You are following {stats.following} accounts.</p>
      <Link href="/following" className="text-sm underline hover:text-black">
        View all
      </Link>
    </div>
  );

  const aboutTab = (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3 text-sm">
      <div><span className="text-gray-500">Role:</span> {profile.role || "—"}</div>
      <div><span className="text-gray-500">City:</span> {profile.city || "—"}</div>
      <div><span className="text-gray-500">Genre:</span> {profile.genre || "—"}</div>
      <div><span className="text-gray-500">Visibility:</span> {profile.is_public ? "Public" : "Private"}</div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 py-6 grid grid-cols-12 gap-6">
        <nav aria-label="Your library" className="col-span-12 lg:col-span-3">
          <Sidebar />
        </nav>

        <main className="col-span-12 lg:col-span-9 space-y-6">
          <ProfileHeader profile={profile} isOwnProfile={true} stats={stats} />

          <ProfileTabs
            tabs={[
              { key: "posts", label: "Posts", content: postsTab },
              { key: "events", label: "Events", content: eventsTab },
              { key: "following", label: "Following", content: followingTab },
              { key: "about", label: "About", content: aboutTab },
            ]}
          />
        </main>
      </div>
    </div>
  );
}
