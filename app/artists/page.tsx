import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Artists",
  description: "Discover promoters, venues, and artists on TicketAI.",
};

export default async function ArtistsIndexPage() {
  const supabase = await createServerSupabase();

  const { data: artists } = await supabase
    .from("profiles")
    .select("id, username, full_name, avatar_url, city, genre, role")
    .in("role", ["promoter", "venue", "artist"])
    .not("username", "is", null)
    .order("created_at", { ascending: false })
    .limit(60);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1
        className="text-5xl font-bold uppercase mb-2"
        style={{ fontFamily: "var(--font-antonio)" }}
      >
        Artists
      </h1>
      <p className="text-gray-600 mb-8">
        Discover promoters, venues, and artists on TicketAI.
      </p>

      {(!artists || artists.length === 0) ? (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-12 text-center">
          <p className="text-gray-900 font-medium mb-1">No artists yet</p>
          <p className="text-gray-600 text-sm">
            Promoters and venues will appear here once they join.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {artists.map((a) => {
            const name = a.full_name || a.username || "Artist";
            const initials = name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();
            const subtitle = [a.genre, a.city].filter(Boolean).join(" · ");
            return (
              <li key={a.id}>
                <Link
                  href={"/artists/" + a.username}
                  className="block bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow group"
                >
                  <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center font-bold text-2xl mx-auto overflow-hidden">
                    {a.avatar_url ? (
                      <img
                        src={a.avatar_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <p className="text-center font-semibold mt-3 truncate group-hover:underline">
                    {name}
                  </p>
                  {a.username ? (
                    <p className="text-center text-xs text-gray-500 truncate">
                      @{a.username}
                    </p>
                  ) : null}
                  {subtitle ? (
                    <p className="text-center text-xs text-gray-400 mt-1 truncate">
                      {subtitle}
                    </p>
                  ) : null}
                  {a.role ? (
                    <p className="text-center text-[10px] uppercase tracking-wide text-gray-400 mt-2">
                      {a.role}
                    </p>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}