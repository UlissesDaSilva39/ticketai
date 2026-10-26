import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Promoter = {
  promoter_id: string;
  user_id: string | null;
  display_name: string | null;
  bio: string | null;
  city: string | null;
};

type Venue = {
  venue_id: string;
  name: string;
  slug: string | null;
  city: string | null;
};

type EventRow = {
  id: string;
  title: string;
  start_date: string | null;
  hero_image: string | null;
  organizer_id: string;
};

function formatDate(v: string | null) {
  if (!v) return "TBC";
  return new Date(v).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

export default async function FollowingPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: followRows } = await supabase
    .from("follows")
    .select("target_type, target_id")
    .eq("follower_id", user.id);

  const promoterIds = (followRows || []).filter((r) => r.target_type === "promoter").map((r) => r.target_id);
  const venueIds = (followRows || []).filter((r) => r.target_type === "venue").map((r) => r.target_id);

  // Fetch promoters
  let promoters: Promoter[] = [];
  if (promoterIds.length > 0) {
    const { data } = await supabase
      .from("promoters")
      .select("id, user_id, display_name, bio, city")
      .in("id", promoterIds);
    promoters = (data || []).map((p) => ({
      promoter_id: p.id,
      user_id: p.user_id,
      display_name: p.display_name,
      bio: p.bio,
      city: p.city,
    }));
  }

  // Fetch venues
  let venues: Venue[] = [];
  if (venueIds.length > 0) {
    const { data } = await supabase
      .from("venues")
      .select("id, name, slug, city")
      .in("id", venueIds);
    venues = (data || []).map((v) => ({
      venue_id: v.id,
      name: v.name,
      slug: v.slug,
      city: v.city,
    }));
  }

  // For each promoter, fetch their 3 most recent upcoming events
  const promoterUserIds = promoters.map((p) => p.user_id).filter(Boolean) as string[];
  const eventsByOrganizer: Record<string, EventRow[]> = {};
  if (promoterUserIds.length > 0) {
    const { data: evs } = await supabase
      .from("events")
      .select("id, title, start_date, hero_image, organizer_id")
      .in("organizer_id", promoterUserIds)
      .eq("status", "published")
      .gte("start_date", new Date().toISOString())
      .order("start_date", { ascending: true })
      .limit(60);

    for (const e of evs || []) {
      if (!eventsByOrganizer[e.organizer_id]) eventsByOrganizer[e.organizer_id] = [];
      if (eventsByOrganizer[e.organizer_id].length < 3) {
        eventsByOrganizer[e.organizer_id].push(e as EventRow);
      }
    }
  }

  const total = promoters.length + venues.length;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1
        className="text-5xl font-bold uppercase mb-8"
        style={{ fontFamily: "var(--font-antonio)" }}
      >
        Following
      </h1>

      {total === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-12 text-center">
          <p className="text-gray-600 mb-4">You aren&apos;t following anyone yet.</p>
          <Link
            href="/promoters"
            className="inline-block px-6 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800"
          >
            Browse promoters
          </Link>
        </div>
      ) : (
        <>
          {promoters.length > 0 && (
            <section className="mb-12">
              <h2
                className="text-2xl font-bold mb-4 uppercase"
                style={{ fontFamily: "var(--font-antonio)" }}
              >
                Promoters
              </h2>
              <ul className="space-y-6">
                {promoters.map((p) => {
                  const evs = p.user_id ? eventsByOrganizer[p.user_id] || [] : [];
                  const name = p.display_name || "Promoter";
                  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
                  return (
                    <li key={p.promoter_id} className="rounded-2xl border border-gray-200 p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold flex-shrink-0">
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{name}</p>
                          {p.city && <p className="text-sm text-gray-500">{p.city}</p>}
                          {p.bio && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.bio}</p>}
                        </div>
                        {p.user_id && (
                          <Link
                            href={"/organizers/" + p.user_id}
                            className="text-sm font-medium hover:underline"
                          >
                            View profile
                          </Link>
                        )}
                      </div>
                      {evs.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Upcoming events</p>
                          <ul className="space-y-1">
                            {evs.map((e) => (
                              <li key={e.id}>
                                <Link href={"/event/" + e.id} className="text-sm hover:underline">
                                  <span className="text-gray-500">{formatDate(e.start_date)}</span> · {e.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {venues.length > 0 && (
            <section className="mb-12">
              <h2
                className="text-2xl font-bold mb-4 uppercase"
                style={{ fontFamily: "var(--font-antonio)" }}
              >
                Venues
              </h2>
              <ul className="space-y-3">
                {venues.map((v) => (
                  <li key={v.venue_id} className="rounded-2xl border border-gray-200 p-5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium">{v.name}</p>
                      {v.city && <p className="text-sm text-gray-500">{v.city}</p>}
                    </div>
                    {v.slug && (
                      <Link href={"/venue/" + v.slug} className="text-sm font-medium hover:underline flex-shrink-0">
                        View venue
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}