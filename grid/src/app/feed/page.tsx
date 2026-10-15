import { LeftSidebar } from "@/components/sidebar/LeftSidebar";
import { RightSidebar } from "@/components/sidebar/RightSidebar";
import { Footer } from "@/components/sidebar/Footer";
import { posts, threads } from "@/data/feed";

function Post({ author, when, body, likes, comments, shares }:{
  author: string; when: string; body: string; likes: number; comments: number; shares: number;
}) {
  return (
    <article className="post">
      <header>
        <div className="avatar">{author.slice(0,1)}</div>
        <div>
          <div className="author">{author}</div>
          <div className="when">{when}</div>
        </div>
      </header>
      <div className="body">{body}</div>
      <footer>
        <span>👍 {likes}</span>
        <span>💬 {comments}</span>
        <span>↗ {shares}</span>
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

      <main className="feed-stream">
        <h1 className="feed-title">FEED</h1>

        <div className="tabs">
          <button className="tab active">For You</button>
          <button className="tab">Following</button>
        </div>

        <section className="composer">
          <textarea placeholder="What is happening?" rows={3} />
          <div className="row">
            <div className="left">
              <button>📷 Photo</button>
              <button>🎬 Video</button>
              <button>🎵 Audio</button>
            </div>
            <button className="post-btn">Post</button>
          </div>
        </section>

        {yesterday.length > 0 && <div className="section-label">Yesterday</div>}
        {yesterday.map(p => <Post key={p.id} {...p} />)}

        {thisWeek.length > 0 && <div className="section-label">This week</div>}
        {thisWeek.map(p => <Post key={p.id} {...p} />)}

        {rest.map(p => <Post key={p.id} {...p} />)}

        {threads.map((t, i) => (
          <article key={i} className="post">
            <header>
              <div className="avatar">{t.rootAuthor.slice(0,1)}</div>
              <div>
                <div className="author">{t.rootAuthor}</div>
                <div className="when">{t.rootWhen}</div>
              </div>
            </header>
            <div className="body">{t.rootBody}</div>
            <footer>
              <span>👍 0</span>
              <span>💬 {t.replies.length}</span>
              <span>↗ 0</span>
            </footer>
            <div className="replies">
              {t.replies.map((r, j) => (
                <div key={j} className="reply">
                  <strong>{r.author}</strong> · {r.when}
                  <div>{r.body}</div>
                </div>
              ))}
            </div>
          </article>
        ))}

        <button className="load-more">Load more</button>

        <Footer />
      </main>

      <RightSidebar />
    </div>
  );
}