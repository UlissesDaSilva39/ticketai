import Link from "next/link";
import type { Metadata } from "next";
import { EventCard } from "@/components/EventCard";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Event } from "@/lib/types";

export type GenreMeta = {
  slug: string;
  name: string;
  blurb: string;
  keywords: string[];
};

export function genreMetadata(genre: GenreMeta): Metadata {
  return {
    title: `${genre.name} events near you â€” find your next night out`,
    description: genre.blurb,
    openGraph: {
      title: `${genre.name} events`,
      description: genre.blurb,
      type: "website",
    },
  };
}

export async function GenreEventsPage({ genre }: { genre: GenreMeta }) {
  const supabase = await createServerSupabase();

  const orFilter = genre.keywords
    .map((k) => `title.ilike.%${k}%,description.ilike.%${k}%`)
    .join(",");

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .gte("start_date", new Date().toISOString())
    .or(orFilter)
    .order("start_date", { ascending: true })
    .limit(60);

  const list = (events || []) as Event[];

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <section className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <p className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">
            Events
          </p>
          <h1
            className="text-6xl md:text-8xl font-bold leading-none uppercase"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            {genre.name}
          </h1>
          <p className="mt-6 text-xl text-gray-700 dark:text-gray-300 max-w-2xl">
            {genre.blurb}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2
            className="text-3xl font-bold uppercase"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            Upcoming {genre.name.toLowerCase()} events
          </h2>
          <Link
            href={`/search?q=${encodeURIComponent(genre.name)}`}
            className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
          >
            Search all events â†’
          </Link>
        </div>

        {list.length === 0 ? (
          <div className="rounded-xl border bg-gray-50 dark:bg-gray-950 p-12 text-center text-gray-500 dark:text-gray-400">
            No {genre.name.toLowerCase()} events yet. Check back soon.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((e) => (
              <EventCard
              key={e.id} event={e}
              artists={event.artists || []}
              venue={event.venue || null}
              promoter={event.organizer ? { slug: event.organizer.slug ?? '', name: event.organizer.name ?? '' } : null}
            />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Browse other genres</p>
          <div className="flex flex-wrap gap-3">
            {[
              { slug: "house-music", name: "House Music" },
              { slug: "techno", name: "Techno" },
              { slug: "live-music", name: "Live Music" },
              { slug: "comedy", name: "Comedy" },
              { slug: "jazz", name: "Jazz" },
              { slug: "hip-hop", name: "Hip-Hop" },
            ]
              .filter((g) => g.slug !== genre.slug)
              .map((g) => (
                <Link
                  key={g.slug}
                  href={"/" + g.slug}
                  className="rounded-full border border-gray-300 px-5 py-2 text-sm hover:border-black"
                >
                  {g.name}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
