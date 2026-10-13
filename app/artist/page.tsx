import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar/Sidebar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Artists",
  description: "Browse artists on GRID.",
};

export default async function ArtistIndexPage() {
  const supabase = await createServerSupabase();

  const { data: artists } = await supabase
    .from("profiles")
    .select("id, username, full_name, avatar_url, genre, city, role")
    .eq("role", "artist")
    .not("username", "is", null)
    .order("full_name", { ascending: true })
    .limit(60);

  const list = artists || [];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 py-6 grid grid-cols-12 gap-6">
        <nav aria-label="Your library" className="col-span-12 lg:col-span-3">
          <Sidebar />
        </nav>

        <main className="col-span-12 lg:col-span-9 space-y-6">
          <header>
            <h1 className="text-4xl font-bold uppercase mb-2" style={{ fontFamily: "var(--font-antonio)" }}>
              Artists
            </h1>
            <p className="text-gray-600">
              Browse {list.length} artists on GRID.
            </p>
          </header>

          {list.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
              <p className="text-gray-600">No artists yet.</p>
            </div>
          ) : (
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {list.map((a) => {
                const name = a.full_name || a.username || "Artist";
                const initials = name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
                return (
                  <li key={a.id}>
                    <Link
                      href={"/artists/" + a.username}
                      className="block bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition"
                    >
                      {a.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={a.avatar_url}
                          alt={name}
                          className="w-16 h-16 rounded-full object-cover mx-auto"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 mx-auto">
                          {initials}
                        </div>
                      )}
                      <p className="text-sm font-bold text-center mt-3 truncate">{name}</p>
                      {a.genre ? (
                        <p className="text-xs text-gray-500 text-center mt-0.5 truncate">{a.genre}</p>
                      ) : null}
                      {a.city ? (
                        <p className="text-xs text-gray-400 text-center truncate">{a.city}</p>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
}
