import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import { EventCard } from "@/components/EventCard";
import { findCity, CITIES } from "@/lib/cities";
import { findGenre, GENRES } from "@/lib/genres";
import { buildMetadata } from "@/lib/seo";
import type { Event } from "@/lib/types";

export const dynamic = "force-dynamic";

type Params = { slug?: string[] };

async function fetchEventsByCity(citySlug: string): Promise<Event[]> {
  const supabase = await createServerSupabase();
  const city = findCity(citySlug);
  if (!city) return [];

  const { data: venueRows } = await supabase
    .from("venues")
    .select("id")
    .ilike("city", city.name)
    .eq("status", "published");

  const venueIds = (venueRows ?? []).map((v) => v.id);
  if (venueIds.length === 0) return [];

  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .in("venue_id", venueIds)
    .gte("start_date", new Date().toISOString())
    .order("start_date", { ascending: true })
    .limit(60);

  return (data as Event[]) ?? [];
}

async function fetchEventsByGenre(genreSlug: string, cityName?: string): Promise<Event[]> {
  const supabase = await createServerSupabase();
  const genre = findGenre(genreSlug);
  if (!genre) return [];

  const orClauses = genre.keywords
    .flatMap((kw) => ["title.ilike.%" + kw + "%", "description.ilike.%" + kw + "%"])
    .join(",");

  let query = supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .or(orClauses)
    .gte("start_date", new Date().toISOString())
    .order("start_date", { ascending: true })
    .limit(60);

  if (cityName) {
    const { data: venueRows } = await supabase
      .from("venues")
      .select("id")
      .ilike("city", cityName)
      .eq("status", "published");
    const venueIds = (venueRows ?? []).map((v) => v.id);
    if (venueIds.length === 0) return [];
    query = query.in("venue_id", venueIds);
  }

  const { data } = await query;
  return (data as Event[]) ?? [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = "/events/" + (slug ?? []).join("/");

  if (!slug || slug.length === 0) {
    return buildMetadata({
      title: "Browse Events",
      description: "Discover events near you.",
      path,
    });
  }

  if (slug.length === 1) {
    const one = slug[0];
    const city = findCity(one);
    if (city) {
      return buildMetadata({
        title: "Events in " + city.name,
        description: city.description,
        path,
      });
    }
    const genre = findGenre(one);
    if (genre) {
      return buildMetadata({
        title: genre.name + " Events",
        description: genre.description,
        path,
      });
    }
  }

  if (slug.length === 2) {
    const city = findCity(slug[0]);
    const genre = findGenre(slug[1]);
    if (city && genre) {
      return buildMetadata({
        title: genre.name + " Events in " + city.name,
        description: genre.name + " events in " + city.name + ". " + city.description,
        path,
      });
    }
  }

  return buildMetadata({
    title: "Events",
    description: "Discover events near you.",
    path,
  });
}

export default async function EventsLandingPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  if (!slug || slug.length === 0 || slug.length > 2) notFound();

  let heading = "";
  let subheading = "";
  let events: Event[] = [];

  if (slug.length === 1) {
    const one = slug[0];
    const city = findCity(one);
    if (city) {
      heading = "Events in " + city.name;
      subheading = city.description;
      events = await fetchEventsByCity(city.slug);
    } else {
      const genre = findGenre(one);
      if (!genre) notFound();
      heading = genre.name + " Events";
      subheading = genre.description;
      events = await fetchEventsByGenre(genre.slug);
    }
  } else {
    const city = findCity(slug[0]);
    const genre = findGenre(slug[1]);
    if (!city || !genre) notFound();
    heading = genre.name + " Events in " + city.name;
    subheading = "Discover the best " + genre.name.toLowerCase() + " events in " + city.name + ".";
    events = await fetchEventsByGenre(genre.slug, city.name);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">{heading}</h1>
        <p className="text-gray-600 mt-3 max-w-2xl">{subheading}</p>
      </header>

      {events.length === 0 ? (
        <div className="text-center py-16 border border-gray-200 rounded-2xl">
          <p className="text-lg font-medium">No events yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Check back soon, or browse{" "}
            <Link href="/search" className="underline">all events</Link>.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}

      <section className="mt-16">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
          Browse other cities
        </h2>
        <div className="flex flex-wrap gap-2">
          {CITIES.slice(0, 12).map((c) => (
            <Link
              key={c.slug}
              href={"/events/" + c.slug}
              className="text-sm px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
          Browse by genre
        </h2>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((g) => (
            <Link
              key={g.slug}
              href={"/events/" + g.slug}
              className="text-sm px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50"
            >
              {g.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}