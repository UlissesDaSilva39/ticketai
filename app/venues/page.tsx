import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Discover venues",
  description:
    "Browse UK venues for your next event. Pubs, clubs, theatres, warehouses, and more.",
};

export const dynamic = "force-dynamic";

type Venue = {
  id: string;
  name: string;
  slug: string | null;
  city: string | null;
  venue_type: string | null;
  capacity: number | null;
  hero_image: string | null;
  description: string | null;
};

export default async function VenuesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    city?: string;
    type?: string;
    capacity?: string;
  }>;
}) {
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  const city = (sp.city || "").trim();
  const type = (sp.type || "").trim();
  const minCapacity = sp.capacity ? Number(sp.capacity) : 0;

  const supabase = await createServerSupabase();

  let query = supabase
    .from("venues")
    .select("id, name, slug, city, venue_type, capacity, hero_image, description")
    .eq("status", "published");

  if (q) query = query.ilike("name", "%" + q + "%");
  if (city) query = query.ilike("city", "%" + city + "%");
  if (type) query = query.eq("venue_type", type);
  if (minCapacity > 0) query = query.gte("capacity", minCapacity);

  const { data: venues } = await query.order("name", { ascending: true }).limit(60);

  const list = (venues || []) as Venue[];

  // Build a distinct list of cities for the filter dropdown
  const { data: allVenues } = await supabase
    .from("venues")
    .select("city")
    .eq("status", "published");

  const cities = Array.from(
    new Set(
      (allVenues || [])
        .map((v: { city: string | null }) => v.city)
        .filter((c): c is string => Boolean(c))
    )
  ).sort();

  const types = ["pub", "club", "theatre", "warehouse", "outdoor", "studio", "other"];

  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">
            Venues
          </p>
          <h1
            className="text-6xl md:text-8xl font-bold leading-none uppercase"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            Discover venues
          </h1>
          <p className="mt-6 text-xl text-gray-700">
            Find the perfect space for your next event. Browse by city, capacity, and type.
          </p>
        </div>

        <form
          method="GET"
          className="mt-10 grid gap-3 md:grid-cols-[1fr_auto_auto_auto_auto]"
        >
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search by name..."
            className="rounded-full border border-gray-300 px-5 py-3 outline-none focus:border-black"
          />

          <select
            name="city"
            defaultValue={city}
            className="rounded-full border border-gray-300 px-5 py-3 bg-white outline-none focus:border-black"
          >
            <option value="">All cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            name="type"
            defaultValue={type}
            className="rounded-full border border-gray-300 px-5 py-3 bg-white outline-none focus:border-black"
          >
            <option value="">All types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>

          <select
            name="capacity"
            defaultValue={sp.capacity || ""}
            className="rounded-full border border-gray-300 px-5 py-3 bg-white outline-none focus:border-black"
          >
            <option value="">Any capacity</option>
            <option value="100">100+</option>
            <option value="250">250+</option>
            <option value="500">500+</option>
            <option value="1000">1,000+</option>
            <option value="2000">2,000+</option>
          </select>

          <button
            type="submit"
            className="rounded-full bg-black text-white px-6 py-3 font-medium hover:bg-gray-800"
          >
            Search
          </button>
        </form>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        {list.length === 0 ? (
          <div className="rounded-xl border bg-gray-50 p-16 text-center">
            <p className="text-lg text-gray-500">
              No venues match your filters yet.
            </p>
            <Link
              href="/venues"
              className="mt-4 inline-block text-sm text-gray-500 underline hover:text-black"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((venue) => (
              <Link
                key={venue.id}
                href={"/venue/" + (venue.slug || venue.id)}
                className="group block overflow-hidden rounded-xl border bg-white transition hover:border-black"
              >
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  {venue.hero_image ? (
                    <img
                      src={venue.hero_image}
                      alt={venue.name}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      No image yet
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h2 className="text-2xl font-bold leading-tight">
                    {venue.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 capitalize">
                    {venue.city || "Unknown city"}
                    {venue.venue_type ? " · " + venue.venue_type : ""}
                    {venue.capacity ? " · " + venue.capacity.toLocaleString() + " cap." : ""}
                  </p>
                  {venue.description ? (
                    <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                      {venue.description}
                    </p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}