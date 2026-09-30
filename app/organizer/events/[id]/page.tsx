"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type TicketTypeStat = {
  name: string;
  price: number;
  capacity: number;
  sold: number;
  available: number;
  revenue: number;
  occupancy: number;
};

type RecentTicket = {
  id: string;
  ticket_type: string | null;
  price: number | string | null;
  status: string | null;
  created_at: string | null;
};

type SalesDay = {
  date: string;
  tickets: number;
  revenue: number;
  cumulativeTickets: number;
  cumulativeRevenue: number;
};

type AnalyticsData = {
  event: {
    id: string;
    title: string;
    description?: string | null;
    start_date: string | null;
    status: string | null;
    venue_id?: string | null;
    hero_image?: string | null;
  };

  summary: {
    capacity: number;
    sold: number;
    available: number;
    revenue: number;
    orders: number;
    averageOrderValue: number;
    occupancy: number;
  };

  salesVelocity: {
    last7Days: {
      tickets: number;
      revenue: number;
      ticketsPerDay: number;
      revenuePerDay: number;
    };
    last14Days: {
      tickets: number;
      revenue: number;
      ticketsPerDay: number;
      revenuePerDay: number;
    };
    lifetimeTicketsPerDay: number;
    lifetimeRevenuePerDay: number;
    currentSalesPace: number;
    bestSalesDay: SalesDay | null;
    firstSaleDate: string | null;
    lastSaleDate: string | null;
    daysSinceFirstSale: number;
    daysSinceLastSale: number | null;
  };

  countdown: {
    eventDate: string | null;
    daysUntilEvent: number | null;
    ticketsRemaining: number;
  };

  salesPace: {
    currentSalesPace: number;
    requiredSalesPerDay: number;
    salesPaceGap: number;
    paceRatio: number | null;
    daysAvailableForSales: number | null;
  };

  revenueScenarios: {
    name: string;
    ticketsPerDay: number;
    additionalTickets: number;
    additionalRevenue: number;
    totalRevenue: number;
  }[];

  ticketTypeStats: TicketTypeStat[];

  salesTimeline: SalesDay[];

  orderAnalytics: {
    orders: number;
    averageTicketsPerOrder: number;
    largestOrder: number;
    smallestOrder: number;
  };

  recentTickets: RecentTicket[];
};

function money(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value || 0);
}

function number(value: number) {
  return new Intl.NumberFormat("en-GB", {
    maximumFractionDigits: 1,
  }).format(value || 0);
}

function formatDate(value: string | null) {
  if (!value) return "Not specified";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatShortDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-gray-900">
        {value}
      </p>

      {sub ? (
        <p className="mt-1 text-xs text-gray-500">
          {sub}
        </p>
      ) : null}
    </div>
  );
}

export default function OrganizerEventAnalyticsPage() {
  const params = useParams();
  const eventId = params?.id as string;

  const [data, setData] =
    useState<AnalyticsData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!eventId) return;

    async function loadAnalytics() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/organizer/events/${eventId}`,
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.error ||
              "Unable to load event analytics"
          );
        }

        setData(result);
      } catch (err) {
        console.error(
          "Event analytics error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load event analytics"
        );
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [eventId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-gray-500">
            Loading event analytics...
          </p>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/organizer"
            className="text-sm text-blue-600 hover:underline"
          >
            Back to organizer dashboard
          </Link>

          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            {error || "Analytics unavailable"}
          </div>
        </div>
      </main>
    );
  }

  const {
    event,
    summary,
    salesVelocity,
    countdown,
    salesPace,
    revenueScenarios,
    ticketTypeStats,
    salesTimeline,
    orderAnalytics,
    recentTickets,
  } = data;

  const paceRequired =
    salesPace.requiredSalesPerDay > 0;

  const paceOnTrack =
    salesPace.currentSalesPace >=
    salesPace.requiredSalesPerDay;

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <Link
              href="/organizer"
              className="text-sm text-blue-600 hover:underline"
            >
              Back to organizer dashboard
            </Link>

            <h1 className="mt-3 text-3xl font-bold text-gray-900">
              {event.title}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Event analytics
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                {event.status || "active"}
              </span>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                {formatDate(event.start_date)}
              </span>
            </div>
          </div>

          <Link
            href={`/event/${event.id}`}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            View Event
          </Link>
            <Link
              href={`/organizer/events/${event.id}/growth`}
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Event Intelligence
            </Link>
        </div>

        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Event Overview
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Tickets Sold"
              value={`${summary.sold}`}
              sub={`of ${summary.capacity}`}
            />

            <StatCard
              label="Gross Revenue"
              value={money(summary.revenue)}
              sub={`${summary.orders} orders`}
            />

            <StatCard
              label="Average Order"
              value={money(summary.averageOrderValue)}
              sub={`${number(orderAnalytics.averageTicketsPerOrder)} tickets/order`}
            />

            <StatCard
              label="Occupancy"
              value={`${summary.occupancy.toFixed(1)}%`}
              sub={`${summary.available} remaining`}
            />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Event Countdown
            </p>

            <p className="mt-3 text-4xl font-bold text-gray-900">
              {countdown.daysUntilEvent === null
                ? "ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â"
                : countdown.daysUntilEvent < 0
                ? "Event passed"
                : countdown.daysUntilEvent === 0
                ? "Today"
                : `${countdown.daysUntilEvent} days`}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {formatDate(countdown.eventDate)}
            </p>

            <div className="mt-5 border-t pt-4">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Tickets remaining
              </p>

              <p className="mt-1 text-xl font-semibold text-gray-900">
                {countdown.ticketsRemaining}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Current Sales Pace
            </p>

            <p className="mt-3 text-4xl font-bold text-gray-900">
              {number(
                salesVelocity.currentSalesPace
              )}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              tickets per day over the last 7 days
            </p>

            <div className="mt-5 border-t pt-4">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Revenue pace
              </p>

              <p className="mt-1 text-xl font-semibold text-gray-900">
                {money(
                  salesVelocity.last7Days.revenuePerDay
                )}/day
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Required Sales Pace
            </p>

            <p className="mt-3 text-4xl font-bold text-gray-900">
              {summary.daysUntilEvent < 0 ? "Event passed" : salesPace.requiredSalesPerDay > 0 ? `${salesPace.requiredSalesPerDay.toFixed(1)} tickets/day` : "-"}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              tickets per day to sell remaining inventory
            </p>

            {paceRequired ? (
              <div className="mt-5 border-t pt-4">
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Difference
                </p>

                <p
                  className={`mt-1 text-xl font-semibold ${
                    paceOnTrack
                      ? "text-green-600"
                      : "text-orange-600"
                  }`}
                >
                  {salesPace.salesPaceGap >= 0
                    ? "+"
                    : ""}
                  {number(
                    salesPace.salesPaceGap
                  )} tickets/day
                </p>
              </div>
            ) : null}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Sales Velocity
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Last 7 Days"
              value={`${salesVelocity.last7Days.tickets} tickets`}
              sub={money(salesVelocity.last7Days.revenue)}
            />

            <StatCard
              label="Last 14 Days"
              value={`${salesVelocity.last14Days.tickets} tickets`}
              sub={money(salesVelocity.last14Days.revenue)}
            />

            <StatCard
              label="Lifetime Daily Pace"
              value={`${number(salesVelocity.lifetimeTicketsPerDay)} tickets`}
              sub={`${money(salesVelocity.lifetimeRevenuePerDay)}/day`}
            />

            <StatCard
              label="Days Since Last Sale"
              value={
                salesVelocity.daysSinceLastSale === null
                  ? "No sales"
                  : `${salesVelocity.daysSinceLastSale}`
              }
              sub={
                salesVelocity.lastSaleDate
                  ? formatDate(
                      salesVelocity.lastSaleDate
                    )
                  : undefined
              }
            />
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Ticket Inventory
            </h2>

            <span className="text-sm text-gray-500">
              {summary.available} tickets remaining
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left font-medium text-gray-500">
                      Ticket Type
                    </th>
                    <th className="px-5 py-3 text-right font-medium text-gray-500">
                      Price
                    </th>
                    <th className="px-5 py-3 text-right font-medium text-gray-500">
                      Capacity
                    </th>
                    <th className="px-5 py-3 text-right font-medium text-gray-500">
                      Sold
                    </th>
                    <th className="px-5 py-3 text-right font-medium text-gray-500">
                      Remaining
                    </th>
                    <th className="px-5 py-3 text-right font-medium text-gray-500">
                      Occupancy
                    </th>
                    <th className="px-5 py-3 text-right font-medium text-gray-500">
                      Revenue
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {ticketTypeStats.map((type) => (
                    <tr key={type.name}>
                      <td className="px-5 py-4 font-medium text-gray-900">
                        {type.name}
                      </td>

                      <td className="px-5 py-4 text-right text-gray-700">
                        {money(type.price)}
                      </td>

                      <td className="px-5 py-4 text-right text-gray-700">
                        {type.capacity}
                      </td>

                      <td className="px-5 py-4 text-right text-gray-700">
                        {type.sold}
                      </td>

                      <td className="px-5 py-4 text-right font-medium text-gray-900">
                        {type.available}
                      </td>

                      <td className="px-5 py-4 text-right text-gray-700">
                        {type.occupancy.toFixed(1)}%
                      </td>

                      <td className="px-5 py-4 text-right font-medium text-gray-900">
                        {money(type.revenue)}
                      </td>
                    </tr>
                  ))}

                  {ticketTypeStats.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-8 text-center text-gray-500"
                      >
                        No ticket types configured.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Sales Timeline
          </h2>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left font-medium text-gray-500">
                      Date
                    </th>
                    <th className="px-5 py-3 text-right font-medium text-gray-500">
                      Tickets
                    </th>
                    <th className="px-5 py-3 text-right font-medium text-gray-500">
                      Revenue
                    </th>
                    <th className="px-5 py-3 text-right font-medium text-gray-500">
                      Cumulative Tickets
                    </th>
                    <th className="px-5 py-3 text-right font-medium text-gray-500">
                      Cumulative Revenue
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {[...salesTimeline]
                    .reverse()
                    .map((day) => (
                      <tr key={day.date}>
                        <td className="px-5 py-4 font-medium text-gray-900">
                          {formatShortDate(day.date)}
                        </td>

                        <td className="px-5 py-4 text-right">
                          {day.tickets}
                        </td>

                        <td className="px-5 py-4 text-right">
                          {money(day.revenue)}
                        </td>

                        <td className="px-5 py-4 text-right">
                          {day.cumulativeTickets}
                        </td>

                        <td className="px-5 py-4 text-right font-medium">
                          {money(day.cumulativeRevenue)}
                        </td>
                      </tr>
                    ))}

                  {salesTimeline.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-8 text-center text-gray-500"
                      >
                        No sales recorded yet.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Order Analytics
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Orders"
              value={`${orderAnalytics.orders}`}
            />

            <StatCard
              label="Average Tickets / Order"
              value={number(
                orderAnalytics.averageTicketsPerOrder
              )}
            />

            <StatCard
              label="Largest Order"
              value={money(
                orderAnalytics.largestOrder
              )}
            />

            <StatCard
              label="Smallest Order"
              value={money(
                orderAnalytics.smallestOrder
              )}
            />
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Revenue Scenarios
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Illustrative scenarios using recent sales pace.
                These are not predictions.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {revenueScenarios.map((scenario) => (
              <div
                key={scenario.name}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-medium capitalize text-gray-500">
                  {scenario.name} scenario
                </p>

                <p className="mt-3 text-2xl font-bold text-gray-900">
                  {money(scenario.totalRevenue)}
                </p>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Tickets/day</span>
                    <span className="font-medium">
                      {number(
                        scenario.ticketsPerDay
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Additional tickets</span>
                    <span className="font-medium">
                      {number(
                        scenario.additionalTickets
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Additional revenue</span>
                    <span className="font-medium">
                      {money(
                        scenario.additionalRevenue
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {salesVelocity.bestSalesDay ? (
          <section>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Highest-volume sales day
              </p>

              <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatShortDate(
                      salesVelocity.bestSalesDay.date
                    )}
                  </p>

                  <p className="text-sm text-gray-500">
                    {salesVelocity.bestSalesDay.tickets} tickets sold
                  </p>
                </div>

                <p className="text-xl font-semibold text-gray-900">
                  {money(
                    salesVelocity.bestSalesDay.revenue
                  )}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Recent Tickets
          </h2>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left font-medium text-gray-500">
                      Ticket
                    </th>
                    <th className="px-5 py-3 text-left font-medium text-gray-500">
                      Type
                    </th>
                    <th className="px-5 py-3 text-right font-medium text-gray-500">
                      Price
                    </th>
                    <th className="px-5 py-3 text-left font-medium text-gray-500">
                      Status
                    </th>
                    <th className="px-5 py-3 text-right font-medium text-gray-500">
                      Created
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {recentTickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td className="px-5 py-4 font-mono text-xs text-gray-700">
                        {ticket.id.slice(0, 8)}
                      </td>

                      <td className="px-5 py-4">
                        {ticket.ticket_type || "Ticket"}
                      </td>

                      <td className="px-5 py-4 text-right">
                        {money(
                          Number(ticket.price || 0)
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                          {ticket.status || "valid"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right text-gray-500">
                        {formatDate(
                          ticket.created_at
                        )}
                      </td>
                    </tr>
                  ))}

                  {recentTickets.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-8 text-center text-gray-500"
                      >
                        No tickets recorded yet.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}