import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar/Sidebar";
import FollowButton from "@/components/artist/FollowButton";
import PostCard from "@/components/feed/PostCard";
import { relativeTime } from "@/lib/format-time";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("profiles")
    .select("full_name, username, bio")
    .or("username.eq." + username + ",id.eq." + username)
    .maybeSingle();
  if (!data) return { title: "Artist not found" };
  const name = data.full_name || data.username || "Artist";
  return {
    title: name,
    description: data.bio ? data.bio.slice(0, 160) : name + " on GRID",
  };
}

export default async function ArtistPublicPage({ params }: Props) {
  const { username } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  let { data: profile } = await supabase
    .from("profiles")
    .select("id, username, full_name, avatar_url, cover_image, bio, city, genre, role, website, instagram, twitter, spotify, youtube, soundcloud, is_public")
    .eq("username", username)
    .maybeSingle();

  if (!profile) {
    const { data: byId } = await supabase
      .from("profiles")
      .select("id, username, full_name, avatar_url, cover_image, bio, city, genre, role, website, instagram, twitter, spotify, youtube, soundcloud, is_public")
      .eq("id", username)
      .maybeSingle();
    profile = byId;
  }

  if (!profile) notFound();

  const isOwn = user?.id === profile.id;

  const [followersRes, followingRes, postsRes] = await Promise.all([
    supabase.from("follows").select("id", { count: "exact", head: true }).eq("target_id", profile.id),
    supabase.from("follows").select("id", { count: "exact", head: true }).eq("follower_id", profile.id),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("author_id", profile.id),
  ]);

  const stats = {
    followers: followersRes.count || 0,
    following: followingRes.count || 0,
    posts: postsRes.count || 0,
  };

  let isFollowing = false;
  if (user && user.id !== profile.id) {
    const { data: f } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("target_id", profile.id)
      .maybeSingle();
    isFollowing = !!f;
  }

  const { data: postsRaw } = await supabase
    .from("posts")
    .select("id, body, author_id, like_count, comment_count, share_count, created_at, image_url, audio_url")
    .eq("author_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(12);

  const posts = postsRaw || [];
  const postIds = posts.map((p) => p.id);

  const { data: commentsRaw } = postIds.length
    ? await supabase
        .from("post_comments")
        .select("id, post_id, author_id, body, created_at")
        .in("post_id", postIds)
        .order("created_at", { ascending: true })
    : { data: [] };

  const { data: likedRaw } = user && postIds.length
    ? await supabase.from("post_likes").select("post_id").eq("user_id", user.id).in("post_id", postIds)
    : { data: [] };
  const likedSet = new Set((likedRaw || []).map((l) => l.post_id));

  const author = {
    name: profile.full_name || profile.username || "Artist",
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
      createdAt: c.created_at,
    });
  }

  const name = author.name;
  const initials = name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  const roleLabel = profile.role === "promoter" ? "Promoter"
    : profile.role === "venue" ? "Venue"
    : profile.role === "artist" ? "Artist"
    : profile.role === "a_and_r" ? "A&R"
    : profile.role === "record_company" ? "Record Company"
    : profile.role === "attendee" ? "Fan"
    : "Profile";

  const socialLinks: Array<{ label: string; href: string }> = [];
  if (profile.website) socialLinks.push({ label: "Website", href: profile.website });
  if (profile.instagram) socialLinks.push({ label: "Instagram", href: "https://instagram.com/" + profile.instagram.replace(/^@/, "") });
  if (profile.twitter) socialLinks.push({ label: "Twitter", href: "https://twitter.com/" + profile.twitter.replace(/^@/, "") });
  if (profile.spotify) socialLinks.push({ label: "Spotify", href: profile.spotify });
  if (profile.youtube) socialLinks.push({ label: "YouTube", href: profile.youtube });
  if (profile.soundcloud) socialLinks.push({ label: "SoundCloud", href: profile.soundcloud });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 py-6 grid grid-cols-12 gap-6">
        <nav aria-label="Your library" className="col-span-12 lg:col-span-3">
          <Sidebar />
        </nav>

        <main className="col-span-12 lg:col-span-9 space-y-6">
          <header className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="relative h-40 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
              {profile.cover_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.cover_image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />
              ) : null}
            </div>
            <div className="px-6 pb-6 -mt-12 relative">
              <div className="flex items-end gap-4">
                {profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatar_url} alt={name} className="w-24 h-24 rounded-full object-cover border-4 border-white bg-white shrink-0" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold border-4 border-white shrink-0">
                    {initials}
                  </div>
                )}
                <div className="flex-1 min-w-0 pb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold truncate">{name}</h1>
                    <span className="text-[10px] uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{roleLabel}</span>
                  </div>
                  {profile.username ? (
                    <p className="text-sm text-gray-500">@{profile.username}</p>
                  ) : null}
                </div>
                {!isOwn ? (
                  <FollowButton
                    targetId={profile.id}
                    targetType={profile.role || "user"}
                    initialFollowing={isFollowing}
                  />
                ) : (
                  <Link
                    href="/profile/edit"
                    className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:border-gray-800 transition shrink-0"
                  >
                    Edit profile
                  </Link>
                )}
              </div>

              {profile.bio ? (
                <p className="text-sm text-gray-700 mt-4 whitespace-pre-wrap">{profile.bio}</p>
              ) : null}

              <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-4">
                {profile.city ? <span>{profile.city}</span> : null}
                {profile.genre ? <span>· {profile.genre}</span> : null}
              </div>

              {socialLinks.length > 0 ? (
                <div className="flex flex-wrap gap-3 text-xs mt-3">
                  {socialLinks.map((l) => (
                    <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black underline">
                      {l.label}
                    </a>
                  ))}
                </div>
              ) : null}

              <dl className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100 text-center">
                <div>
                  <dd className="text-xl font-bold">{stats.posts}</dd>
                  <dt className="text-xs text-gray-500 uppercase tracking-wide">Posts</dt>
                </div>
                <div>
                  <dd className="text-xl font-bold">{stats.followers}</dd>
                  <dt className="text-xs text-gray-500 uppercase tracking-wide">Followers</dt>
                </div>
                <div>
                  <dd className="text-xl font-bold">{stats.following}</dd>
                  <dt className="text-xs text-gray-500 uppercase tracking-wide">Following</dt>
                </div>
              </dl>
            </div>
          </header>

          <section>
            <h2 className="text-2xl font-bold uppercase mb-4" style={{ fontFamily: "var(--font-antonio)" }}>
              Posts
            </h2>
            {posts.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
                <p className="text-gray-600">No posts yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((p) => (
                  <PostCard
                    key={p.id}
                    post={p}
                    author={author}
                    liked={likedSet.has(p.id)}
                    comments={commentsByPost[p.id] || []}
                    fmtTime={relativeTime}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
