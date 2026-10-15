import Link from "next/link";

const library = [
  ["Home",           "/"],
  ["Artists",        "/artists"],
  ["Search",         "/search"],
  ["My Tickets",     "/tickets"],
  ["Friends",        "/friends"],
  ["Messages",       "/messages"],
  ["Following",      "/following"],
  ["Network",        "/network"],
  ["Opportunities",  "/opportunities"],
  ["Dashboard",      "/dashboard"],
] as const;

export function LeftSidebar() {
  return (
    <aside className="feed-sidebar feed-sidebar--left space-y-4">
      {/* Profile */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-neutral-700 text-sm font-bold">D</div>
          <p className="text-sm font-semibold">Profile</p>
        </div>
      </div>

      {/* YOUR LIBRARY */}
      <nav className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Your Library</p>
        <ul className="space-y-1 text-sm">
          {library.map(([label, href]) => (
            <li key={href}>
              <Link href={href} className="block rounded-md px-2 py-1.5 hover:bg-neutral-800">{label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Find events */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
        <p className="text-sm font-medium">Find events near you</p>
        <p className="mt-1 text-xs text-neutral-400">Browse by city, genre, and date.</p>
        <Link href="/discover" className="mt-3 inline-block rounded-md border border-neutral-700 px-3 py-1.5 text-xs">Explore</Link>
      </div>

      {/* Grow */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
        <p className="text-sm font-medium">Grow on GRID</p>
        <p className="mt-1 text-xs text-neutral-400">Get verified, unlock booking tools and AI.</p>
        <button className="mt-3 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-black">Upgrade to Pro</button>
      </div>
    </aside>
  );
}