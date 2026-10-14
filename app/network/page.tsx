import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar/Sidebar";
import PersonCard from "@/components/network/PersonCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Network",
  description: "Connect with the people building music on GRID.",
};

type SearchParams = Promise<{ q?: string; role?: string }>;

type PersonRow = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  genre: string | null;
  city: string | null;
  role: string | null;
};

const ROLES = [
  { value: "", label: "Everyone" },
  { value: "artist", label: "Artists" },
  { value: "dj", label: "DJs" },
  { value: "producer", label: "Producers" },
  { value: "band", label: "Bands" },
  { value: "manager", label: "Managers" },
  { value: "promoter", label: "Promoters" },
  { value: "venue", label: "Venues" },
  { value: "a_and_r", label: "A&R" },
];

export default async function NetworkPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  let q = "";
  let role = "";
  try {
    const params = await searchParams;
    q = (params.q || "").trim();
    role = (params.role || "").trim();
  } catch (e) {
    console.error("[network] searchParams parse error:", e);
  }

  const supabase = await createServerSupabase();

  let userId: string | null = null;
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch (e) {
    console.error("[network] auth.getUser error:", e);
  }

  if (!userId) {
    return (
      <div className="bg-gray-50 min-h-screen pb-32">
        <div className="mx-auto max-w-[1400px] px-6 py-6 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-3">
            <Sidebar />
          </div>
          <main className="col-span-12 lg:col-span-9 min-w-0">
            <h1
              className="text-4xl md:text-5xl font-bold uppercase mb-6"
              style={{ fontFamily: "var(--font-antonio)" }}
            >
              Network
            </h1>
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
              <p className="text-gray-900 font-medium mb-3">
                Log in to see the network
              </p>
              <a
                href="/login?next=/network"
                className="inline-block rounded-full bg-black text-white text-sm font-semibold px-6 py-2 hover:bg-gray-800"
              >
                Log in
              </a>
            </div>
          </main>
        </div>
      </div>
    );
  }

  let people: PersonRow[] = [];
  let queryError: string | null = null;

  try {
    const selectCols =
      "id, username, full_name, avatar_url, bio, genre, city, role";

    let base = supabase
      .from("profiles")
      .select(selectCols)
      .not("username", "is", null)
      .neq("id", userId);

    if (role) {
      base = base.eq("role", role);
    }

    if (q) {
      const term = "%" + q + "%";
      base = base.or(
        "full_name.ilike." +
          term +
          ",username.ilike." +
          term +
          ",genre.ilike." +
          term
      );
    }

    const { data, error } = await base.limit(60);

    if (error) {
      queryError = error.message;
      console.error("[network] profiles query error:", error);
    } else {
      people = (data as PersonRow[]) || [];
    }
  } catch (e) {
    queryError = e instanceof Error ? e.message : "Unknown error";
    console.error("[network] unexpected query error:", e);
  }

  const ids = people.map((p) => p.id);
  let followingSet = new Set<string>();
  if (ids.length > 0) {
    try {
      const { data: followRows } = await supabase
        .from("follows")
        .select("target_id")
        .eq("follower_id", userId)
        .in("target_id", ids);
      followingSet = new Set(
        (followRows || []).map((r) => (r as { target_id: string }).target_id)
      );
    } catch (e) {
      console.error("[network] follows lookup error:", e);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      <div className="mx-auto max-w-[1400px] px-6 py-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3">
          <Sidebar />
        </div>

        <main className="col-span-12 lg:col-span-9 min-w-0">
          <header className="mb-6">
            <h1
              className="text-4xl md:text-5xl font-bold uppercase"
              style={{ fontFamily: "var(--font-antonio)" }}
            >
              Network
            </h1>
            <p className="text-gray-600 mt-2">
              Connect with the people building music.
            </p>
          </header>

          <form
            action="/network"
            method="get"
            className="mb-6 bg-white border border-gray-200 rounded-2xl p-3 flex items-center gap-2"
          >
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search artists, DJs, producers, managers, promoters..."
              className="flex-1 bg-transparent outline-none px-3 py-2 text-sm"
            />
            {role ? <input type="hidden" name="role" value={role} /> : null}
            <button
              type="submit"
              className="rounded-full bg-black text-white text-sm font-medium px-5 py-2 hover:bg-gray-800"
            >
              Search
            </button>
          </form>

          <nav className="mb-6 flex flex-wrap gap-2">
            {ROLES.map((r) => {
              const isActive = r.value === role;
              const sp = new URLSearchParams();
              if (r.value) sp.set("role", r.value);
              if (q) sp.set("q", q);
              const href =
                "/network" + (sp.toString() ? "?" + sp.toString() : "");
              return (
                <a
                  key={r.value}
                  href={href}
                  className={
                    "text-xs font-medium rounded-full px-3 py-1.5 border transition-colors " +
                    (isActive
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-400")
                  }
                >
                  {r.label}
                </a>
              );
            })}
          </nav>

          {queryError ? (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <p className="font-semibold mb-1">Query error</p>
              <p className="text-xs break-all">{queryError}</p>
            </div>
          ) : null}

          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">
            {(q || role ? "Results" : "People you may know") +
              " (" +
              people.length +
              ")"}
          </h2>

          {people.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
              <p className="text-gray-900 font-medium mb-1">
                No one to show yet
              </p>
              <p className="text-gray-600 text-sm">
                {q || role
                  ? "Try a different search or filter."
                  : "Once more people join, they will appear here."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {people.map((p) => (
                <PersonCard
                  key={p.id}
                  person={p}
                  initiallyFollowing={followingSet.has(p.id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
