import { PromotedMerch } from "./PromotedMerch";
import { trending, forYou, peopleToFollow } from "@/data/feed";

export function RightSidebar() {
  return (
    <aside className="feed-sidebar feed-sidebar--right">
      <PromotedMerch />

      <section className="card">
        <h3>Trending</h3>
        <div className="tags">
          {trending.map(t => <span key={t}>{t}</span>)}
        </div>
      </section>

      <section className="card">
        <h3>For You</h3>
        <div>
          {forYou.map(e => (
            <div key={e.title} className="event-row">
              <div className="ev-thumb" />
              <div className="ev-info">
                <div className="ev-title">{e.title}</div>
              </div>
              <div className="ev-date-r">{e.date}</div>
            </div>
          ))}
        </div>
        <button style={{ background:"none", border:0, color:"var(--text-mute)", fontSize:12, padding:"8px 0 0" }}>
          See all
        </button>
      </section>

      <section className="card">
        <h3>People to follow</h3>
        <ul className="people">
          {peopleToFollow.map(p => (
            <li key={p.name}>
              <span className="who">
                <span className="avatar">{p.initials}</span>
                <span className="name">{p.name}</span>
              </span>
              <button>Follow</button>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}