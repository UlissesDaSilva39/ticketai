import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar/Sidebar";

export const dynamic = "force-dynamic";

export default async function ConnectionsPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: following } = await supabase
    .from("follows")
    .select("target_id, target_type, created_at")
    .eq("follower_id", user.id)
    .order("created_at", { ascending: false })
    .limit(60);

  const targetIds = [...new Set((following || []).map((f) => f.target_id))];

  const { data: profiles } = targetIds.length
    ? await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, city, genre, role")
        .in("id", targetIds)
    : { data: [] };

  const profileById: Record<string, any> = {};
  for (const p of profiles || []) profileById[p.id] = p;

  const list = following || [];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 py-6 grid grid-cols-12 gap-6">
        <nav aria-label="Your library" className="col-span-12 lg:col-span-3">
          <Sidebar />
        </nav>

        <main className="col-span-12 lg:col-span-9 space-y-6">
          <header>
            <h1 className="text-4xl font-bold uppercase mb-2" style={{ fontFamily: "var(--font-antonio)" }}>
              Connections
            </h1>
            <p className="text-gray-600">
              You are following {list.length} account{list.length === 1 ? "" : "s"}.
            </p>
          </header>

          {list.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
              <p className="text-gray-600 mb-4">You have not followed anyone yet.</p>
              <Link href="/artists" className="text-sm underline hover:text-black">Browse artists</Link>
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {list.map((f, i) => {
                const p = profileById[f.target_id];
                if (!p) return null;
                const name = p.full_name || p.username || "Account";
                const initials = name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
                const href = p.role === "artist" ? "/artists/" + p.username : p.role === "promoter" ? "/promoters/" + p.id : "/artists/" + p.username;
                return (
                  <li key={p.id + "-" + i}>
                    <Link
                      href={href}
                      className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition"
                    >
                      {p.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.avatar_url} alt={name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold shrink-0">{initials}</div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{name}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {p.role ? p.role.charAt(0).toUpperCase() + p.role.slice(1) : "Profile"}
                          {p.city ? " · " + p.city : ""}
                        </p>
                      </div>
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
