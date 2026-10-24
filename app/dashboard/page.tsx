import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar/Sidebar";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [
    { count: eventCount },
    { count: artistCount },
    { count: venueCount },
    { count: promoterCount },
    { count: opportunityCount },
  ] = await Promise.all([
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("artists").select("*", { count: "exact", head: true }),
    supabase.from("venues").select("*", { count: "exact", head: true }),
    supabase.from("promoters").select("*", { count: "exact", head: true }),
    supabase.from("opportunities").select("*", { count: "exact", head: true }),
  ]);

  const { data: recentRuns } = await supabase
    .from("ingestion_runs")
    .select("id, status, records_seen, records_inserted, started_at")
    .order("started_at", { ascending: false })
    .limit(3);

  const stats = [
    { label: "Events", value: eventCount ?? 0, href: "/discover/events" },
    { label: "Artists", value: artistCount ?? 0, href: "/discover/artists" },
    { label: "Venues", value: venueCount ?? 0, href: "/discover/venues" },
    { label: "Promoters", value: promoterCount ?? 0, href: "/discover/promoters" },
    { label: "Opportunities", value: opportunityCount ?? 0, href: "/opportunities" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      <div className="mx-auto max-w-[1400px] px-6 py-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3">
          <Sidebar />
        </div>
        <main className="col-span-12 lg:col-span-9 min-w-0">
          <h1 className="text-4xl md:text-5xl font-bold uppercase mb-2" style={{ fontFamily: "var(--font-antonio)" }}>
            Dashboard
          </h1>
          <p className="text-gray-600 mb-8">Welcome back. Here is what is happening on GRID.</p>

          <h2 className="text-lg font-bold mb-3">Platform stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            {stats.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 transition"
              >
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </Link>
            ))}
          </div>

          <h2 className="text-lg font-bold mb-3">Your dashboards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
            <Link href="/organizer" className="rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 transition">
              <p className="font-semibold mb-1">Organizer dashboard</p>
              <p className="text-sm text-gray-600">Create events, manage bookings, track analytics.</p>
            </Link>
            <Link href="/artist/dashboard" className="rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 transition">
              <p className="font-semibold mb-1">Artist dashboard</p>
              <p className="text-sm text-gray-600">Manage profile, tracks, inbox, and bookings.</p>
            </Link>
            <Link href="/promoter/dashboard" className="rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 transition">
              <p className="font-semibold mb-1">Promoter dashboard</p>
              <p className="text-sm text-gray-600">Manage events, bookings, and audience.</p>
            </Link>
            <Link href="/venue/dashboard" className="rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 transition">
              <p className="font-semibold mb-1">Venue dashboard</p>
              <p className="text-sm text-gray-600">Manage your venue and upcoming events.</p>
            </Link>
            <Link href="/admin" className="rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 transition">
              <p className="font-semibold mb-1">Admin</p>
              <p className="text-sm text-gray-600">Platform administration.</p>
            </Link>
            <Link href="/admin/ingestion" className="rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 transition">
              <p className="font-semibold mb-1">Data ingestion</p>
              <p className="text-sm text-gray-600">Ticketmaster and RSS sync runs.</p>
            </Link>
          </div>

          {recentRuns && recentRuns.length > 0 && (
            <>
              <h2 className="text-lg font-bold mb-3">Recent ingestion runs</h2>
              <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-4 py-2 font-semibold text-gray-700">Started</th>
                      <th className="px-4 py-2 font-semibold text-gray-700">Status</th>
                      <th className="px-4 py-2 font-semibold text-gray-700">Seen</th>
                      <th className="px-4 py-2 font-semibold text-gray-700">Inserted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRuns.map((r) => (
                      <tr key={r.id} className="border-t border-gray-100">
                        <td className="px-4 py-2 text-gray-600 text-xs">
                          {r.started_at ? new Date(r.started_at).toLocaleString("en-GB") : "-"}
                        </td>
                        <td className="px-4 py-2">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${r.status === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">{r.records_seen}</td>
                        <td className="px-4 py-2 text-green-700 font-semibold">{r.records_inserted}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}