"use client";
import { useState } from "react";
import Link from "next/link";
import { getArtist } from "@/lib/data/artists";
import TrackRecentlyViewed from "@/components/TrackRecentlyViewed";
import SimilarArtistsRail from "@/components/SimilarArtistsRail";
import BookArtistModal from "@/components/BookArtistModal";
import MusicPlayer from "@/components/MusicPlayer";
import AvailabilityBadge from "@/components/AvailabilityBadge";
import { useRevenue } from "@/lib/hooks/useRevenue";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ArtistPage({ params }: PageProps) {
  const { recordBooking } = useRevenue();
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookingArtist, setBookingArtist] = useState<any>(null);
  const { id } = await params;
  const artist = getArtist(id);

  if (!artist) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-950 p-6">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-8 max-w-md text-center shadow-sm">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Artist not found
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            This profile does not exist yet.
          </p>
          <Link
            href="/network"
            className="inline-block px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
          >
            Back to artists
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-6">
      <TrackRecentlyViewed
        type="artist"
        id={artist.id}
        name={artist.name}
        color={artist.color}
        href={`/artist/${artist.id}`}
      />

      <div className="max-w-3xl mx-auto">
        <Link
          href="/network"
          className="text-xs font-semibold text-gray-500 hover:text-emerald-600 transition-colors mb-6 inline-block"
        >
          ← Back to network
        </Link>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
          <div className="flex items-start gap-5">
            <div
              className={`w-24 h-24 rounded-full ${artist.color} text-white flex items-center justify-center font-bold text-4xl flex-shrink-0`}
            >
              {artist.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                {artist.name}
              </h1>
              <p className="text-sm text-gray-500">
                {artist.role} · {artist.location}
              </p>
              <p className="text-sm text-emerald-600 font-semibold mt-1">
                {artist.followers.toLocaleString()} followers
              </p>
              <div className="flex gap-2 mt-3 flex-wrap">
                {artist.genres.map((g) => (
                  <span
                    key={g}
                    className="text-[11px] font-semibold px-2 py-1 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-700 dark:text-zinc-300 mt-6 leading-relaxed">
            {artist.bio}
          </p>

          <div className="flex gap-3 mt-6">
            <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors">
              Follow
            </button>
            <button className="px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 text-sm font-semibold text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
              Message

            {/* Book CTA — added by wire-artist-booking.ps1 */}
            <button
              onClick={() => {
                setBookingArtist({
                  id: String(artist.id),
                  name: artist.name,
                  ratePence: 40000,
                  role: artist.role,
                });
                setShowBookModal(true);
              }}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold transition-colors"
            >
              Book {artist.name} — £400/session →
            </button>
            </button>
          </div>
        </div>

        <SimilarArtistsRail currentId={artist.id} />


        <div className="mt-4 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">
            Recent activity
          </h2>
          <p className="text-sm text-gray-500">
            No recent activity to show yet.
          </p>
        </div>

        <div className="mt-4 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Try these other dummy artists:{" "}
            <Link href="/artist/1" className="text-emerald-600 font-semibold hover:underline">/artist/1</Link>{" "}
            <Link href="/artist/2" className="text-emerald-600 font-semibold hover:underline">/artist/2</Link>{" "}
            <Link href="/artist/3" className="text-emerald-600 font-semibold hover:underline">/artist/3</Link>{" "}
            <Link href="/artist/4" className="text-emerald-600 font-semibold hover:underline">/artist/4</Link>
          </p>
        </div>
      </div>
    </div>
  );
}