import { PromotedMerch } from "./PromotedMerch";
import { trending, forYou, peopleToFollow } from "@/data/feed";

export function RightSidebar() {
  return (
    <aside className="feed-sidebar feed-sidebar--right space-y-4">
      <PromotedMerch />

      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
        <h3 className="mb-2 text-sm font-semibold">Trending</h3>
        <div className="flex flex-wrap gap-2 text-xs">
          {trending.map(t => (
            <span key={t} className="rounded-full bg-neutral-800 px-2 py-1">{t}</span>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
        <h3 className="mb-2 text-sm font-semibold">For You</h3>
        <ul className="space-y-2 text-sm">
          {forYou.map(e => (
            <li key={e.title} className="flex items-center justify-between">
              <span>{e.title}</span>
              <span className="text-xs text-neutral-400">{e.date}</span>
            </li>
          ))}
        </ul>
        <button className="mt-3 text-xs text-neutral-400 hover:text-white">See all</button>
      </section>

      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
        <h3 className="mb-2 text-sm font-semibold">People to follow</h3>
        <ul className="space-y-2 text-sm">
          {peopleToFollow.map(p => (
            <li key={p.name} className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-neutral-700 text-[10px] font-bold">{p.initials}</span>
                {p.name}
              </span>
              <button className="rounded-md border border-neutral-700 px-2 py-1 text-xs">Follow</button>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}