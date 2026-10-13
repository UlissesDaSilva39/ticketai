import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import ArtistCard from "@/components/artist/ArtistCard";
import CardRow from "@/components/artist/CardRow";
import { priceFrom } from "@/lib/posts";
import { Sidebar } from "@/components/sidebar/Sidebar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Discover",
  description: "Discover events, promoters, venues, and artists on TicketAI.",
};

export default async function ArtistsIndexPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  const [profileRes, artistsRes, eventsRes, trendingRes, followingRes] =
    await Promise.all([
      user
        ? supabase
            .from("profiles")
            .select("username, full_name")
            .eq("id", user.id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
      supabase
        .from("profiles")
        .select("id, full_name, username, avatar_url, genre, city")
        .not("username", "is", null)
        .limit(24),
      supabase
        .from("events")
        .select("id, title, start_date, hero_image, ticket_types, venue_id")
        .gte("start_date", new Date().toISOString())
        .eq("status", "published")
        .order("start_date", { ascending: true })
        .limit(24),
      supabase
        .from("events")
        .select("id, title, start_date, hero_image, ticket_types, venue_id, views")
        .eq("status", "published")
        .order("views", { ascending: false })
        .limit(12),
      user
        ? supabase.from("follows").select("target_id").eq("follower_id", user.id)
        : Promise.resolve({ data: [] }),
    ]);

  const profile = profileRes.data;
  const artists = artistsRes.data || [];
  const events = eventsRes.data || [];
  const trending = trendingRes.data || [];
  const following = (followingRes.data || []).map((f: { target_id: string }) => f.target_id);

  const promoters = artists.filter((a: { id: string }) => !following.includes(a.id)).slice(0, 8);
  const venues = artists.slice(8, 16);
  const creators = artists.slice(16, 24);

  const cityCounts = new Map<string, number>();
  for (const e of events) {
    const venue = (e as unknown as { venues?: { city?: string } }).venues;
    const city = venue?.city;
    if (city) cityCounts.set(city, (cityCounts.get(city) || 0) + 1);
  }
  const popularCities = Array.from(cityCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const countryCounts = new Map<string, number>();
  for (const e of events) {
    const venue = (e as unknown as { venues?: { country?: string } }).venues;
    const country = venue?.country;
    if (country) countryCounts.set(country, (countryCounts.get(country) || 0) + 1);
  }
  const popularCountries = Array.from(countryCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const FLAGS: Record<string, string> = {
    UK: "GB", "United Kingdom": "GB",
    US: "US", USA: "US", "United States": "US",
    France: "FR", FR: "FR",
    Germany: "DE", DE: "DE",
    Spain: "ES", ES: "ES",
    Italy: "IT", IT: "IT",
    Netherlands: "NL", NL: "NL",
    Ireland: "IE", IE: "IE",
    Canada: "CA", CA: "CA",
    Australia: "AU", AU: "AU",
  };

  const SONGS = [
    { id: "s1", title: "Midnight Drive", artist: "Neon Hours" },
    { id: "s2", title: "Static Love", artist: "Aurora Kid" },
    { id: "s3", title: "Neon Hours", artist: "Neon Hours" },
    { id: "s4", title: "Afterglow", artist: "Violet Static" },
    { id: "s5", title: "Night Cartel", artist: "Night Cartel" },
    { id: "s6", title: "Leather Sky", artist: "Leather Sky" },
  ];

  const ALBUMS = [
    { id: "a1", title: "Neon Hours", artist: "Neon Hours" },
    { id: "a2", title: "Afterglow", artist: "Violet Static" },
    { id: "a3", title: "Static Love", artist: "Aurora Kid" },
    { id: "a4", title: "Midnight Drive", artist: "Night Cartel" },
    { id: "a5", title: "Leather Sky", artist: "Leather Sky" },
  ];

  const PLAYLISTS = [
    { id: "p1", title: "This Week", tag: "Fresh events" },
    { id: "p2", title: "Weekend Vibes", tag: "Fri-Sun" },
    { id: "p3", title: "Friday Night", tag: "House - Techno" },
    { id: "p4", title: "All Time", tag: "Most viewed" },
    { id: "p5", title: "Late Night", tag: "Clubs" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 py-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3">
          <Sidebar />
        </div>
        <div className="col-span-12 lg:col-span-9">
          <main className="min-w-0">
            <header className="mb-8">
              <h1
                className="text-4xl md:text-5xl font-bold uppercase"
                style={{ fontFamily: "var(--font-antonio)" }}
              >
                Discover
              </h1>
              <p className="text-gray-600 mt-2">
                Events, promoters, venues, and artists - all in one place.
              </p>
            </header>

            {trending.length > 0 ? (
              <CardRow title="Trending events" seeAllHref="/search?sort=popular">
                {trending.map((e: { id: string; title: string; start_date: string; hero_image: string | null; ticket_types: unknown; venue_id: string | null }) => (
                  <EventCardSmall key={e.id} event={e} />
                ))}
              </CardRow>
            ) : null}

            {promoters.length > 0 ? (
              <CardRow title="Popular promoters" seeAllHref="/artists?role=promoter">
                {promoters.map((a: { id: string; full_name: string | null; username: string | null; avatar_url: string | null; genre: string | null; city: string | null }) => (
                  <ArtistCard key={a.id} artist={a} />
                ))}
              </CardRow>
            ) : null}

            {venues.length > 0 ? (
              <CardRow title="Popular venues" seeAllHref="/artists?role=venue">
                {venues.map((a: { id: string; full_name: string | null; username: string | null; avatar_url: string | null; genre: string | null; city: string | null }) => (
                  <ArtistCard key={a.id} artist={a} />
                ))}
              </CardRow>
            ) : null}

            {events.length > 0 ? (
              <CardRow title="Upcoming events" seeAllHref="/search">
                {events.slice(0, 12).map((e: { id: string; title: string; start_date: string; hero_image: string | null; ticket_types: unknown; venue_id: string | null }) => (
                  <EventCardSmall key={e.id} event={e} />
                ))}
              </CardRow>
            ) : null}

            {creators.length > 0 ? (
              <CardRow title="Popular artists" seeAllHref="/artists?role=artist">
                {creators.map((a: { id: string; full_name: string | null; username: string | null; avatar_url: string | null; genre: string | null; city: string | null }) => (
                  <ArtistCard key={a.id} artist={a} />
                ))}
              </CardRow>
            ) : null}

            {popularCities.length > 0 ? (
              <CardRow title="Popular by city">
                {popularCities.map(([city, count]) => (
                  <li key={city} className="w-52 shrink-0">
                    <Link
                      href={"/events/" + city.toLowerCase().replace(/\s+/g, "-")}
                      className="block bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="h-32 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
                      <div className="p-4">
                        <p className="font-bold text-base truncate">{city}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {count} event{count === 1 ? "" : "s"}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </CardRow>
            ) : null}

            {trending.length >= 5 ? (
              <CardRow
                title="Featured charts - Top events"
                seeAllHref="/search?sort=popular"
              >
                {trending.slice(0, 5).map((e: { id: string; title: string; views?: number }, i: number) => (
                  <li key={e.id} className="w-56 shrink-0">
                    <Link
                      href={"/event/" + e.id}
                      className="block bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="text-4xl font-bold text-gray-300 leading-none"
                          style={{ fontFamily: "var(--font-antonio)" }}
                        >
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">{e.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {e.views?.toLocaleString() ?? 0} views
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </CardRow>
            ) : null}

            <CardRow title="Popular radio">
              {promoters.slice(0, 6).map((a: { id: string; full_name: string | null; username: string | null }) => {
                const name = a.full_name || a.username || "Artist";
                return (
                  <li key={"radio-" + a.id} className="w-56 shrink-0">
                    <Link
                      href={a.username ? "/artists/" + a.username : "#"}
                      className="group block bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-4xl font-bold text-gray-500 relative">
                        {name.charAt(0).toUpperCase()}
                        <span className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-black text-white shadow-lg flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          &#9654;
                        </span>
                      </div>
                      <div className="p-4">
                        <p className="font-bold text-sm truncate">{name} Radio</p>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          With similar promoters
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </CardRow>

            <CardRow title="Popular albums and singles">
              {ALBUMS.map((a) => (
                <li key={a.id} className="w-44 shrink-0">
                  <div className="group p-3 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 mb-3 flex items-center justify-center text-white shadow-md relative">
                      <span className="text-4xl font-bold opacity-40">
                        {a.title.charAt(0)}
                      </span>
                      <span className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-black text-white shadow-lg flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        &#9654;
                      </span>
                    </div>
                    <p className="font-bold text-sm truncate">{a.title}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {a.artist}
                    </p>
                  </div>
                </li>
              ))}
            </CardRow>

            <CardRow title="Trending songs">
              {SONGS.map((s) => (
                <li key={s.id} className="w-40 shrink-0">
                  <div className="group p-3 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-gray-300 to-gray-400 mb-3 flex items-center justify-center text-3xl font-bold text-white shadow-md relative">
                      &#9834;
                      <span className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-black text-white shadow-lg flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        &#9654;
                      </span>
                    </div>
                    <p className="font-bold text-sm truncate">{s.title}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {s.artist}
                    </p>
                  </div>
                </li>
              ))}
            </CardRow>

            <CardRow title="Featured playlists">
              {PLAYLISTS.map((p) => (
                <li key={p.id} className="w-44 shrink-0">
                  <div className="group p-3 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-black via-gray-800 to-gray-900 mb-3 flex flex-col justify-end p-4 text-white shadow-md relative">
                      <p className="text-lg font-bold leading-tight">{p.title}</p>
                      <p className="text-[10px] uppercase tracking-wider opacity-70 mt-1">
                        {p.tag}
                      </p>
                      <span className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-white text-black shadow-lg flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        &#9654;
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </CardRow>

            {popularCountries.length > 0 ? (
              <CardRow title="Popular by country">
                {popularCountries.map(([country, count]) => (
                  <li key={country} className="w-40 shrink-0">
                    <div className="group p-3 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="aspect-square rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 mb-3 flex items-center justify-center text-6xl shadow-md">
                        {FLAGS[country] ?? "??"}
                      </div>
                      <p className="font-bold text-sm truncate">{country}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {count} event{count === 1 ? "" : "s"}
                      </p>
                    </div>
                  </li>
                ))}
              </CardRow>
            ) : null}

            {artists.length === 0 && events.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
                <p className="text-gray-900 font-medium mb-1">Nothing here yet</p>
                <p className="text-gray-600 text-sm">
                  Promoters, venues, and events will appear once they join.
                </p>
              </div>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}

function EventCardSmall({ event }: { event: any }) {
  const from = priceFrom(event.ticket_types);
  const date = event.start_date
    ? new Date(event.start_date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      })
    : "";

  return (
    <li className="w-52 shrink-0">
      <Link
        href={"/event/" + event.id}
        className="block bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
      >
        {event.hero_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.hero_image}
            alt={event.title}
            className="w-full h-32 object-cover"
          />
        ) : (
          <div className="w-full h-32 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-4xl font-bold text-gray-500">
            {event.title?.charAt(0) || "E"}
          </div>
        )}
        <div className="p-4">
          <p className="font-bold text-sm truncate">{event.title}</p>
          <p className="text-xs text-gray-500 mt-1 truncate">
            {date}
            {from ? " - From \u00A3" + from : ""}
          </p>
        </div>
      </Link>
    </li>
  );
}