import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

type PageProps = { params: Promise<{ token: string }> };

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  delta,
}: {
  label: string;
  value: number;
  delta: number;
}) {
  const positive = delta >= 0;
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      <p className={`text-xs mt-2 ${positive ? "text-green-600" : "text-gray-400"}`}>
        {positive && delta > 0 ? "↑ +" + delta + " this week" : "→ 0 this week"}
      </p>
    </div>
  );
}

function ShareNotFound({ reason }: { reason: string }) {
  return (
    <div className="min-h-screen grid place-items-center p-6 bg-gray-50">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold mb-2">Link unavailable</h1>
        <p className="text-gray-600 mb-6">{reason}</p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 bg-black text-white rounded-lg text-sm font-medium"
        >
          Go to TicketAI
        </Link>
      </div>
    </div>
  );
}

export default async function SharedAnalyticsPage({ params }: PageProps) {
  const { token } = await params;
  const supabase = createAdminClient();

  const { data: share, error: shareErr } = await supabase
    .from("analytics_shares")
    .select("artist_slug, expires_at")
    .eq("token", token)
    .maybeSingle();

  if (shareErr || !share) {
    return <ShareNotFound reason="This link doesn't exist or was revoked." />;
  }
  if (new Date(share.expires_at).getTime() < Date.now()) {
    return <ShareNotFound reason="This link has expired." />;
  }

  const slug = share.artist_slug;

  const { data: artist } = await supabase
    .from("artists")
    .select("name, slug")
    .eq("slug", slug)
    .maybeSingle();
  const artistName = artist?.name ?? slug;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenIso = sevenDaysAgo.toISOString();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    viewsRes,
    followsRes,
    bookingsRes,
    messagesRes,
    views7dRes,
    follows7dRes,
    bookings7dRes,
    messages7dRes,
  ] = await Promise.all([
    supabase.from("artist_views").select("*", { count: "exact", head: true }).eq("artist_slug", slug),
    supabase.from("artist_follows").select("*", { count: "exact", head: true }).eq("artist_slug", slug),
    supabase.from("booking_requests").select("*", { count: "exact", head: true }).eq("artist_slug", slug),
    supabase.from("artist_messages").select("*", { count: "exact", head: true }).eq("artist_slug", slug),
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

  const { data: recentViews } = await supabase
    .from("artist_views")
    .select("created_at")
    .eq("artist_slug", slug)
    .gte("created_at", thirtyDaysAgo.toISOString())
    .order("created_at", { ascending: true });

  const daily = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    daily.set(key, 0);
  }
  for (const row of recentViews ?? []) {
    const d = new Date(row.created_at);
    const key = `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (daily.has(key)) daily.set(key, (daily.get(key) ?? 0) + 1);
  }
  const chartData = Array.from(daily.entries()).map(([date, count]) => ({ date, count }));
  const maxVal = Math.max(1, ...chartData.map((d) => d.count));

  const expiry = new Date(share.expires_at).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-3">
              Shared analytics
            </p>
            <h1
              className="text-4xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-antonio)" }}
            >
              {artistName}
            </h1>
            <p className="text-gray-600 mt-2">
              Read-only snapshot · expires {expiry}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Views" value={totalViews} delta={views7d} />
          <StatCard label="Followers" value={totalFollows} delta={follows7d} />
          <StatCard label="Bookings" value={totalBookings} delta={bookings7d} />
          <StatCard label="Messages" value={totalMessages} delta={messages7d} />
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Views - 30 days</h2>
          {totalViews === 0 ? (
            <p className="text-sm text-gray-500">No views yet.</p>
          ) : (
            <div className="flex items-end gap-1 h-40">
              {chartData.map((d) => (
                <div
                  key={d.date}
                  className="flex-1 bg-black rounded-t min-h-[2px]"
                  style={{ height: `${Math.max(2, (d.count / maxVal) * 100)}%` }}
                  title={`${d.date}: ${d.count}`}
                />
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 text-center">
          Generated by TicketAI · numbers update in real-time
          while the link is active.
        </p>
      </div>
    </div>
  );
}
