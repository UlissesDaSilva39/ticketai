import Link from "next/link";

type Props = {
  profile: {
    username: string | null;
    full_name: string | null;
    role: string | null;
  } | null;
  stats: { events: number; friends: number; followers: number };
  suggested: Array<{ id: string; username: string | null; full_name: string | null }>;
};

export default function LeftSidebar({ profile, stats, suggested }: Props) {
  const name = profile?.full_name || profile?.username || "You";
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const isPromoter =
    profile?.role === "promoter" || profile?.role === "venue" || profile?.role === "admin";

  return (
    <aside className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="h-16 bg-gradient-to-r from-black to-gray-700" />
        <div className="px-4 pb-4 -mt-6">
          <Link
            href={profile?.username ? "/u/" + profile.username : "/profile"}
            className="inline-flex w-12 h-12 rounded-full bg-black text-white items-center justify-center font-bold border-4 border-white"
          >
            {initials}
          </Link>
          <Link
            href={profile?.username ? "/u/" + profile.username : "/profile"}
            className="block mt-2 font-semibold text-sm hover:underline"
          >
            {name}
          </Link>
          {profile?.username ? (
            <p className="text-xs text-gray-500">@{profile.username}</p>
          ) : null}
        </div>
        <div className="border-t border-gray-100 grid grid-cols-3 text-center">
          <div className="py-3">
            <p className="font-semibold text-sm">{stats.events}</p>
            <p className="text-[11px] text-gray-500">Events</p>
          </div>
          <div className="py-3 border-l border-r border-gray-100">
            <p className="font-semibold text-sm">{stats.friends}</p>
            <p className="text-[11px] text-gray-500">Friends</p>
          </div>
          <div className="py-3">
            <p className="font-semibold text-sm">{stats.followers}</p>
            <p className="text-[11px] text-gray-500">Followers</p>
          </div>
        </div>
      </div>

      <nav className="bg-white border border-gray-200 rounded-2xl p-2">
        <Link href="/" className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-100">Feed</Link>
        <Link href="/my-tickets" className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-100">My Tickets</Link>
        <Link href="/friends" className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-100">Friends</Link>
        <Link href="/messages" className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-100">Messages</Link>
        <Link href="/bookmarks" className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-100">Bookmarked</Link>
        {isPromoter ? (
          <>
            <div className="border-t border-gray-100 my-2" />
            <Link href="/organizer" className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-100">Dashboard</Link>
            <Link href="/organizer/analytics" className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-100">Analytics</Link>
          </>
        ) : null}
      </nav>

      {suggested.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-3">
          <p className="texl-xs font-semibold uppercase tracking-wide text-gray-500 px-1 mb-2">
            People you may know
          </p>
          <ul className="space-y-2">
            {suggested.map((s) => {
              const sn = s.full_name || s.username || "Someone";
              const si = sn.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
              return (
                <li key={s.id} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    {si}
                  </div>
                  <Link
                    href={s.username ? "/u/" + s.username : "#"}
                    className="text-xs font-medium hover:underline truncate flex-1"
                  >
                    {sn}
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
