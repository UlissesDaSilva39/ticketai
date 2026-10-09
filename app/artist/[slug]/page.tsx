import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import ArtistMusicSection from "@/components/artist/ArtistMusicSection";
import ArtistBookingSection from "@/components/artist/ArtistBookingSection";
import ArtistMessageButton from "@/components/artist/ArtistMessageButton";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("artists")
    .select("name, bio")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (!data) return { title: "Artist not found" };

  return {
    title: data.name,
    description: data.bio?.slice(0, 160) ?? undefined,
    openGraph: {
      title: data.name,
      description: data.bio?.slice(0, 160) ?? undefined,
      type: "profile",
    },
  };
}

export const dynamic = "force-dynamic";

export default async function ArtistPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createServerSupabase();

  const { data: artist } = await supabase
    .from("artists")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (!artist) notFound();

  const { data: events } = await supabase
    .from("events")
    .select("id, title, start_date, city")
    .eq("status", "published")
    .gte("start_date", new Date().toISOString())
    .order("start_date", { ascending: true })
    .limit(5);

  const initials = (artist.name || "?")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const secondaryGenres: string[] = artist.secondary_genres || [];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {artist.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={artist.avatar_url}
                alt={artist.name}
                className="w-24 h-24 rounded-full object-cover border border-gray-200 flex-shrink-0"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-black text-white grid place-items-center text-2xl font-bold flex-shrink-0">
                {initials}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h1
                className="text-3xl sm:text-4xl font-bold tracking-tight"
                style={{ fontFamily: "var(--font-antonio)" }}
              >
                {artist.name}
              </h1>
              <p className="text-gray-500 mt-1">@{artist.handle}</p>

              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 text-xs font-medium bg-gray-100 border border-gray-200 rounded-full">
                  {artist.genre}
                </span>
                <span className="px-3 py-1 text-xs font-medium bg-gray-100 border border-gray-200 rounded-full">
                  {artist.artist_type}
                </span>
                <span className="px-3 py-1 text-xs font-medium bg-gray-100 border border-gray-200 rounded-full">
                  {artist.city}, {artist.country}
                </span>
                {secondaryGenres.slice(0, 4).map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 text-xs font-medium bg-gray-50 border border-gray-200 rounded-full text-gray-600"
                  >
                    {g}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {artist.spotify ? (
                  <a
                    href={artist.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition"
                  >
                    Listen
                  </a>
                ) : (
                  <span className="px-5 py-2.5 bg-gray-100 text-gray-400 text-sm font-medium rounded-full cursor-not-allowed">
                    Listen
                  </span>
                )}

                {artist.instagram ? (
                  <a
                    href={`https://instagram.com/${artist.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 border border-gray-300 text-sm font-medium rounded-full hover:bg-gray-50 transition"
                  >
                    Instagram
                  </a>
                ) : (
                  <span className="px-5 py-2.5 border border-gray-200 text-gray-400 text-sm font-medium rounded-full cursor-not-allowed">
                    Instagram
                  </span>
                )}

                {artist.website && (
                  <a
                    href={artist.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 border border-gray-300 text-sm font-medium rounded-full hover:bg-gray-50 transition"
                  >
                    Website
                  </a>
                )}

                <button
                  type="button"
                  className="px-5 py-2.5 border border-black text-sm font-medium rounded-full hover:bg-black hover:text-white transition"
                >
                  + Follow
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-6">
            <section className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-3">About</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {artist.bio}
              </p>
            </section>

            <ArtistMusicSection
              spotifyUrl={artist.spotify}
              artistName={artist.name}
            />

            <section className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-lg font-semibold">Upcoming shows</h2>
                <Link
                  href={`/search?artist=${artist.slug}`}
                  className="text-sm text-gray-500 hover:text-black"
                >
                  See all
                </Link>
              </div>

              {!events || events.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No upcoming shows yet. Follow {artist.name} to get notified.
                </p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {events.map((ev) => (
                    <li key={ev.id} className="py-3 flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/events/${ev.id}`}
                          className="font-medium text-sm hover:underline"
                        >
                          {ev.title}
                        </Link>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(ev.start_date).toLocaleDateString("en-GB", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })}
                          {ev.city ? ` · ${ev.city}` : ""}
                        </p>
                      </div>
                      <Link
                        href={`/events/${ev.id}`}
                        className="px-4 py-2 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 transition"
                      >
                        Tickets
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <ArtistBookingSection
              artistSlug={artist.slug}
              artistName={artist.name}
            />
          </div>

          <aside className="space-y-6">
            <section className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Location
              </h3>
              <p className="text-sm">
                {artist.city}, {artist.country}
                {artist.postcode ? ` · ${artist.postcode}` : ""}
              </p>
            </section>

            {(artist.website || artist.spotify || artist.instagram) && (
              <section className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Links
                </h3>
                <ul className="space-y-2 text-sm">
                  {artist.website && (
                    <li>
                      <a href={artist.website} className="hover:underline" target="_blank" rel="noopener noreferrer">
                        Website ↗
                      </a>
                    </li>
                  )}
                  {artist.spotify && (
                    <li>
                      <a href={artist.spotify} className="hover:underline" target="_blank" rel="noopener noreferrer">
                        Spotify ↗
                      </a>
                    </li>
                  )}
                  {artist.instagram && (
                    <li>
                      <a
                        href={`https://instagram.com/${artist.instagram.replace("@", "")}`}
                        className="hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Instagram ↗
                      </a>
                    </li>
                  )}
                </ul>
              </section>
            )}

            <ArtistMessageButton
              artistSlug={artist.slug}
              artistName={artist.name}
            />

            <section className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Details
              </h3>
              <dl className="text-sm space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Genre</dt>
                  <dd>{artist.genre}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Type</dt>
                  <dd>{artist.artist_type}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Since</dt>
                  <dd>
                    {new Date(artist.created_at).toLocaleDateString("en-GB", {
                      month: "short",
                      year: "numeric",
                    })}
                  </dd>
                </div>
              </dl>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
