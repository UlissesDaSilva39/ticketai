 import Link from "next/link";
import type { Metadata } from "next";
import { EventCard } from "@/components/EventCard";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Event } from "@/lib/types";

export type CityMeta = {
  slug: string;
  name: string;
  region: string;
  blurb: string;
};

export function cityMetadata(city: CityMeta): Metadata {
  return {
    title: `Events in ${city.name} — find your next night out`,
    description: `${city.blurb} Browse upcoming events in ${city.name}, ${city.region}.`,
    openGraph: {
      title: `Events in ${city.name}`,
      description: city.blurb,
      type: "website",
    },
  };
}

export async function CityEventsPage({ city }: { city: CityMeta }) {
  const supabase = await createServerSupabase();

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .gte("start_date", new Date().toISOString())
    .or(`description.ilike.%${city.name}%,title.ilike.%${city.name}%`)
    .order("start_date", { ascending: true })
    .limit(60);

  const list = (events || []) as Event[];

  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">
            {city.region}
          </p>
          <h1
            className="text-6xl md:text-8xl font-bold leading-none uppercase"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            Events in {city.name}
          </h1>
          <p className="mt-6 text-xl text-gray-700 max-w-2xl">
            {city.blurb}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2
            className="text-3xl font-bold uppercase"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            Upcoming events
          </h2>
          <Link
            href={`/search?q=${encodeURIComponent(city.name)}`}
            className="text-sm font-medium text-gray-500 hover:text-black"
          >
            Search all events →
          </Link>
        </div>

        {list.length === 0 ? (
          <div className="rounded-xl border bg-gray-50 p-12 text-center text-gray-500">
            No events in {city.name} yet. Check back soon.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="text-sm text-gray-500 mb-4">Browse other cities</p>
          <div className="flex flex-wrap gap-3">
            {[
              { slug: "london", name: "London" },
              { slug: "manchester", name: "Manchester" },
              { slug: "birmingham", name: "Birmingham" },
              { slug: "bristol", name: "Bristol" },
              { slug: "leeds", name: "Leeds" },
              { slug: "glasgow", name: "Glasgow" },
              { slug: "brighton", name: "Brighton" },
              { slug: "paris", name: "Paris" },
              { slug: "berlin", name: "Berlin" },
              { slug: "amsterdam", name: "Amsterdam" },
              { slug: "barcelona", name: "Barcelona" },
              { slug: "dublin", name: "Dublin" },
              { slug: "new-york", name: "New York" },
              { slug: "los-angeles", name: "Los Angeles" },
              { slug: "miami", name: "Miami" },
              { slug: "chicago", name: "Chicago" },
              { slug: "san-francisco", name: "San Francisco" },
              { slug: "toronto", name: "Toronto" },
              { slug: "vancouver", name: "Vancouver" },
              { slug: "montreal", name: "Montreal" },
              { slug: "calgary", name: "Calgary" },
              { slug: "sydney", name: "Sydney" },
              { slug: "melbourne", name: "Melbourne" },
              { slug: "brisbane", name: "Brisbane" },
              { slug: "perth", name: "Perth" },
            ]
              .filter((c) => c.slug !== city.slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={"/" + c.slug}
                  className="rounded-full border border-gray-300 px-5 py-2 text-sm hover:border-black"
                >
                  {c.name}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}