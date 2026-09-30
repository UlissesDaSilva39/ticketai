"use client";

import { useEffect, useState } from "react";

type EventStats = {
  id: string;
  title: string;
  start_date: string;
  status: string;
  capacity: number;
  sold: number;
  revenue: number;
  orders: number;
  averageOrderValue: number;
  occupancy: number;
};

type DashboardData = {
  summary: {
    totalTicketsSold: number;
    totalRevenue: number;
    totalEvents: number;
    totalCapacity: number;
    occupancy: number;
    totalOrders: number;
    averageOrderValue: number;
  };
  events: EventStats[];
  recentOrders: Array<{
    id: string;
    order_id: string;
    ticket_type: string;
    price: number;
    created_at: string;
  }>;
};

function money(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
}

function date(value: string) {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function OrganizerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/organizer/dashboard",
        {
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to load dashboard"
        );
      }

      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f7f7]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="animate-pulse">
            <div className="h-8 w-64 rounded bg-gray-200" />
            <div className="mt-3 h-4 w-96 rounded bg-gray-100" />

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-32 rounded-2xl bg-gray-100"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#f7f7f7]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h1 className="text-lg font-semibold text-red-900">
              Dashboard error
            </h1>

            <p className="mt-2 text-sm text-red-700">
              {error}
            </p>

            <button
              onClick={loadDashboard}
              className="mt-4 rounded-full bg-black px-5 py-2 text-sm font-medium text-white"
            >
              Try again
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!data) return null;

  const {
    totalTicketsSold,
    totalRevenue,
    totalEvents,
    totalCapacity,
    occupancy,
    totalOrders,
    averageOrderValue,
  } = data.summary;

  return (
    <main className="min-h-screen bg-[#f7f7f7]">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              TicketAI
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-black">
              Promoter Dashboard
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage your events, sales and ticket performance.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadDashboard}
              className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-gray-50"
            >
              Refresh
            </button>

            <a
              href="/organizer/events/new"
              className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Create Event
            </a>
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Tickets Sold
            </p>

            <p className="mt-3 text-3xl font-bold">
              {totalTicketsSold.toLocaleString()}
            </p>

            <p className="mt-2 text-xs text-gray-400">
              {totalCapacity.toLocaleString()} available
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Gross Revenue
            </p>

            <p className="mt-3 text-3xl font-bold">
              {money(totalRevenue)}
            </p>

            <p className="mt-2 text-xs text-gray-400">
              Across all events
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Orders
            </p>

            <p className="mt-3 text-3xl font-bold">
              {totalOrders.toLocaleString()}
            </p>

            <p className="mt-2 text-xs text-gray-400">
              {money(averageOrderValue)} average order
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Occupancy
            </p>

            <p className="mt-3 text-3xl font-bold">
              {occupancy.toFixed(1)}%
            </p>

            <p className="mt-2 text-xs text-gray-400">
              {totalEvents} events
            </p>
          </div>

        </section>

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white">

          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold">
                Your Events
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Sales, capacity and order performance.
              </p>
            </div>

            <a
              href="/organizer/events"
              className="text-sm font-medium text-black hover:underline"
            >
              View all
            </a>
          </div>

          {data.events.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h3 className="text-lg font-semibold">
                No events yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Create your first event to start selling tickets.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                    <th className="px-6 py-4 font-medium">Event</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Sold</th>
                    <th className="px-6 py-4 font-medium">Orders</th>
                    <th className="px-6 py-4 font-medium">Revenue</th>
                    <th className="px-6 py-4 font-medium">Occupancy</th>
                    <th className="px-6 py-4 font-medium">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {data.events.map((event) => (
                    <tr
                      key={event.id}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="px-6 py-5">
                        <div className="font-medium text-black">
                          {event.title}
                        </div>

                        <div className="mt-1 text-xs text-gray-400">
                          {event.status}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-600">
                        {date(event.start_date)}
                      </td>

                      <td className="px-6 py-5 text-sm">
                        <span className="font-medium">
                          {event.sold}
                        </span>

                        <span className="text-gray-400">
                          {" / "}
                          {event.capacity}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm">
                        {event.orders}
                      </td>

                      <td className="px-6 py-5 font-medium">
                        {money(event.revenue)}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full bg-black"
                              style={{
                                width:
                                  Math.min(
                                    event.occupancy,
                                    100
                                  ) + "%",
                              }}
                            />
                          </div>

                          <span className="text-sm text-gray-600">
                            {event.occupancy.toFixed(0)}%
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <a
                          href={
                            "/organizer/events/" +
                            event.id
                          }
                          className="text-sm font-medium hover:underline"
                        >
                          Analytics
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white">

          <div className="border-b border-gray-100 px-6 py-5">
            <h2 className="text-lg font-semibold">
              Recent Sales
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest tickets sold across your events.
            </p>
          </div>

          {data.recentOrders.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-gray-500">
              No ticket sales yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                    <th className="px-6 py-4 font-medium">Order</th>
                    <th className="px-6 py-4 font-medium">Ticket</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {data.recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="px-6 py-4 font-mono text-sm">
                        {order.order_id
                          ? order.order_id
                              .slice(0, 8)
                              .toUpperCase()
                          : "—"}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {order.ticket_type}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium">
                        {money(Number(order.amount || 0))}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {date(order.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </section>

        <section className="mt-8 rounded-2xl bg-black p-8 text-white">
          <p className="text-sm font-medium text-gray-400">
            TICKETAI AI
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Your AI promoter assistant
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
            Ask questions about your events, sales and customers.
            AI recommendations and campaign automation will be
            connected to your real event data next.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-full border border-white/20 px-5 py-2.5 text-sm">
              Analyse my sales
            </button>

            <button className="rounded-full border border-white/20 px-5 py-2.5 text-sm">
              Which event is selling fastest?
            </button>

            <button className="rounded-full border border-white/20 px-5 py-2.5 text-sm">
              How can I sell more tickets?
            </button>
          </div>
        </section>

      </div>
    </main>
  );
}
