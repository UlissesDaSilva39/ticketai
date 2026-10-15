import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import PersonCard, { type PersonCardData } from "@/components/people/PersonCard";
import RoleTabs from "@/components/people/RoleTabs";
import PeopleSearch from "@/components/people/PeopleSearch";

export const metadata: Metadata = {
  title: "People",
  description: "Find artists, promoters, venues, labels, and A&R scouts on GRID.",
};

export const dynamic = "force-dynamic";

type Params = {
  role?: string;
  q?: string;
  sort?: string;
};

export default async function PeoplePage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const params = await searchParams;
  const roleFilter = params.role || "all";
  const q = params.q || "";
  const sort = params.sort || "active";

  const supabase = await createServerSupabase();

  const { data: { user } } = await supabase.auth.getUser();

  // Distinct roles with counts
  const { data: roleRows } = await supabase
    .from("profiles")
    .select("role");

  const roleCounts = new Map<string, number>();
  let total = 0;
  for (const r of roleRows ?? []) {
    const role = (r as { role?: string }).role || "user";
    roleCounts.set(role, (roleCounts.get(role) ?? 0) + 1);
    total += 1;
  }

  const roleOrder = ["attendee", "a_and_r", "record_company", "artist", "promoter", "venue"];
  const tabs = [
    { slug: "all", label: "All", count: total },
    ...roleOrder
      .filter((r) => roleCounts.has(r))
      .map((r) => ({ slug: r, label: r, count: roleCounts.get(r) ?? 0 })),
  ];

  // Build people query
  let query = supabase
    .from("profiles")
    .select("id, full_name, username, avatar_url, city, genre, bio, role, label, is_public, created_at")
    .eq("is_public", true)
    .not("username", "is", null);

  if (roleFilter !== "all") query = query.eq("role", roleFilter);

  if (q) {
    const like = "%" + q.replace(/[%_]/g, "") + "%";
    query = query.or(
      "full_name.ilike." + like + ",username.ilike." + like + ",city.ilike." + like + ",genre.ilike." + like
    );
  }

  if (sort === "new") {
    query = query.order("created_at", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  query = query.limit(200);

  const { data: people } = await query;

  const ids = (people ?? []).map((p) => p.id);

  // Follower counts for all listed users in one query
  const followerCounts = new Map<string, number>();
  if (ids.length > 0) {
    const { data: followRows } = await supabase
      .from("follows")
      .select("target_id")
      .eq("target_type", "user")
      .in("target_id", ids);
    for (const r of followRows ?? []) {
      const tid = (r as { target_id: string }).target_id;
      followerCounts.set(tid, (followerCounts.get(tid) ?? 0) + 1);
    }
  }

  // Which of these does the current user follow?
  const followingSet = new Set<string>();
  if (user && ids.length > 0) {
    const { data: myFollows } = await supabase
      .from("follows")
      .select("target_id")
      .eq("follower_id", user.id)
      .eq("target_type", "user")
      .in("target_id", ids);
    for (const r of myFollows ?? []) {
      followingSet.add((r as { target_id: string }).target_id);
    }
  }

  const cards: PersonCardData[] = (people ?? []).map((p) => ({
    id: p.id,
    full_name: p.full_name,
    username: p.username,
    avatar_url: p.avatar_url,
    city: p.city,
    genre: p.genre,
    bio: p.bio,
    role: p.role || "user",
    label: p.label,
    followerCount: followerCounts.get(p.id) ?? 0,
    initialFollowing: followingSet.has(p.id),
    signedIn: Boolean(user),
  }));

  // Sort by follower count when requested (client-side, small list)
  if (sort === "followers") {
    cards.sort((a, b) => b.followerCount - a.followerCount);
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">People</h1>
          <p className="mt-1 text-gray-500">
            Find artists, promoters, venues, labels, and A&amp;R scouts on GRID.
          </p>
        </div>

        {/* Search */}
        <div className="mb-5">
          <PeopleSearch initial={q} />
        </div>

        {/* Role tabs */}
        <div className="mb-6">
          <RoleTabs tabs={tabs} activeRole={roleFilter} query={{ q, sort }} />
        </div>

        {/* Sort bar */}
        <div className="mb-6 flex flex-wrap gap-2 text-xs">
          {[
            { key: "active", label: "Newest" },
            { key: "followers", label: "Most followers" },
            { key: "new", label: "Recently joined" },
          ].map((s) => {
            const isActive = sort === s.key;
            const params2 = new URLSearchParams();
            if (roleFilter !== "all") params2.set("role", roleFilter);
            if (q) params2.set("q", q);
            if (s.key !== "active") params2.set("sort", s.key);
            const href = "/people" + (params2.toString() ? "?" + params2.toString() : "");
            return (
              <a
                key={s.key}
                href={href}
                className={
                  "inline-flex items-center gap-1 rounded-full px-3 py-1.5 font-medium transition " +
                  (isActive
                    ? "bg-black text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-black")
                }
              >
                {s.label}
              </a>
            );
          })}
        </div>

        {/* Results */}
        <div className="mb-3 text-xs text-gray-500">
          {cards.length} {cards.length === 1 ? "person" : "people"} found
        </div>

        {cards.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-sm font-medium text-gray-900">No one matches</p>
            <p className="mt-1 text-xs text-gray-500">
              Try a different search, role tab, or clear the filters.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {cards.map((c) => (
              <PersonCard key={c.id} person={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}