const fs = require("fs");
const path = require("path");

function W(rel, content) {
  const full = path.join(process.cwd(), rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
  console.log("  ✅ " + rel + " (" + content.split("\n").length + " lines)");
}

// ---------- lib/cities.ts (the canonical city list) ----------
W("lib/cities.ts", `export type City = {
  slug: string;
  name: string;
  country: string;
  blurb: string;
};

export const CITIES: City[] = [
  { slug: "london",      name: "London",      country: "United Kingdom", blurb: "The capital of UK nightlife — from Fabric to Printworks." },
  { slug: "manchester",  name: "Manchester",  country: "United Kingdom", blurb: "Warehouse Project, Hidden, and the UK's best warehouse scene." },
  { slug: "birmingham",  name: "Birmingham",  country: "United Kingdom", blurb: "The UK's second city — O2 Academy, Lab11, and more." },
  { slug: "bristol",     name: "Bristol",     country: "United Kingdom", blurb: "Bass music capital — Motion, Thekla, Lakota." },
  { slug: "brighton",    name: "Brighton",    country: "United Kingdom", blurb: "Seaside rave central — Concorde 2, Patterns." },
  { slug: "leeds",       name: "Leeds",       country: "United Kingdom", blurb: "Northern powerhouse — Belgrave, Brudenell Social Club." },
  { slug: "glasgow",     name: "Glasgow",     country: "United Kingdom", blurb: "Scotland's clubbing heart — SWG3, Sub Club, Barrowlands." },
  { slug: "liverpool",   name: "Liverpool",   country: "United Kingdom", blurb: "Merseyside's music city — Invisible Wind Factory." },
  { slug: "newcastle",   name: "Newcastle",   country: "United Kingdom", blurb: "Geordie nightlife — World Headquarters, Digital." },
  { slug: "paris",       name: "Paris",       country: "France",         blurb: "Fête de la Musique and the Parisian electronic underground." },
  { slug: "berlin",      name: "Berlin",      country: "Germany",        blurb: "The world capital of techno — Berghain, Watergate, Sisyphos." },
  { slug: "amsterdam",   name: "Amsterdam",   country: "Netherlands",    blurb: "ADE every October — Shelter, Paradiso, De School." },
  { slug: "barcelona",   name: "Barcelona",   country: "Spain",          blurb: "Sónar, Razzmatazz, and beachside raves." },
  { slug: "madrid",      name: "Madrid",      country: "Spain",          blurb: "Mondo Disko, Fabrik, and Madrid's warehouse revival." },
  { slug: "dublin",      name: "Dublin",      country: "Ireland",        blurb: "Dublin's club scene — District 8, Button Factory." },
  { slug: "new-york",    name: "New York",    country: "United States",  blurb: "Brooklyn Mirage, Nowadays, and the city that never sleeps." },
  { slug: "los-angeles", name: "Los Angeles", country: "United States",  blurb: "LA's warehouse scene — Sound, Academy, Grand Park." },
  { slug: "chicago",     name: "Chicago",     country: "United States",  blurb: "The birthplace of house music — Smartbar, Spybar." },
  { slug: "miami",       name: "Miami",       country: "United States",  blurb: "Ultra, Club Space, and Miami Music Week." },
  { slug: "san-francisco", name: "San Francisco", country: "United States", blurb: "SF's Great Northern, Public Works, and the legendary Midway." },
  { slug: "toronto",     name: "Toronto",     country: "Canada",         blurb: "Toronto's Coda, Nest, and Union events." },
  { slug: "montreal",    name: "Montreal",    country: "Canada",         blurb: "Stereo, Newspeak, and MTL's legendary afterhours." },
  { slug: "vancouver",   name: "Vancouver",   country: "Canada",         blurb: "Vancouver's underground — Celebrities, Fortune Sound Club." },
  { slug: "sydney",      name: "Sydney",      country: "Australia",      blurb: "Sydney's club scene — Home the Venue, Chinese Laundry." },
  { slug: "melbourne",   name: "Melbourne",   country: "Australia",      blurb: "Melbourne's Revolver, Sub Club, and Chapel Street." },
  { slug: "brisbane",    name: "Brisbane",    country: "Australia",      blurb: "The Tivoli, The Zoo, and Brisbane's warehouse scene." },
  { slug: "perth",       name: "Perth",       country: "Australia",      blurb: "Perth's clubbing heart — Metropolis Fremantle." },
];

export function getCity(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug.toLowerCase());
}

export function slugToCityName(slug: string): string {
  return getCity(slug)?.name ?? slug.replace(/-/g, " ").replace(/\\b\\w/g, (c) => c.toUpperCase());
}
`);

// ---------- components/city/CityLanding.tsx ----------
W("components/city/CityLanding.tsx", `import Link from "next/link";
import { MapPin, Calendar, Users } from "lucide-react";
import type { City } from "@/lib/cities";

type VenueRow = { id: string; name: string; slug: string; city: string | null; hero_image: string | null };
type EventRow = {
  id: string; title: string; start_date: string; hero_image: string | null;
  venue_id: string | null; status: string | null;
};
type ArtistRow = { id: string; name: string; slug: string; genre: string | null; avatar_url: string | null; city: string | null };

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "short", timeZone: "Europe/London",
  });
}

export default function CityLanding({
  city,
  venues,
  events,
  artists,
}: {
  city: City;
  venues: VenueRow[];
  events: EventRow[];
  artists: ArtistRow[];
}) {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HERO */}
      <section className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-3">
            {city.country}
          </p>
          <h1
            className="text-5xl sm:text-6xl font-bold tracking-tight mb-4"
            style={{ fontFamily: "var(--font-antonio)" }}
            data-testid="city-heading"
          >
            {city.name}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mb-8">{city.blurb}</p>
          <div className="flex flex-wrap gap-6 text-sm">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" /> {events.length} upcoming events
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {venues.length} venues
            </span>
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4" /> {artists.length} artists
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* EVENTS */}
        <section className="mb-16" data-testid="city-events">
          <div className="flex items-baseline justify-between mb-6">
            <h2
              className="text-3xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-antonio)" }}
            >
              Events in {city.name}
            </h2>
            <Link
              href={"/events?city=" + city.slug}
              className="text-sm text-gray-500 hover:text-black whitespace-nowrap"
            >
              See all →
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-500 text-sm">
              No upcoming events in {city.name} yet. Check back soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.slice(0, 9).map((e) => (
                <Link
                  key={e.id}
                  href={"/event/" + e.id}
                  className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition"
                  data-testid="city-event-card"
                >
                  <div className="aspect-[16/9] bg-gradient-to-br from-gray-800 to-gray-600 overflow-hidden">
                    {e.hero_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={e.hero_image}
                        alt={e.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    ) : null}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-1">{fmtDate(e.start_date)}</p>
                    <h3 className="font-semibold text-sm leading-snug line-clamp-2">
                      {e.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* VENUES */}
        <section className="mb-16" data-testid="city-venues">
          <h2
            className="text-3xl font-bold tracking-tight mb-6"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            Venues in {city.name}
          </h2>
          {venues.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-500 text-sm">
              No venues listed yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {venues.slice(0, 12).map((v) => (
                <Link
                  key={v.id}
                  href={"/venue/" + v.slug}
                  className="bg-white border border-gray-200 rounded-xl p-3 hover:shadow transition"
                  data-testid="city-venue-card"
                >
                  <div className="text-sm font-medium truncate">{v.name}</div>
                  <div className="text-xs text-gray-500 truncate">{v.city}</div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ARTISTS */}
        <section className="mb-16" data-testid="city-artists">
          <h2
            className="text-3xl font-bold tracking-tight mb-6"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            Artists in {city.name}
          </h2>
          {artists.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-500 text-sm">
              No artists listed yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {artists.slice(0, 12).map((a) => (
                <Link
                  key={a.id}
                  href={"/artist/" + a.slug}
                  className="bg-white border border-gray-200 rounded-xl p-3 hover:shadow transition"
                  data-testid="city-artist-card"
                >
                  <div className="text-sm font-medium truncate">{a.name}</div>
                  <div className="text-xs text-gray-500 truncate">{a.genre ?? "Artist"}</div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
`);

// ---------- lib/city-data.ts ----------
W("lib/city-data.ts", `import { createServerSupabase } from "@/lib/supabase/server";
import type { City } from "@/lib/cities";

export async function loadCityData(city: City) {
  const supabase = await createServerSupabase();
  const cityName = city.name;

  const { data: venues } = await supabase
    .from("venues")
    .select("id, name, slug, city, hero_image")
    .ilike("city", cityName)
    .limit(48);

  const venueIds = (venues ?? []).map((v) => v.id);

  let events: {
    id: string; title: string; start_date: string; hero_image: string | null;
    venue_id: string | null; status: string | null;
  }[] = [];

  if (venueIds.length > 0) {
    const { data } = await supabase
      .from("events")
      .select("id, title, start_date, hero_image, venue_id, status")
      .in("venue_id", venueIds)
      .gte("start_date", new Date().toISOString())
      .order("start_date", { ascending: true })
      .limit(24);
    events = data ?? [];
  }

  const { data: artists } = await supabase
    .from("artists")
    .select("id, name, slug, genre, avatar_url, city")
    .ilike("city", cityName)
    .limit(48);

  return {
    venues: venues ?? [],
    events,
    artists: artists ?? [],
  };
}
`);

// ---------- app/cities/page.tsx (index) ----------
W("app/cities/page.tsx", `import Link from "next/link";
import type { Metadata } from "next";
import { CITIES } from "@/lib/cities";

export const metadata: Metadata = {
  title: "Cities",
  description: "Browse events, venues, and artists by city on GRID.",
};

export default function CitiesIndexPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1
          className="text-5xl font-bold tracking-tight mb-3"
          style={{ fontFamily: "var(--font-antonio)" }}
          data-testid="cities-heading"
        >
          Cities
        </h1>
        <p className="text-gray-600 mb-10 max-w-2xl">
          Discover events, venues, and artists in each city on GRID.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {CITIES.map((c) => (
            <Link
              key={c.slug}
              href={"/" + c.slug}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
              data-testid="city-tile"
            >
              <div className="font-semibold text-sm">{c.name}</div>
              <div className="text-xs text-gray-500">{c.country}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
`);

// ---------- app/city/[slug]/page.tsx (canonical /city/london) ----------
W("app/city/[slug]/page.tsx", `import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCity } from "@/lib/cities";
import { loadCityData } from "@/lib/city-data";
import CityLanding from "@/components/city/CityLanding";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) return { title: "City not found" };
  return {
    title: city.name + " events, venues & artists",
    description: city.blurb,
    openGraph: {
      title: city.name + " on GRID",
      description: city.blurb,
      type: "website",
    },
  };
}

export default async function CityPage({ params }: Props) {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();

  const { venues, events, artists } = await loadCityData(city);

  return <CityLanding city={city} venues={venues} events={events} artists={artists} />;
}
`);

// ---------- app/[city]/page.tsx (top-level /london, /manchester) ----------
W("app/[city]/page.tsx", `import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CITIES, getCity } from "@/lib/cities";
import { loadCityData } from "@/lib/city-data";
import CityLanding from "@/components/city/CityLanding";

type Props = { params: Promise<{ city: string }> };

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city) return { title: "Not found" };
  return {
    title: city.name + " events, venues & artists",
    description: city.blurb,
    openGraph: {
      title: city.name + " on GRID",
      description: city.blurb,
      type: "website",
    },
  };
}

export default async function TopLevelCityPage({ params }: Props) {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();

  const { venues, events, artists } = await loadCityData(city);

  return <CityLanding city={city} venues={venues} events={events} artists={artists} />;
}
`);

console.log("");
console.log("City files written.");
