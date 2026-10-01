import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type VenueRow = {
  id: string;
  name: string;
  city: string | null;
  capacity: number | null;
  revenue_share_percent: number;
  total_revenue: number;
  status: string;
};

type EventRow = {
  id: string;
  title: string;
  start_date: string;
  status: string;
};

export default async function VenueDashboard() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: venues } = await supabase
    .from("venues")
    .select("*")
    .eq("organizer_id", user.id)
    .order("created_at", { ascending: false });

  const venueList = (venues as VenueRow[]) || [];
  const venueEvents: Record<string, EventRow[]> = {};
  let totalRevenue = 0;

  for (const v of venueList) {
    totalRevenue += Number(v.total_revenue || 0);
    const { data: events } = await supabase
      .from("events")
      .select("id, title, start_date, status")
      .eq("venue_id", v.id)
      .order("start_date", { ascending: false });
    venueEvents[v.id] = (events as EventRow[]) || [];
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-5xl font-bold" style={{ fontFamily: "var(--font-antonio)" }}>VENUES</h1>
          <p className="text-gray-500 mt-2">Earn {venueList[0]?.revenue_share_percent || 15}% on every ticket sold at your venue</p>
        </div>
        <Link href="/organizer/venues/new" className="px-6 py-3 bg-black text-white font-medium rounded-full hover:bg-gray-800">
          + Add Venue
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Venues</p>
          <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-antonio)" }}>{venueList.length}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Events</p>
          <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-antonio)" }}>{Object.values(venueEvents).flat().length}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Revenue Share</p>
          <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-antonio)" }}>{venueList[0]?.revenue_share_percent || 15}%</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Earned</p>
          <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-antonio)" }}>{"£" + totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {venueList.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-lg text-gray-500 mb-6">You have not added any venues yet.</p>
          <Link href="/organizer/venues/new" className="inline-block px-8 py-4 bg-black text-white font-medium rounded-full hover:bg-gray-800">
            Add Your First Venue
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {venueList.map((v) => (
            <div key={v.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{v.name}</h2>
                  <p className="text-sm text-gray-500">
                    {v.city || "—"}
                    {v.capacity ? " · " + v.capacity + " capacity" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Total Earned</p>
                  <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-antonio)" }}>
                    {"£" + Number(v.total_revenue || 0).toFixed(2)}
                  </p>
                </div>
              </div>
              <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-3">Events at this venue</h3>
              {venueEvents[v.id]?.length === 0 ? (
                <p className="text-sm text-gray-400">No events yet.</p>
              ) : (
                <div className="space-y-2">
                  {venueEvents[v.id].map((e) => (
                    <div key={e.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{e.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(e.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                      <span className="text-xs px-3 py-1 bg-white rounded-full border border-gray-200">{e.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

