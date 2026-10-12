import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import AnalyticsMetric from "@/components/artist/AnalyticsMetric";
import AnalyticsSparkline from "@/components/artist/AnalyticsSparkline";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

type ViewRow = {
  created_at: string;
  source: string | null;
  city: string | null;
  viewer_id: string | null;
};

function countBy(rows: ViewRow[], key: "source" | "city"): Record<string, number> {
  const out: Record<string, number> = {};
  for (const r of rows) {
    const k = r[key] || "unknown";
    out[k] = (out[k] || 0) + 1;
  }
  return out;
}

function topN(rec: Record<string, number>, n: number): [string, number][] {
  return Object.entries(rec)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
}

function daysBack(n: number): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - n);
  return d;
}

export default async function AnalyticsPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: artist } = await supabase
    .from("artists")
    .select("id, name, slug, owner_id")
    .eq("slug", slug)
    .maybeSingle();

  if (!artist) notFound();
  if (!user || user.id !== artist.owner_id) notFound();

  const { data: viewsRaw } = await supabase
    .from("artist_views")
    .select("created_at, source, city, viewer_id")
    .eq("artist_slug", slug)
    .order("created_at", { ascending: false })
    .limit(5000);

  const views: ViewRow[] = viewsRaw || [];

  const total = views.length;
  const since7 = daysBack(7).toISOString();
  const since14 = daysBack(14).toISOString();

  const last7 = views.filter((v) => v.created_at >= since7).length;
  const prev7 = views.filter(
    (v) => v.created_at >= since14 && v.created_at < since7
  ).length;

  const uniqueViewers = new Set(
    views.map((v) => v.viewer_id).filter(Boolean)
  ).size;

  const sourceCounts = countBy(views, "source");
  const cityCounts = countBy(views, "city");

  const topSources = topN(sourceCounts, 5);
  const topCities = topN(cityCounts, 5);
  const topCity = topCities[0]?.[0] || "—";

  const delta = prev7 === 0 ? null : Math.round(((last7 - prev7) / prev7) * 100);
  const deltaStr =
    delta === null
      ? undefined
      : (delta >= 0 ? "+" : "") + delta + "% vs prev 7d";

  const buckets: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = daysBack(i);
    buckets[d.toISOString().slice(0, 10)] = 0;
  }
  for (const v of views) {
    const k = v.created_at.slice(0, 10);
    if (k in buckets) buckets[k]++;
  }
  const sparkPoints = Object.values(buckets);

  const recent = views.slice(0, 10);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <Link
              href={"/artist/" + slug}
              className="text-white/40 text-xs tracking-widest hover:text-white"
            >
              ← BACK TO PROFILE
            </Link>
            <h1
              className="text-4xl md:text-6xl font-bold tracking-tight mt-3"
              style={{ fontFamily: "var(--font-antonio)" }}
            >
              ANALYTICS
            </h1>
            <p className="text-white/50 text-sm mt-2">
              {artist.name || slug} · last 30 days
            </p>
          </div>
          <a
            href={`/api/artists/${slug}/analytics/export`}
            className="border border-white/20 hover:border-white/50 rounded-full px-5 py-2 text-sm transition"
          >
            Export CSV
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <AnalyticsMetric label="TOTAL VIEWS" value={total} delta={deltaStr} />
          <AnalyticsMetric label="LAST 7 DAYS" value={last7} />
          <AnalyticsMetric label="UNIQUE VIEWERS" value={uniqueViewers} />
          <AnalyticsMetric label="TOP CITY" value={topCity} />
        </div>

        <div className="border border-white/10 rounded-2xl p-6 bg-white/[0.02] mb-10">
          <p className="text-xs tracking-widest text-white/40 mb-4">
            VIEWS · LAST 30 DAYS
          </p>
          <AnalyticsSparkline points={sparkPoints} />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="border border-white/10 rounded-2xl p-6 bg-white/[0.02]">
            <p className="text-xs tracking-widest text-white/40 mb-5">
              TOP CITIES
            </p>
            {topCities.length === 0 && (
              <p className="text-white/30 text-sm">No data yet</p>
            )}
            <div className="space-y-3">
              {topCities.map(([city, count]) => (
                <div key={city} className="flex items-center gap-4">
                  <span className="text-sm text-white/80 w-32 truncate">
                    {city}
                  </span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white/80"
                      style={{
                        width: `${(count / (topCities[0]?.[1] || 1)) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-white/50 w-10 text-right">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-white/10 rounded-2xl p-6 bg-white/[0.02]">
            <p className="text-xs tracking-widest text-white/40 mb-5">
              TRAFFIC SOURCES
            </p>
            {topSources.length === 0 && (
              <p className="text-white/30 text-sm">No data yet</p>
            )}
            <div className="space-y-3">
              {topSources.map(([source, count]) => (
                <div key={source} className="flex items-center gap-4">
                  <span className="text-sm text-white/80 w-32 truncate">
                    {source}
                  </span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white/80"
                      style={{
                        width: `${(count / (topSources[0]?.[1] || 1)) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-white/50 w-10 text-right">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border border-white/10 rounded-2xl p-6 bg-white/[0.02]">
          <p className="text-xs tracking-widest text-white/40 mb-5">
            RECENT ACTIVITY
          </p>
          {recent.length === 0 && (
            <p className="text-white/30 text-sm">No views yet</p>
          )}
          <div className="space-y-2">
            {recent.map((v, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-sm py-2 border-b border-white/5 last:border-0"
              >
                <span className="text-white/70">
                  {new Date(v.created_at).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="text-white/50 text-xs">
                  {(v.source || "direct") + (v.city ? " · " + v.city : "")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}