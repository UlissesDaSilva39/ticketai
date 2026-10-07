import Link from "next/link";

type MiniEvent = {
  id: string;
  title: string;
  start_date: string | null;
  hero_image: string | null;
};

type Props = {
  trending: string[];
  forYou: MiniEvent[];
  peopleToFollow: Array<{ id: string; username: string | null; full_name: string | null }>;
};

export default function RightSidebar({ trending, forYou, peopleToFollow }: Props) {
  return (
    <aside className="space-y-4">
      {trending.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
            Trending
          </p>
          <ul className="space-y-2">
            {trending.map((t) => (
              <li key={t}>
                <Link
                  href={"/search?q=" + encodeURIComponent(t.replace("#", ""))}
                  className="text-sm text-gray-800 hover:text-black hover:underline"
                >
                  {t}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {forYou.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
            For You
          </p>
          <ul className="space-y-3">
            {forYou.map((e) => (
              <li key={e.id}>
                <Link href={"/event/" + e.id} className="flex gap-2 group">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    {e.hero_image ? (
                      <img src={e.hero_image} alt="" className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate group-hover:underline">
                      {e.title}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {e.start_date
                        ? new Date(e.start_date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                          })
                        : "TBC"}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/search" className="block text-xs text-gray-500 hover:text-black mt-3">
            See all
          </Link>
        </div>
      ) : null}

      {peopleToFollow.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
            People to follow
          </p>
          <ul className="space-y-3">
            {peopleToFollow.map((p) => {
              const name = p.full_name || p.username || "Someone";
              const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
              return (
                <li key={p.id} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    {initials}
                  </div>
                  <Link
                    href={p.username ? "/u/" + p.username : "#"}
                    className="text-xs font-medium hover:underline truncate flex-1"
                  >
                    {name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}