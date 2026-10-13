import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar/Sidebar";

type Props = {
  city: string;
  slug: string;
};

type EventRow = {
  id: string;
  title: string;
  start_date: string;
  hero_image: string | null;
  ticket_types: any;
  venues: { name: string; city: string } | null;
};

type VenueRow = {
  id: string;
  name: string;
  slug: string;
  hero_image: string | null;
  capacity: number | null;
};

type ArtistRow = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  genre: string | null;
};

export default async function CityPage({ city, slug }: Props) {
  const supabase = await createServerSupabase();

  const { data: venueIds } = await supabase
    .from("venues")
    .select("id")
    .ilike("city", city);

  const venueIdList = (venueIds || []).map((v) => v.id);

  const { data: eventsRaw } = venueIdList.length
    ? await supabase
        .from("events")
        .select("id, title, start_date, hero_image, ticket_types, venues(name, city)")
        .in("venue_id", venueIdList)
        .eq("status", "published")
        .gte("start_date", new Date().toISOString())
        .order("start_date", { ascending: true })
        .limit(12)
    : { data: [] as EventRow[] };
  const events: EventRow[] = (eventsRaw || []) as any;

  const { data: venues } = await supabase
    .from("venues")
    .select("id, name, slug, hero_image, capacity")
    .ilike("city", city)
    .limit(8);

  const { data: artists } = await supabase
    .from("profiles")
    .select("id, username, full_name, avatar_url, genre")
    .ilike("city", city)
    .eq("role", "artist")
    .not("username", "is", null)
    .limit(8);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  const priceFrom = (ticketTypes: any): string => {
    if (!Array.isArray(ticketTypes) || ticketTypes.length === 0) return "";
    const prices = ticketTypes.map((t: any) => Number(t?.price)).filter((n: number) => Number.isFinite(n) && n > 0);
    if (prices.length === 0) return "";
    return "from £" + Math.min(...prices);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 py-6 grid grid-cols-12 gap-6">
        <nav aria-label="Your library" className="col-span-12 lg:col-span-3">
          <Sidebar />
        </nav>

        <main className="col-span-12 lg:col-span-9 space-y-10">
          <header>
            <h1
              className="text-5xl font-bold uppercase mb-2"
              style={{ fontFamily: "var(--font-antonio)" }}
            >
              Events in {city}
            </h1>
            <p className="text-gray-600">
              Discover live music, venues, and artists in {city}.
            </p>
          </header>

          <section>
            <h2
              className="text-2xl font-bold uppercase mb-4"
              style={{ fontFamily: "var(--font-antonio)" }}
            >
              Upcoming events
            </h2>
            {events.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
                <p className="text-gray-600">No upcoming events in {city} yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {events.map((e) => (
                  <Link
                    key={e.id}
                    href={"/event/" + e.id}
                    className="block bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {e.hero_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={e.hero_image} alt={e.title} className="w-full h-40 object-cover" />
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-br from-gray-200 to-gray-300" />
                    )}
                    <div className="p-4">
                      <p className="text-xs text-gray-500 mb-1">
                        {fmtDate(e.start_date)}
                        {e.venues?.name ? " · " + e.venues.name : ""}
                      </p>
                      <p className="font-bold text-sm truncate">{e.title}</p>
                      {priceFrom(e.ticket_types) ? (
                        <p className="text-xs text-gray-500 mt-1">{priceFrom(e.ticket_types)}</p>
                      ) : null}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {venues && venues.length > 0 ? (
            <section>
              <h2
                className="text-2xl font-bold uppercase mb-4"
                style={{ fontFamily: "var(--font-antonio)" }}
              >
                Venues in {city}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {venues.map((v) => (
                  <Link
                    key={v.id}
                    href={"/venue/" + v.slug}
                    className="block bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {v.hero_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={v.hero_image} alt={v.name} className="w-full h-32 object-cover" />
                    ) : (
                      <div className="w-full h-32 bg-gradient-to-br from-gray-800 to-gray-900" />
                    )}
                    <div className="p-3">
                      <p className="font-bold text-sm truncate">{v.name}</p>
                      {v.capacity ? (
                        <p className="text-xs text-gray-500 mt-0.5">Cap. {v.capacity}</p>
                      ) : null}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {artists && artists.length > 0 ? (
            <section>
              <h2
                className="text-2xl font-bold uppercase mb-4"
                style={{ fontFamily: "var(--font-antonio)" }}
              >
                Artists from {city}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
                {artists.map((a) => (
                  <Link
                    key={a.id}
                    href={"/artists/" + a.username}
                    className="text-center"
                  >
                    {a.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={a.avatar_url}
                        alt={a.full_name || a.username || "Artist"}
                        className="w-20 h-20 rounded-full object-cover mx-auto"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-300 mx-auto" />
                    )}
                    <p className="text-xs font-medium mt-2 truncate">
                      {a.full_name || a.username}
                    </p>
                    {a.genre ? (
                      <p className="text-[10px] text-gray-500 truncate">{a.genre}</p>
                    ) : null}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <p className="text-xs text-gray-400 text-center pt-4">
            Looking for something else?{" "}
            <Link href="/search" className="underline hover:text-black">
              Search all events
            </Link>
          </p>
        </main>
      </div>
    </div>
  );
}
