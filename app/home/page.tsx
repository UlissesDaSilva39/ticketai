import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar/Sidebar";
import RightSidebar from "@/components/feed/RightSidebar";
import PostComposer from "@/components/feed/PostComposer";

export const dynamic = "force-dynamic";

type PostRow = {
  id: string;
  body: string;
  author_id: string;
  like_count: number;
  comment_count: number;
  share_count: number;
  created_at: string;
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

export default async function FeedPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Posts
  const { data: postsRaw } = await supabase
    .from("posts")
    .select("id, body, author_id, like_count, comment_count, share_count, created_at")
    .order("created_at", { ascending: false })
    .limit(30);
  const posts: PostRow[] = postsRaw || [];

  // Comments
  const postIds = posts.map((p) => p.id);
  const { data: commentsRaw } = postIds.length
    ? await supabase
        .from("post_comments")
        .select("id, post_id, author_id, body, created_at")
        .in("post_id", postIds)
        .order("created_at", { ascending: true })
    : { data: [] as CommentRow[] };
  const comments: CommentRow[] = commentsRaw || [];

  // Authors
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

  const commentsByPost: Record<string, CommentRow[]> = {};
  for (const c of comments) {
    if (!commentsByPost[c.post_id]) commentsByPost[c.post_id] = [];
    commentsByPost[c.post_id].push(c);
  }

  // Right sidebar data
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
        <div className="col-span-12 lg:col-span-3">
          <Sidebar />
        </div>

        <div className="col-span-12 lg:col-span-6">
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
                      const name = author?.name || "Someone";
                      const initials = name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase();
                      const postComments = commentsByPost[p.id] || [];
                      return (
                        <div
                          key={p.id}
                          className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
                        >
                          <div className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                              {author?.avatar ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={author.avatar}
                                  alt={name}
                                  className="w-10 h-10 rounded-full object-cover shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold shrink-0">
                                  {initials}
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">{name}</p>
                                <p className="text-xs text-gray-500">{fmtTime(p.created_at)}</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                              {p.body}
                            </p>
                            <div className="flex gap-6 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
                              <span>{p.like_count} likes</span>
                              <span>{p.comment_count} comments</span>
                              <span>{p.share_count} shares</span>
                            </div>
                          </div>

                          {postComments.length > 0 && (
                            <div className="bg-gray-50 border-t border-gray-100 px-4 py-3 space-y-2">
                              {postComments.slice(0, 3).map((c) => {
                                const cAuthor = authorById[c.author_id];
                                const cName = cAuthor?.name || "Someone";
                                const cInitials = cName
                                  .split(" ")
                                  .map((w) => w[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase();
                                return (
                                  <div key={c.id} className="flex items-start gap-2">
                                    {cAuthor?.avatar ? (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img
                                        src={cAuthor.avatar}
                                        alt={cName}
                                        className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                                      />
                                    ) : (
                                      <div className="w-6 h-6 rounded-full bg-gray-400 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                                        {cInitials}
                                      </div>
                                    )}
                                    <p className="text-xs text-gray-700">
                                      <span className="font-medium">{cName}</span> {c.body}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-12 lg:col-span-3">
          <RightSidebar
            trending={["#house", "#techno", "#london", "#dnb"]}
            forYou={forYou}
            peopleToFollow={peopleToFollow}
          />
        </div>
      </div>
    </div>
  );
}