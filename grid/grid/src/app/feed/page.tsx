import { LeftSidebar } from "@/components/sidebar/LeftSidebar";
import { RightSidebar } from "@/components/sidebar/RightSidebar";
import { Footer } from "@/components/sidebar/Footer";
import { posts, threads } from "@/data/feed";

function PostCard({ author, when, body, likes, comments, shares }:{
  author: string; when: string; body: string; likes: number; comments: number; shares: number;
}) {
  return (
    <article className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
      <header className="mb-2 flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-neutral-700 text-xs font-bold">
          {author.slice(0, 1)}
        </div>
        <div>
          <p className="text-sm font-semibold">{author}</p>
          <p className="text-xs text-neutral-500">{when}</p>
        </div>
      </header>
      <p className="whitespace-pre-line text-sm text-neutral-200">{body}</p>
      <footer className="mt-3 flex gap-6 text-xs text-neutral-400">
        <button>👍 {likes}</button>
        <button>💬 {comments}</button>
        <button>↗ {shares}</button>
      </footer>
    </article>
  );
}

export default function FeedPage() {
  const yesterday = posts.filter(p => p.group === "Yesterday");
  const thisWeek  = posts.filter(p => p.group === "This week");
  const rest      = posts.filter(p => !p.group);

  return (
    <div className="feed-page">
      <LeftSidebar />

      <main className="feed-stream space-y-4">
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
          <h1 className="mb-3 text-lg font-semibold">Feed</h1>
          <div className="mb-3 flex gap-4 text-sm">
            <button className="font-semibold text-white">For You</button>
            <button className="text-neutral-400 hover:text-white">Following</button>
          </div>
          <textarea placeholder="What is happening?" rows={3}
                    className="w-full resize-none rounded-lg bg-neutral-800 p-3 text-sm outline-none placeholder:text-neutral-500" />
          <div className="mt-3 flex items-center justify-between text-xs text-neutral-400">
            <div className="flex gap-3">
              <button>📷 Photo</button>
              <button>🎬 Video</button>
              <button>🎵 Audio</button>
            </div>
            <button className="rounded-md bg-white px-3 py-1.5 font-medium text-black">Post</button>
          </div>
        </section>

        <h2 className="px-1 pt-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">Yesterday</h2>
        {yesterday.map(p => <PostCard key={p.id} {...p} />)}

        <h2 className="px-1 pt-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">This week</h2>
        {thisWeek.map(p => <PostCard key={p.id} {...p} />)}

        {rest.map(p => <PostCard key={p.id} {...p} />)}

        {threads.map((t, i) => (
          <article key={i} className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
            <PostCard author={t.rootAuthor} when={t.rootWhen} body={t.rootBody} likes={0} comments={t.replies.length} shares={0} />
            <div className="mt-3 space-y-2 border-l border-neutral-800 pl-4">
              {t.replies.map((r, j) => (
                <div key={j} className="text-xs text-neutral-300">
                  <span className="font-semibold">{r.author}</span>
                  <span className="text-neutral-500"> · {r.when}</span>
                  <p className="text-neutral-400">{r.body}</p>
                </div>
              ))}
            </div>
          </article>
        ))}

        <button className="w-full rounded-2xl border border-neutral-800 bg-neutral-900/60 py-3 text-sm text-neutral-300 hover:bg-neutral-800">
          Load more
        </button>

        <Footer />
      </main>

      <RightSidebar />
    </div>
  );
}