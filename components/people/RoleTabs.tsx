import Link from "next/link";

type Tab = { slug: string; label: string; count: number };

const LABELS: Record<string, string> = {
  all: "All",
  attendee: "Fans",
  a_and_r: "A&R",
  record_company: "Labels",
  artist: "Artists",
  promoter: "Promoters",
  venue: "Venues",
  admin: "Admins",
  user: "Users",
};

export default function RoleTabs({
  tabs, activeRole, query,
}: {
  tabs: Tab[];
  activeRole: string;
  query: Record<string, string | undefined>;
}) {
  function hrefFor(slug: string): string {
    const params = new URLSearchParams();
    if (slug !== "all") params.set("role", slug);
    for (const [k, v] of Object.entries(query)) {
      if (k === "role") continue;
      if (v) params.set(k, v);
    }
    const qs = params.toString();
    return "/people" + (qs ? "?" + qs : "");
  }

  return (
    <nav className="flex flex-wrap gap-2">
      {tabs.map((t) => {
        const active = t.slug === activeRole;
        return (
          <Link
            key={t.slug}
            href={hrefFor(t.slug)}
            className={
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition " +
              (active
                ? "bg-black text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:border-black")
            }
          >
            {LABELS[t.slug] ?? t.slug}
            <span className={active ? "text-white/60" : "text-gray-400"}>{t.count}</span>
          </Link>
        );
      })}
    </nav>
  );
}