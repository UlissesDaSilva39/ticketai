import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";

// Real search across people, posts, opportunities and events. Replaces mock data.
// Only public columns are read, so it also works for logged-out visitors.

export const metadata: Metadata = { title: "Search" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ q?: string }> };

const clean = (v: string) => v.trim().slice(0, 60).replace(/[%,()*\\]/g, " ").trim();

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  if (count === 0) return null;
  return (
    <section className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
      <h2 className="px-5 pt-4 pb-2 text-sm font-bold uppercase tracking-wide text-gray-500">
        {title} <span className="font-normal">({count})</span>
      </h2>
      <ul className="divide-y divide-gray-100 dark:divide-zinc-800">{children}</ul>
    </section>
  );
}

export default async function SearchPage({ searchParams }: Props) {
  const { q: raw = "" } = await searchParams;
  const q = clean(raw);
  const supabase = await createServerSupabase();

  let people: { id: string; full_name: string | null; username: string | null; avatar_url: string | null; role: string | null; city: string | null }[] = [];
  let posts: { id: string; body: string | null; created_at: string }[] = [];
  let opps: { id: string; title: string; org: string; location: string | null; deadline: string | null }[] = [];
  let events: { id: string; title: string; start_date: string; venue_name: string | null; venue_city: string | null }[] = [];

  if (q.length >= 2) {
    const like = `%${q}%`;
    const [p, po, o, e] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, username, avatar_url, role, city")
        .eq("is_public", true)
        .not("username", "is", null)
        .or(`full_name.ilike.${like},username.ilike.${like},city.ilike.${like},genre.ilike.${like}`)
        .limit(10),
      supabase.from("posts").select("id, body, created_at").ilike("body", like).order("created_at", { ascending: false }).limit(10),
      supabase.from("opportunities").select("id, title, org, location, deadline").or(`title.ilike.${like},org.ilike.${like},description.ilike.${like}`).limit(10),
      supabase
        .from("events")
        .select("id, title, start_date, venue_name, venue_city")
        .eq("status", "published")
        .or(`title.ilike.${like},venue_name.ilike.${like},venue_city.ilike.${like}`)
        .order("start_date", { ascending: false })
        .limit(10),
    ]);
    people = p.data ?? [];
    posts = po.data ?? [];
    const today = Date.now();
    opps = (o.data ?? []).filter((x) => !x.deadline || new Date(x.deadline).getTime() + 86_400_000 > today);
    events = e.data ?? [];
  }

  const total = people.length + posts.length + opps.length + events.length;
  const nameOf = (p: (typeof people)[number]) => (p.full_name && !p.full_name.includes("@") ? p.full_name : p.username) || "GRID member";

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-[calc(100vh-56px)]">
      <div className="mx-auto max-w-3xl px-4 py-6 space-y-4">
        <form action="/search" method="GET" className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm flex gap-2">
          <input
            name="q"
            defaultValue={raw}
            autoFocus
            placeholder="Search people, posts, gigs and events"
            aria-label="Search"
            className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
          <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            Search
          </button>
        </form>

        {q.length < 2 ? (
          <p className="text-center text-sm text-gray-500">Type at least 2 characters.</p>
        ) : total === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-10 text-center">
            <p className="font-semibold text-gray-900 dark:text-white">No results for “{q}”</p>
            <p className="mt-1 text-sm text-gray-500">Try a name, @username, city, genre, venue or event.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500">
              {total} result{total === 1 ? "" : "s"} for “{q}”
            </p>

            <Section title="People" count={people.length}>
              {people.map((p) => (
                <li key={p.id}>
                  <Link href={`/u/${p.username}`} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/60">
                    {p.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-700 font-bold text-white">{nameOf(p).slice(0, 1).toUpperCase()}</span>
                    )}
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-gray-900 dark:text-white">{nameOf(p)}</span>
                      <span className="block truncate text-xs text-gray-500">
                        @{p.username}
                        {p.city ? ` · ${p.city}` : ""}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </Section>

            <Section title="Opportunities" count={opps.length}>
              {opps.map((o) => (
                <li key={o.id}>
                  <Link href="/jobs" className="block px-5 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/60">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">{o.title}</span>
                    <span className="block text-xs text-gray-500">
                      {o.org}
                      {o.location ? ` · ${o.location}` : ""}
                    </span>
                  </Link>
                </li>
              ))}
            </Section>

            <Section title="Events" count={events.length}>
              {events.map((e) => (
                <li key={e.id}>
                  <Link href={`/events/${e.id}`} className="block px-5 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/60">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">{e.title}</span>
                    <span className="block text-xs text-gray-500">
                      {new Date(e.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      {[e.venue_name, e.venue_city].filter(Boolean).length ? ` · ${[e.venue_name, e.venue_city].filter(Boolean).join(", ")}` : ""}
                    </span>
                  </Link>
                </li>
              ))}
            </Section>

            <Section title="Posts" count={posts.length}>
              {posts.map((p) => (
                <li key={p.id}>
                  <Link href={`/post/${p.id}`} className="block px-5 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/60">
                    <span className="block text-sm text-gray-800 dark:text-gray-200 line-clamp-2">{p.body}</span>
                    <span className="block text-xs text-gray-500 mt-0.5">{new Date(p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                  </Link>
                </li>
              ))}
            </Section>
          </>
        )}
      </div>
    </div>
  );
}
