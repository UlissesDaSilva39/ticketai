import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar/Sidebar";
import RightSidebar from "@/components/feed/RightSidebar";
import PostComposer from "@/components/feed/PostComposer";
import PostCard from "@/components/feed/PostCard";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 30;

type PostRow = {
  id: string;
  body: string;
  author_id: string;
  like_count: number;
  comment_count: number;
  share_count: number;
  created_at: string;
  image_url: string | null;
  audio_url: string | null;
};

type CommentRow = {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  created_at: string;
};

type Author = { name: string; username: string | null; avatar: string | null };

function groupLabel(iso: string): string {
  const now = new Date();
  const d = new Date(iso);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const that = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round((today.getTime() - that.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 7) return "This week";
  return "Earlier";
}

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ offset?: string }>;
}) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const offset = Math.max(0, parseInt(params.offset || "0", 10) || 0);
  const fetchLimit = offset + PAGE_SIZE;

  const { data: postsRaw } = await supabase
    .from("posts")
    .select("id, body, author_id, like_count, comment_count, share_count, created_at, image_url, audio_url")
    .order("created_at", { ascending: false })
    .limit(fetchLimit);
  const posts: PostRow[] = postsRaw || [];
  const hasMore = posts.length >= fetchLimit;
  const nextOffset = offset + PAGE_SIZE;

  const postIds = posts.map((p) => p.id);
  const { data: commentsRaw } = postIds.length
    ? await supabase
        .from("post_comments")
        .select("id, post_id, author_id, body, created_at")
        .in("post_id", postIds)
        .order("created_at", { ascending: true })
    : { data: [] as CommentRow[] };
  const comments: CommentRow[] = commentsRaw || [];

  const commentAuthorIds = comments.map((c) => c.author_id);
  const allAuthorIds = [...new Set([...posts.map((p) => p.author_id), ...commentAuthorIds])];
  const { data: authors } = allAuthorIds.length
    ? await supabase.from("profiles").select("id, full_name, username, avatar_url").in("id", allAuthorIds)
    : { data: [] as { id: string; full_name: string | null; username: string | null; avatar_url: string | null }[] };

  const authorById: Record<string, Author> = {};
  for (const a of authors || []) {
    authorById[a.id] = {
      name: a.full_name || a.username || "Someone",
      username: a.username,
      avatar: a.avatar_url,
    };
  }

  const likedSet = new Set<string>();
  if (user && postIds.length > 0) {
    const { data: userLikes } = await supabase
      .from("post_likes")
      .select("post_id")
      .eq("user_id", user.id)
      .in("post_id", postIds);
    for (const l of userLikes || []) likedSet.add(l.post_id);
  }

  const commentsByPost: Record<string, CommentRow[]> = {};
  for (const c of comments) {
    if (!commentsByPost[c.post_id]) commentsByPost[c.post_id] = [];
    commentsByPost[c.post_id].push(c);
  }

  const { data: forYouRaw } = await supabase
    .from("events")
    .select("id, title, start_date, hero_image")
    .gte("start_date", new Date().toISOString())
    .order("start_date", { ascending: true })
    .limit(3);
  const forYou = (forYouRaw || []).map((e) => ({
    id: e.id,
    title: e.title,
    start_date: e.start_date,
    hero_image: e.hero_image,
  }));

  const { data: peopleRaw } = await supabase
    .from("profiles")
    .select("id, username, full_name")
    .neq("id", user.id)
    .not("username", "is", null)
    .limit(3);
  const peopleToFollow = (peopleRaw || []).map((p) => ({
    id: p.id,
    username: p.username,
    full_name: p.full_name,
  }));

  const grouped: Record<string, PostRow[]> = {};
  const groupOrder: string[] = [];
  for (const p of posts) {
    const label = groupLabel(p.created_at);
    if (!grouped[label]) { grouped[label] = []; groupOrder.push(label); }
    grouped[label].push(p);
  }

  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 py-6 grid grid-cols-12 gap-6">
        <nav aria-label="Your library" className="col-span-12 lg:col-span-3">
          <Sidebar />
        </nav>

        <main className="col-span-12 lg:col-span-6">
          <h1
            className="text-5xl font-bold uppercase mb-8"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            Feed
          </h1>

          <PostComposer userId={user.id} />

          {posts.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
              <p className="text-gray-600 mb-4">No posts yet.</p>
            </div>
          ) : (
            <div>
              {groupOrder.map((label) => (
                <section key={label} className="mb-8">
                  <h2
                    className="text-xl font-bold uppercase mb-3 text-gray-500"
                    style={{ fontFamily: "var(--font-antonio)" }}
                  >
                    {label}
                  </h2>
                  <div className="space-y-3">
                    {grouped[label].map((p) => {
                      const author = authorById[p.author_id];
                      const postComments = (commentsByPost[p.id] || []).map((c) => ({
                        id: c.id,
                        body: c.body,
                        authorName: authorById[c.author_id]?.name || "Someone",
                        authorAvatar: authorById[c.author_id]?.avatar || null,
                      }));
                      return (
                        <PostCard
                          key={p.id}
                          post={p}
                          author={author}
                          liked={likedSet.has(p.id)}
                          comments={postComments}
                          fmtTime={fmtTime}
                        />
                      );
                    })}
                  </div>
                </section>
              ))}

              <div id="feed-bottom" className="pt-4 pb-8 flex justify-center">
                {hasMore ? (
                  <Link
                    href={"/home?offset=" + nextOffset + "#feed-bottom"}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition"
                    aria-label="Load more posts"
                  >
                    Load more
                  </Link>
                ) : (
                  <p className="text-xs text-gray-400">— End of feed —</p>
                )}
              </div>
            </div>
          )}
        </main>

        <aside aria-label="Suggestions" className="col-span-12 lg:col-span-3">
          <RightSidebar
            trending={["#house", "#techno", "#london", "#dnb"]}
            forYou={forYou}
            peopleToFollow={peopleToFollow}
          />
        </aside>
      </div>
    </div>
  );
}
