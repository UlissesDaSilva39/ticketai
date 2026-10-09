import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";

type Props = { params: Promise<{ genre: string }> };

const KNOWN_GENRES = [
  "House",
  "Techno",
  "Jazz",
  "Folk",
  "Rock",
  "Hip-Hop",
  "Pop",
  "Classical",
  "Other",
];

function slugToGenre(slug: string): string | null {
  const match = KNOWN_GENRES.find(
    (g) => g.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug.toLowerCase()
  );
  return match ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { genre } = await params;
  const label = slugToGenre(genre);
  if (!label) return { title: "Genre not found" };
  return {
    title: label + " artists",
    description: "Discover " + label + " artists on TicketAI.",
  };
}

export const dynamic = "force-dynamic";

export default async function GenrePage({ params }: Props) {
  const { genre: slug } = await params;
  const genre = slugToGenre(slug);
  if (!genre) notFound();

  const supabase = await createServerSupabase();
  const { data: artists } = await supabase
    .from("artists")
    .select("slug, name, handle, genre, artist_type, city, country, avatar_url")
    .eq("status", "active")
    .eq("genre", genre)
    .order("name", { ascending: true });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-3">
            Genre
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-tight mb-3"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            {genre}
          </h1>
          <p className="text-gray-600">
            {artists?.length ?? 0} {(artists?.length ?? 0) === 1 ? "artist" : "artists"}
          </p>
        </div>

        {!artists || artists.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <p className="font-medium">No {genre} artists yet</p>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              Be the first to register in this genre.
            </p>
            <Link
              href="/artist/register"
              className="inline-block px-5 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800"
            >
              Register as artist
            </Link>
          </div>
        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {artists.map((a) => {
              const initials = (a.name || "?")
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
              return (
                <Link
                  key={a.slug}
                  href={"/artist/" + a.slug}
                  className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-black transition flex items-start gap-4"
                >

                  {a.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.avatar_url}
                      alt={a.name}
                      className="w-16 h-16 rounded-full object-cover border border-gray-200 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-black text-white grid place-items-center text-lg font-bold flex-shrink-0">
                      {initials}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{a.name}</div>
                    <div className="text-xs text-gray-500 truncate">@{a.handle}</div>
                    <div className="text-xs text-gray-500 mt-2">
                      {a.artist_type}{a.city ? " · " + a.city : ""}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
