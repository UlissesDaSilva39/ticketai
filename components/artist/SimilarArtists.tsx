import Link from "next/link";
import VerifiedBadge from "@/components/artist/VerifiedBadge";

type SimilarArtist = {
  slug: string;
  name: string;
  genre: string;
  city: string;
  avatar_url: string | null;
  verified: boolean;
};

export default function SimilarArtists({ artists }: { artists: SimilarArtist[] }) {
  if (!artists || artists.length === 0) return null;

  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-4">Fans Also Like</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
              className="flex flex-col items-center text-center p-3 rounded-xl hover:bg-gray-50 transition"
            >
              {a.avatar_url ? (
                <img
                  src={a.avatar_url}
                  alt={a.name}
                  className="w-16 h-16 rounded-full object-cover border border-gray-200 mb-2"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-black text-white grid place-items-center font-bold text-sm mb-2">
                  {initials}
                </div>
              )}
              <div className="text-sm font-medium truncate max-w-full inline-flex items-center">
                {a.name}
                {a.verified && <VerifiedBadge size={12} />}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {a.genre} · {a.city}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}