import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import { fetchFeed, fetchEventsForPosts } from "@/lib/posts";
import FeedPost from "@/components/feed/FeedPost";
import FeedTabs from "@/components/feed/FeedTabs";
import LeftSidebar from "@/components/feed/LeftSidebar";
import RightSidebar from "@/components/feed/RightSidebar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "TicketAI",
  description:
    "A social platform for events. Discover, follow, and connect with promoters, venues, artists, and other attendees.",
};

export default async function HomePage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <MarketingLanding />;
  }

  const [profileResult, eventsResult, friendshipsResult, followsResult] = await Promise.all([
    supabase.from("profiles").select("id, username, full_name, role").eq("id", user.id).maybeSingle(),
    supabase
      .from("events")
      .select("id, title, start_date, hero_image")
      .eq("status", "published")
      .gte("start_date", new Date().toISOString())
      .order("start_date", { ascending: true })
      .limit(6),
    supabase
      .from("friendships")
      .select("user_id, friend_id")
      .eq("status", "accepted")
      .or("user_id.eq." + user.id + ",friend_id.eq." + user.id),
    supabase.from("follows").select("target_id").eq("follower_id", user.id),
  ]);

  const profile = profileResult.data;
  const allEvents = eventsResult.data;
  const friendships = friendshipsResult.data;
  const follows = followsResult.data;

  const friendIds = (friendships || []).map((f) =>
    f.user_id === user.id ? f.friend_id : f.user_id
  );

  const suggestedResult = await supabase
    .from("profiles")
    .select("id, username, full_name")
    .neq("id", user.id)
    .limit(5);

  const suggested = suggestedResult.data;

  const posts = await fetchFeed(supabase, { userId: user.id, limit: 30 });
  const eventIds = posts.map((p) => p.event_id).filter((x): x is string => !!x);
  const eventMap = await fetchEventsForPosts(supabase, eventIds);

  const hashtagCounts = new Map<string, number>();
  for (const p of posts) {
    const matches = (p.body || "").match(/#[A-Za-z0-9_]+/g);
    for (const m of matches || []) {
      const tag = m.toLowerCase();
      hashtagCounts.set(tag, (hashtagCounts.get(tag) || 0) + 1);
    }
  }
  const trending = Array.from(hashtagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[260px_1fr_300px] gap-6">
        <div className="hidden lg:block">
          <LeftSidebar
            profile={
              profile
                ? { username: profile.username, full_name: profile.full_name, role: profile.role }
                : null
            }
            stats={{
              events: allEvents?.length ?? 0,
              friends: friendIds.length,
              followers: follows?.length ?? 0,
            }}
            suggested={suggested ?? []}
          />
        </div>

        <main className="space-y-4">
          <FeedTabs />

          {posts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
              <p className="font-medium">The feed is quiet</p>
              <p className="text-sm text-gray-500 mt-1">
                Follow promoters, venues, and artists to see their announcements.
              </p>
              <Link
                href="/search"
                className="inline-block mt-4 px-5 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800"
              >
                Browse events
              </Link>
            </div>
          ) : (
            posts.map((post) => (
              <FeedPost
                key={post.id}
                post={post}
                event={post.event_id ? eventMap.get(post.event_id) ?? null : null}
              />
            ))
          )}
        </main>

        <div className="hidden lg:block">
          <RightSidebar
            trending={trending}
            forYou={allEvents ?? []}
            peopleToFollow={(suggested ?? []).slice(0, 3)}
          />
        </div>
      </div>
    </div>
  );
}

function MarketingLanding() {
  return (
    <div className="min-h-screen">
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Find your next event.
        </h1>
        <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">
          Your city. Your scene. Your people. House, techno, live music, comedy - all in one place.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-8">
          <Link
            href="/login"
            className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800"
          >
            Sign in
          </Link>
          <Link
            href="/search"
            className="px-6 py-3 bg-white border-2 border-black rounded-full font-medium hover:bg-gray-50"
          >
            Browse events
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-6">
          No booking fees - Free for promoters and venues
        </p>
      </section>
    </div>
  );
}
