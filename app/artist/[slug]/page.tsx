import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import ArtistMusicSection from "@/components/artist/ArtistMusicSection";
import ArtistBookingSection from "@/components/artist/ArtistBookingSection";
import ArtistMessageButton from "@/components/artist/ArtistMessageButton";
import ArtistFollowButton from "@/components/artist/ArtistFollowButton";
import VerifiedBadge from "@/components/artist/VerifiedBadge";
import SimilarArtists from "@/components/artist/SimilarArtists";
import ArtistViewTracker from "@/components/artist/ArtistViewTracker";
import { FileText, Sliders, Utensils, Sparkles, Calendar, MapPin, Music, Users } from "lucide-react";

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

  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = !!(user && artist.owner_id === user.id);

  const { data: similarArtists } = await supabase
    .from("artists")
    .select("slug, name, genre, city, avatar_url, verified")
    .eq("status", "active")
    .neq("slug", slug)
    .or("genre.eq." + artist.genre + ",city.eq." + artist.city)
    .limit(6);

  const { count: followerCount } = await supabase
    .from("artist_follows")
    .select("*", { count: "exact", head: true })
    .eq("artist_slug", slug);

  const viewerFollows = user
    ? !!(await supabase
        .from("artist_follows")
        .select("id")
        .eq("follower_id", user.id)
        .eq("artist_slug", slug)
        .maybeSingle()).data
    : false;

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

  // Available-for flags (default to true if not set)
  const availableFor = [
    { label: "Bookings", ok: artist.available_for_bookings !== false },
    { label: "Collaborations", ok: artist.available_for_collabs !== false },
    { label: "Remixes", ok: artist.available_for_remixes !== false },
    { label: "Festival bookings", ok: artist.available_for_festivals !== false },
    { label: "Brand partnerships", ok: artist.available_for_brands !== false },
  ].filter((i) => i.ok);

  const credits: Array<{ artist: string; role: string }> =
    Array.isArray(artist.credits) ? artist.credits : [];

  return (
    <div className="bg-gray-50 min-h-screen">
      <ArtistViewTracker artistSlug={artist.slug} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* COVER */}
        {artist.cover_image && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={artist.cover_image}
              alt={artist.name + " cover"}
              className="w-full h-64 sm:h-80 object-cover"
            />
          </div>
        )}

        {/* HEADER */}
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
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight inline-flex items-center gap-2">
                {artist.name}
                {artist.verified && <VerifiedBadge size={28} />}
              </h1>
              <p className="text-gray-500 mt-1">@{artist.handle}</p>

              {/* Chips */}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 text-xs font-medium bg-gray-100 border border-gray-200 rounded-full">
                  {artist.genre}
                </span>
                <span className="px-3 py-1 text-xs font-medium bg-gray-100 border border-gray-200 rounded-full">
                  {artist.artist_type}
                </span>
                <span className="px-3 py-1 text-xs font-medium bg-gray-100 border border-gray-200 rounded-full inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {artist.city}
                  {artist.country ? `, ${artist.country}` : ""}
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

              {/* Actions */}
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

                {isOwner && (
                  <>
                    <a
                      href={`/artist/${artist.slug}/analytics`}
                      className="px-5 py-2.5 border border-gray-300 text-sm font-medium rounded-full hover:bg-gray-50 transition"
                    >
                      Analytics
                    </a>
                    <a
                      href={`/artist/${artist.slug}/inbox`}
                      className="px-5 py-2.5 border border-gray-300 text-sm font-medium rounded-full hover:bg-gray-50 transition"
                    >
                      Inbox
                    </a>
                    <a
                      href={`/artist/${artist.slug}/edit`}
                      className="px-5 py-2.5 border border-gray-300 text-sm font-medium rounded-full hover:bg-gray-50 transition"
                    >
                      Edit profile
                    </a>
                  </>
                )}

                {!isOwner && (
                  <ArtistFollowButton
                    artistSlug={artist.slug}
                    initialFollowing={viewerFollows}
                    initialCount={followerCount ?? 0}
                    signedIn={!!user}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-6">
            {/* ABOUT */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-3">About</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {artist.bio}
              </p>
            </section>

            {/* MUSIC */}
            <ArtistMusicSection
              spotifyUrl={artist.spotify}
              artistName={artist.name}
            />

            {/* LIVE / UPCOMING SHOWS */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-lg font-semibold inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Upcoming shows
                </h2>
                {events && events.length > 0 && (
                  <Link
                    href={`/artists/${artist.slug}`}
                    className="text-sm text-gray-500 hover:text-black"
                  >
                    See all
                  </Link>
                )}
              </div>

              {!events || events.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                  <Calendar className="mx-auto h-8 w-8 text-gray-400" />
                  <div className="mt-3 text-sm font-medium text-gray-900">
                    No upcoming shows yet
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Follow {artist.name} to get notified when they announce one.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <Link
                      href="/events"
                      className="rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white hover:bg-gray-900 transition"
                    >
                      Explore similar events
                    </Link>
                    {artist.city && (
                      <Link
                        href={`/${artist.city.toLowerCase().replace(/\s+/g, "-")}`}
                        className="rounded-full border border-gray-300 px-4 py-1.5 text-xs font-medium hover:bg-gray-100 transition"
                      >
                        Events in {artist.city}
                      </Link>
                    )}
                  </div>
                </div>
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

            {/* AVAILABLE FOR — NEW */}
            {availableFor.length > 0 && (
              <section className="bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4 inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-fuchsia-500" />
                  Available for
                </h2>
                <div className="flex flex-wrap gap-2">
                  {availableFor.map((item) => (
                    <span
                      key={item.label}
                      className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700"
                    >
                      {item.label}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* BOOKING */}
            <ArtistBookingSection
              artistSlug={artist.slug}
              artistName={artist.name}
            />

            {/* EPK & RIDERS — NEW */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">EPK & Riders</h2>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`/api/artist/${artist.slug}/epk`}
                  className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition"
                >
                  <FileText className="h-4 w-4" />
                  Download EPK
                </a>
                <a
                  href={`/api/artist/${artist.slug}/technical-rider`}
                  className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition"
                >
                  <Sliders className="h-4 w-4" />
                  Technical Rider
                </a>
                <a
                  href={`/api/artist/${artist.slug}/hospitality-rider`}
                  className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition"
                >
                  <Utensils className="h-4 w-4" />
                  Hospitality Rider
                </a>
              </div>
            </section>

            {/* CREDITS — NEW */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 inline-flex items-center gap-2">
                <Music className="h-4 w-4" />
                Credits
              </h2>
              {credits.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                  <Music className="mx-auto h-8 w-8 text-gray-400" />
                  <div className="mt-3 text-sm font-medium text-gray-900">
                    No credits yet
                  </div>
                  <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
                    Artists with listed credits get more booking requests. Credits can include albums, remixes, production work, or writing.
                  </p>
                  {isOwner && (
                    <Link
                      href={`/artist/${artist.slug}/edit`}
                      className="mt-4 inline-block rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white hover:bg-gray-900 transition"
                    >
                      Add your credits
                    </Link>
                  )}
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {credits.map((c, i) => (
                    <li key={i} className="flex items-center justify-between py-2.5">
                      <span className="text-sm font-medium text-gray-900">
                        {c.artist}
                      </span>
                      <span className="text-xs text-gray-500">{c.role}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* SIMILAR */}
            <SimilarArtists artists={similarArtists || []} />
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            <section className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Location
              </h3>
              <p className="text-sm inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                {artist.city}
                {artist.country ? `, ${artist.country}` : ""}
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
                      <a
                        href={artist.website}
                        className="hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Website
                      </a>
                    </li>
                  )}
                  {artist.spotify && (
                    <li>
                      <a
                        href={artist.spotify}
                        className="hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Spotify
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
                        Instagram
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
                  <dt className="text-gray-500">Joined</dt>
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
