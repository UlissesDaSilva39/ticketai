import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  fetchArtistByUsername,
  fetchArtistFollowerCount,
  fetchArtistEvents,
  fetchSimilarArtists,
} from "@/lib/artists";
import CoverBanner from "@/components/artist/CoverBanner";
import ProfileCard from "@/components/artist/ProfileCard";
import TopTracks from "@/components/artist/TopTracks";
import UpcomingShows from "@/components/artist/UpcomingShows";
import FansAlsoLike from "@/components/artist/FansAlsoLike";
import MerchGrid from "@/components/artist/MerchGrid";
import Comments from "@/components/artist/Comments";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createServerSupabase();
  const artist = await fetchArtistByUsername(supabase, username);
  if (!artist) return { title: "Artist not found" };
  const name = artist.full_name || artist.username || "Artist";
  return {
    title: name,
    description:
      artist.bio ??
      [name, artist.genre, artist.city].filter(Boolean).join(" - "),
  };
}

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createServerSupabase();

  const artist = await fetchArtistByUsername(supabase, username);
  if (!artist) return notFound();

  const { data: { user } } = await supabase.auth.getUser();

  const [followers, events, similar] = await Promise.all([
    fetchArtistFollowerCount(supabase, artist.id),
    fetchArtistEvents(supabase, artist.id),
    fetchSimilarArtists(supabase, artist.id),
  ]);

  let isFollowing = false;
  if (user) {
    const { data } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("target_type", "promoter")
      .eq("target_id", artist.id)
      .maybeSingle();
    isFollowing = Boolean(data);
  }

  const isOwner = user?.id === artist.id;
  const currentUserInitials = user
    ? ((user.email || "U").charAt(0).toUpperCase())
    : "U";

  return (
    <div className="min-h-screen bg-gray-50">
      <CoverBanner
        artist={{
          id: artist.id,
          full_name: artist.full_name,
          username: artist.username,
          genre: artist.genre,
          city: artist.city,
          avatar_url: artist.avatar_url,
          cover_image: artist.cover_image,
        }}
        followerCount={followers}
        isFollowing={isFollowing}
        isOwner={isOwner}
      />

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <aside className="space-y-4">
          <ProfileCard
            artist={{
              username: artist.username,
              full_name: artist.full_name,
              avatar_url: artist.avatar_url,
              bio: artist.bio,
              label: artist.label,
              website: artist.website,
              instagram: artist.instagram,
              twitter: artist.twitter,
              spotify: artist.spotify,
              youtube: artist.youtube,
              soundcloud: artist.soundcloud,
            }}
            stats={{
              events: events.length,
              friends: 0,
              followers,
            }}
          />
        </aside>

        <main className="space-y-4 min-w-0">
          <TopTracks />
          <UpcomingShows shows={events} />
          <FansAlsoLike artists={similar} />
          <MerchGrid />
          <Comments
            profileId={artist.id}
            currentUserId={user?.id ?? null}
            currentUserInitials={currentUserInitials}
          />
        </main>
      </div>
    </div>
  );
}