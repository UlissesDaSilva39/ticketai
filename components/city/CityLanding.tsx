import Link from "next/link";
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
