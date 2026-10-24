import Link from "next/link";

type Props = {
  signedIn: boolean;
  profile: {
    username: string | null;
    full_name: string | null;
  } | null;
  following: Array<{ id: string; username: string | null; full_name: string | null }>;
  recentEvents: Array<{ id: string; title: string }>;
};

const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Icon({ d, size = 18 }: { d: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...S}>
      <path d={d} />
    </svg>
  );
}

const PATHS = {
  grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  home: "M3 10.5 12 3l9 7.5M5.5 9.5v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-10",
  artist:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 0c0 2.5-2 4.5-4.5 5.5M12 15c0 2.5 2 4.5 4.5 5.5M12 3v6",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.35-4.35",
  ticket:
    "M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 1 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 1 0 0-4V8Z",
  friends:
    "M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87M16 2.13a4 4 0 0 1 0 7.75",
  message:
    "M21 12a8 8 0 0 1-8 8H7l-4 3V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8Z",
  bookmark: "M6 4h12v17l-6-4-6 4V4Z",
  calendar:
    "M8 2v3M16 2v3M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
  compass:
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm3-12-2.2 5.6a1 1 0 0 1-.2.2L7 17l2.2-5.6a1 1 0 0 1 .2-.2L15 9Z",
  user: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7 5a7 7 0 0 0-14 0",
};

export default function LibrarySidebar({
  signedIn,
  profile,
  following,
  recentEvents,
}: Props) {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-20 space-y-3">
        <div className="bg-white border border-gray-200 rounded-2xl p-3">
          <div className="flex items-center gap-2 px-3 py-2 mb-1">
            <Icon d={PATHS.grid} size={14} />
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
              Your Library
            </p>
          </div>

          <nav className="space-y-0.5">
            <NavRow href="/" icon={PATHS.home} label="Home" />
            <NavRow href="/artists" icon={PATHS.artist} label="Artists" />
            <NavRow href="/search" icon={PATHS.search} label="Search" />

            {signedIn ? (
              <>
                <div className="h-px bg-gray-100 my-2 mx-3" />
                <NavRow href="/my-tickets" icon={PATHS.ticket} label="My Tickets" />
                <NavRow href="/friends" icon={PATHS.friends} label="Friends" />
                <NavRow href="/messages" icon={PATHS.message} label="Messages" />
                <NavRow href="/bookmarks" icon={PATHS.bookmark} label="Bookmarked" />
              </>
            ) : null}
          </nav>
        </div>

        {signedIn && recentEvents.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-3">
            <div className="flex items-center gap-2 px-3 py-2 mb-1">
              <Icon d={PATHS.calendar} size={14} />
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
                Your Events
              </p>
            </div>
            <ul className="space-y-0.5">
              {recentEvents.map((e) => (
                <li key={e.id}>
                  <Link
                    href={"/event/" + e.id}
                    className="group flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-black transition-colors" />
                    <span className="truncate">{e.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {signedIn && following.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-3">
            <div className="flex items-center gap-2 px-3 py-2 mb-1">
              <Icon d={PATHS.user} size={14} />
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
                Artists You Follow
              </p>
            </div>
            <ul className="space-y-0.5">
              {following.slice(0, 8).map((a) => {
                const name = a.full_name || a.username || "Artist";
                const initials = name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                return (
                  <li key={a.id}>
                    <Link
                      href={a.username ? "/artists/" + a.username : "#"}
                      className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        {initials}
                      </span>
                      <span className="text-xs truncate">{name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {!signedIn ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center mb-3">
              <Icon d={PATHS.user} size={16} />
            </div>
            <p className="text-xs font-bold text-black mb-1">
              Build your library
            </p>
            <p className="text-xs text-gray-500 mb-3 leading-relaxed">
              Sign in to save events and follow artists.
            </p>
            <Link
              href="/login"
              className="block px-4 py-2 bg-black text-white text-xs font-semibold rounded-full text-center hover:bg-gray-800 transition-colors"
            >
              Sign in
            </Link>
          </div>
        ) : null}

        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center mb-3">
            <Icon d={PATHS.compass} size={16} />
          </div>
          <p className="text-xs font-bold text-black mb-1">
            Find events near you
          </p>
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">
            Browse by city, genre, and date.
          </p>
          <Link
            href="/search"
            className="block px-4 py-2 border border-black text-black text-xs font-semibold rounded-full text-center hover:bg-gray-50 transition-colors"
          >
            Explore
          </Link>
        </div>
      </div>
    </aside>
  );
}

function NavRow({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
    >
      <Icon d={icon} size={18} />
      <span>{label}</span>
    </Link>
  );
}