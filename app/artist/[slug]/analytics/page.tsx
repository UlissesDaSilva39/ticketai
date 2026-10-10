import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import ShareAnalyticsButton from "@/components/artist/ShareAnalyticsButton";
import SharedLinksPanel from "@/components/artist/SharedLinksPanel";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "Artist analytics" };
export const dynamic = "force-dynamic";

export default async function AnalyticsPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/artist/" + slug + "/analytics");

  const { data: artist } = await supabase
    .from("artists")
    .select("owner_id, name, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (!artist) notFound();
  if (artist.owner_id !== user.id) notFound();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [viewsRes, followsRes, bookingsRes, messagesRes, recentViewsRes] = await Promise.all([
    supabase.from("artist_views").select("*", { count: "exact", head: true }).eq("artist_slug", slug),
    supabase.from("artist_follows").select("*", { count: "exact", head: true }).eq("artist_slug", slug),
    supabase.from("booking_requests").select("*", { count: "exact", head: true }).eq("artist_slug", slug),
    supabase.from("artist_messages").select("*", { count: "exact", head: true }).eq("artist_slug", slug),
    supabase.from("artist_views").select("created_at").eq("artist_slug", slug).gte("created_at", thirtyDaysAgo.toISOString()).order("created_at", { ascending: true }),
  ]);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenIso = sevenDaysAgo.toISOString();

  const [views7dRes, follows7dRes, bookings7dRes, messages7dRes] = await Promise.all([
    supabase.from("artist_views").select("*", { count: "exact", head: true }).eq("artist_slug", slug).gte("created_at", sevenIso),
    supabase.from("artist_follows").select("*", { count: "exact", head: true }).eq("artist_slug", slug).gte("created_at", sevenIso),
    supabase.from("booking_requests").select("*", { count: "exact", head: true }).eq("artist_slug", slug).gte("created_at", sevenIso),
    supabase.from("artist_messages").select("*", { count: "exact", head: true }).eq("artist_slug", slug).gte("created_at", sevenIso),
  ]);

  const totalViews = viewsRes.count ?? 0;
  const totalFollows = followsRes.count ?? 0;
  const totalBookings = bookingsRes.count ?? 0;
  const totalMessages = messagesRes.count ?? 0;

  const views7d = views7dRes.count ?? 0;
  const follows7d = follows7dRes.count ?? 0;
  const bookings7d = bookings7dRes.count ?? 0;
  const messages7d = messages7dRes.count ?? 0;

  const dailyViews = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dailyViews.set(d.toISOString().slice(0, 10), 0);
  }
  for (const row of recentViewsRes.data ?? []) {
    const day = String(row.created_at).slice(0, 10);
    if (dailyViews.has(day)) dailyViews.set(day, (dailyViews.get(day) || 0) + 1);
  }

  const chartData = Array.from(dailyViews.entries()).map(([date, count]) => ({
    date: date.slice(5),
    views: count,
  }));

  const maxViews = Math.max(1, ...chartData.map((d) => d.views));

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-3">
              Artist dashboard
            </p>
            <h1
              className="text-4xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-antonio)" }}
            >
              Analytics
            </h1>
            <p className="text-gray-600 mt-2">{artist.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <ShareAnalyticsButton artistSlug={slug} />
          <Link
            href={"/artist/" + slug}
            className="text-sm text-gray-500 hover:text-black whitespace-nowrap"
          >
            View profile â†’
          </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Views</p>
            <p className="text-3xl font-bold mt-1">{totalViews.toLocaleString()}</p>
            <p className={"text-xs mt-2 " + (views7d > 0 ? "text-green-600" : "text-gray-400")}>
              {views7d > 0 ? "↑ +" + views7d + " esta semana" : "→ 0 esta semana"}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Followers</p>
            <p className="text-3xl font-bold mt-1">{totalFollows.toLocaleString()}</p>
            <p className={"text-xs mt-2 " + (follows7d > 0 ? "text-green-600" : "text-gray-400")}>
              {follows7d > 0 ? "↑ +" + follows7d + " esta semana" : "→ 0 esta semana"}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</p>
            <p className="text-3xl font-bold mt-1">{totalBookings.toLocaleString()}</p>
            <p className={"text-xs mt-2 " + (bookings7d > 0 ? "text-green-600" : "text-gray-400")}>
              {bookings7d > 0 ? "↑ +" + bookings7d + " esta semana" : "→ 0 esta semana"}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Messages</p>
            <p className="text-3xl font-bold mt-1">{totalMessages.toLocaleString()}</p>
            <p className={"text-xs mt-2 " + (messages7d > 0 ? "text-green-600" : "text-gray-400")}>
              {messages7d > 0 ? "↑ +" + messages7d + " esta semana" : "→ 0 esta semana"}
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Views - 30 days</h2>
          {totalViews === 0 ? (
            <p className="text-sm text-gray-500">No views yet.</p>
          ) : (
            <div className="flex items-end gap-1 h-40">
              {chartData.map((d, i) => (
                <div
                  key={i}
                  className="flex-1 bg-black rounded-t min-h-[2px]"
                  style={{ height: Math.max(2, (d.views / maxViews) * 100) + "%" }}
                  title={d.date + ": " + d.views}
                />
              ))}
            </div>
          )}
        </div>

        <SharedLinksPanel artistSlug={slug} />
      </div>
    </div>
  );
}
