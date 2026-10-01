import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Event } from "@/lib/types";

export const dynamic = "force-dynamic";

type OrderRow = {
  id: string;
  event_id: string;
  total_amount: number;
  tickets: Array<{ name: string; qty: number }>;
  created_at: string;
};

export default async function OrganizerAnalytics() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", user.id)
    .order("start_date", { ascending: false });

  const eventList = (events as Event[]) || [];
  const eventIds = eventList.map((e) => e.id);

  let orders: OrderRow[] = [];
  if (eventIds.length > 0) {
    const { data: ordersData } = await supabase
      .from("orders")
      .select("id, event_id, total_amount, tickets, created_at")
      .in("event_id", eventIds)
      .eq("status", "paid");
    orders = (ordersData as OrderRow[]) || [];
  }

  const totalViews = eventList.reduce((s, e) => s + Number(e.views || 0), 0);
  const totalRevenue = orders.reduce((s, o) => s + Number(o.total_amount || 0), 0);
  const totalTickets = orders.reduce((s, o) => {
    return s + (o.tickets || []).reduce((ts, t) => ts + Number(t.qty || 0), 0);
  }, 0);
  const conversionRate = totalViews > 0 ? (totalTickets / totalViews) * 100 : 0;

  const perEventStats = eventList.map((e) => {
    const eventOrders = orders.filter((o) => o.event_id === e.id);
    const revenue = eventOrders.reduce((s, o) => s + Number(o.total_amount || 0), 0);
    const ticketsSold = eventOrders.reduce((s, o) => {
      return s + (o.tickets || []).reduce((ts, t) => ts + Number(t.qty || 0), 0);
    }, 0);
    const views = Number(e.views || 0);
    const convRate = views > 0 ? (ticketsSold / views) * 100 : 0;
    return { event: e, revenue, ticketsSold, views, convRate, orders: eventOrders.length };
  });

  const sortedByViews = [...perEventStats].sort((a, b) => b.views - a.views);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/organizer" className="text-sm text-gray-500 hover:text-black">
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-5xl font-bold mb-3" style={{ fontFamily: "var(--font-antonio)" }}>
        ANALYTICS
      </h1>
      <p className="text-gray-500 mb-10">Performance of your events</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Total Views</p>
          <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-antonio)" }}>{totalViews}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Tickets Sold</p>
          <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-antonio)" }}>{totalTickets}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Conversion</p>
          <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-antonio)" }}>{conversionRate.toFixed(1)}%</p>
        </div>
        <div className="bg-black text-white rounded-lg p-6">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Revenue</p>
          <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-antonio)" }}>£{totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-antonio)" }}>
        TOP PERFORMING EVENTS
      </h2>

      {sortedByViews.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-500">No events yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedByViews.map((stat) => (
            <div key={stat.event.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-[200px]">
                  <h3 className="font-bold text-lg mb-1">{stat.event.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(stat.event.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex gap-6 text-right">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Views</p>
                    <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-antonio)" }}>{stat.views}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Sold</p>
                    <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-antonio)" }}>{stat.ticketsSold}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Rate</p>
                    <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-antonio)" }}>{stat.convRate.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Revenue</p>
                    <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-antonio)" }}>£{stat.revenue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-black h-full rounded-full transition-all"
                  style={{ width: Math.min(stat.convRate * 4, 100) + "%" }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

