"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Recommendation = {
  priority:
    | "high"
    | "medium"
    | "low";

  category:
    | "sales"
    | "marketing"
    | "inventory"
    | "conversion"
    | "monitoring";

  title: string;
  description: string;
  action: string;
};

type TicketPerformance = {
  name: string;
  price: number;
  capacity: number;
  sold: number;
  remaining: number;
  revenue: number;
  occupancy: number;
};

type IntelligenceData = {
  event: {
    id: string;
    title: string;
    start_date: string | null;
    status: string | null;
  };

  intelligence: {
    eventHealth: number;

    salesTrend:
      | "accelerating"
      | "stable"
      | "slowing"
      | "no_recent_sales";

    salesPace: {
      current: number;
      required: number;
      gap: number;
      status:
        | "ahead"
        | "on_track"
        | "behind"
        | "insufficient_data";
    };

    inventory: {
      capacity: number;
      sold: number;
      remaining: number;
      occupancy: number;
      pressure:
        | "low"
        | "medium"
        | "high";
    };

    urgency:
      | "low"
      | "medium"
      | "high";

    recentActivity: {
      last7Tickets: number;
      last7Revenue: number;
      previous7Tickets: number;
      previous7Revenue: number;
      daysSinceLastSale: number | null;
    };

    ticketPerformance: {
      strongest:
        | TicketPerformance
        | null;

      weakest:
        | TicketPerformance
        | null;

      types: TicketPerformance[];
    };

    eventTiming: {
      daysToEvent: number | null;
      eventDate: string | null;
    };
  };

  recommendations: Recommendation[];
};

function money(value: number) {
  return new Intl.NumberFormat(
    "en-GB",
    {
      style: "currency",
      currency: "GBP",
    }
  ).format(value || 0);
}

function number(value: number) {
  return new Intl.NumberFormat(
    "en-GB",
    {
      maximumFractionDigits: 1,
    }
  ).format(value || 0);
}

function formatDate(
  value: string | null
) {
  if (!value) return "Not specified";

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleString(
    "en-GB",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );
}

function priorityClass(
  priority: Recommendation["priority"]
) {
  if (priority === "high") {
    return "border-red-200 bg-red-50";
  }

  if (priority === "medium") {
    return "border-orange-200 bg-orange-50";
  }

  return "border-gray-200 bg-white";
}

function statusClass(
  status: string
) {
  if (
    status === "ahead" ||
    status === "accelerating"
  ) {
    return "bg-green-100 text-green-700";
  }

  if (
    status === "behind" ||
    status === "slowing" ||
    status === "no_recent_sales"
  ) {
    return "bg-red-100 text-red-700";
  }

  return "bg-gray-100 text-gray-700";
}

export default function EventGrowthPage() {
  const params = useParams();
  const eventId =
    params?.id as string;

  const [data, setData] =
    useState<IntelligenceData | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!eventId) return;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `/api/organizer/events/${eventId}/intelligence`,
            {
              cache: "no-store",
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result?.error ||
              "Unable to load event intelligence"
          );
        }

        setData(result);
      } catch (err) {
        console.error(
          "Event intelligence error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load event intelligence"
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [eventId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-gray-500">
            Analysing event data...
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
            href={`/organizer/events/${eventId}`}
            className="text-sm text-blue-600 hover:underline"
          >
            Back to analytics
          </Link>

          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            {error ||
              "Intelligence unavailable"}
          </div>
        </div>
      </main>
    );
  }

  const {
    event,
    intelligence,
    recommendations,
  } = data;

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        <div>
          <Link
            href={`/organizer/events/${event.id}`}
            className="text-sm text-blue-600 hover:underline"
          >
            Back to event analytics
          </Link>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Event Intelligence
              </h1>

              <p className="mt-1 text-gray-500">
                {event.title}
              </p>

              <p className="mt-2 text-sm text-gray-400">
                {formatDate(
                  event.start_date
                )}
              </p>
            </div>

            <Link
              href={`/organizer/events/${event.id}`}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Analytics
            </Link>
          </div>
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Event Health
              </p>

              <p className="mt-2 text-5xl font-bold text-gray-900">
                {intelligence.eventHealth}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Data-driven indicator based on sales pace,
                momentum, occupancy and recent activity.
              </p>
            </div>

            <div className="w-full md:w-1/2">
              <div className="h-4 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gray-900 transition-all"
                  style={{
                    width: `${Math.min(
                      Math.max(
                        intelligence.eventHealth,
                        0
                      ),
                      100
                    )}%`,
                  }}
                />
              </div>

              <div className="mt-2 flex justify-between text-xs text-gray-400">
                <span>0</span>
                <span>100</span>
              </div>
            </div>

          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Sales Trend
            </p>

            <span
              className={`mt-3 inline-block rounded-full px-3 py-1 text-sm font-medium ${statusClass(
                intelligence.salesTrend
              )}`}
            >
              {intelligence.salesTrend.replaceAll(
                "_",
                " "
              )}
            </span>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Sales Pace
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {number(
                intelligence.salesPace.current
              )}
              /day
            </p>

            <span
              className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${statusClass(
                intelligence.salesPace.status
              )}`}
            >
              {intelligence.salesPace.status.replaceAll(
                "_",
                " "
              )}
            </span>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Inventory Pressure
            </p>

            <p className="mt-2 text-2xl font-bold capitalize text-gray-900">
              {intelligence.inventory.pressure}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {intelligence.inventory.remaining} tickets remaining
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Event Urgency
            </p>

            <p className="mt-2 text-2xl font-bold capitalize text-gray-900">
              {intelligence.urgency}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {intelligence.eventTiming.daysToEvent === null
                ? "Event date unavailable"
                : `${intelligence.eventTiming.daysToEvent} day(s) remaining`}
            </p>
          </div>

        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              What TicketAI Is Seeing
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Automated observations from the event's current
              sales data.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Last 7 Days
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {intelligence.recentActivity.last7Tickets}
              </p>

              <p className="text-sm text-gray-500">
                tickets sold
              </p>

              <p className="mt-3 font-medium text-gray-900">
                {money(
                  intelligence.recentActivity.last7Revenue
                )}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Previous 7 Days
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {intelligence.recentActivity.previous7Tickets}
              </p>

              <p className="text-sm text-gray-500">
                tickets sold
              </p>

              <p className="mt-3 font-medium text-gray-900">
                {money(
                  intelligence.recentActivity.previous7Revenue
                )}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Last Sale
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {intelligence.recentActivity.daysSinceLastSale === null
                  ? "None"
                  : `${intelligence.recentActivity.daysSinceLastSale} day(s) ago`}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                based on recorded ticket sales
              </p>
            </div>

          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Ticket Performance
            </h2>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left font-medium text-gray-500">
                      Ticket
                    </th>
                    <th className="px-5 py-3 text-right font-medium text-gray-500">
                      Price
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
                  {intelligence.ticketPerformance.types.map(
                    (type) => (
                      <tr key={type.name}>
                        <td className="px-5 py-4 font-medium text-gray-900">
                          {type.name}
                        </td>

                        <td className="px-5 py-4 text-right">
                          {money(type.price)}
                        </td>

                        <td className="px-5 py-4 text-right">
                          {type.sold}
                        </td>

                        <td className="px-5 py-4 text-right">
                          {type.remaining}
                        </td>

                        <td className="px-5 py-4 text-right">
                          {type.occupancy.toFixed(1)}%
                        </td>

                        <td className="px-5 py-4 text-right font-medium">
                          {money(type.revenue)}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Recommended Actions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Rule-based recommendations generated from current
              event data.
            </p>
          </div>

          <div className="space-y-4">
            {recommendations.map(
              (recommendation, index) => (
                <div
                  key={`${recommendation.title}-${index}`}
                  className={`rounded-xl border p-5 shadow-sm ${priorityClass(
                    recommendation.priority
                  )}`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-gray-600">
                          {recommendation.priority}
                        </span>

                        <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-medium capitalize text-gray-600">
                          {recommendation.category}
                        </span>
                      </div>

                      <h3 className="mt-3 text-lg font-bold text-gray-900">
                        {recommendation.title}
                      </h3>

                      <p className="mt-2 text-sm text-gray-700">
                        {recommendation.description}
                      </p>
                    </div>

                    <div className="md:max-w-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Suggested action
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {recommendation.action}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-gray-900 p-6 text-white">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Ready for the Growth Engine?
              </h2>

              <p className="mt-1 max-w-2xl text-sm text-gray-300">
                The next phase will turn these intelligence signals
                into campaigns, audiences and measurable growth
                actions.
              </p>
            </div>

            <Link
              href={`/organizer/events/${event.id}`}
              className="rounded-lg bg-white px-5 py-3 text-center text-sm font-semibold text-gray-900 hover:bg-gray-100"
            >
              Back to Analytics
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}