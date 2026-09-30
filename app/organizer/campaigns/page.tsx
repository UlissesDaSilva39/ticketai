"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Campaign = {
  id: string;
  name: string;
  objective: string;
  status: string;
  budget: number;
  daily_budget: number | null;
  start_date: string | null;
  end_date: string | null;
  clicks: number;
  conversions: number;
  revenue: number;
  tracking_code: string;
  event?: {
    id: string;
    title?: string;
    name?: string;
  } | null;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(Number(value || 0));
}

function formatDate(value: string | null) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusClass(status: string) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "paused":
      return "bg-yellow-100 text-yellow-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCampaigns() {
      try {
        const response = await fetch(
          "/api/organizer/campaigns",
          { cache: "no-store" }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load campaigns"
          );
        }

        setCampaigns(data.campaigns || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load campaigns"
        );
      } finally {
        setLoading(false);
      }
    }

    loadCampaigns();
  }, []);

  const stats = useMemo(() => {
    const active = campaigns.filter(
      (campaign) => campaign.status === "active"
    ).length;

    const drafts = campaigns.filter(
      (campaign) => campaign.status === "draft"
    ).length;

    const budget = campaigns.reduce(
      (sum, campaign) =>
        sum + Number(campaign.budget || 0),
      0
    );

    return {
      total: campaigns.length,
      active,
      drafts,
      budget,
    };
  }, [campaigns]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-7xl">
          Loading campaigns...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <Link
              href="/organizer"
              className="mb-3 inline-block text-sm text-gray-500 hover:text-black"
            >
              Back to Organizer Dashboard
            </Link>

            <h1 className="text-3xl font-bold text-gray-900">
              Campaigns
            </h1>

            <p className="mt-2 text-gray-600">
              Create and manage campaigns for your events.
            </p>
          </div>

          <Link
            href="/organizer/campaigns/new"
            className="inline-flex rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Create Campaign
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">
              Total Campaigns
            </p>
            <p className="mt-2 text-3xl font-bold">
              {stats.total}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">
              Active
            </p>
            <p className="mt-2 text-3xl font-bold">
              {stats.active}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">
              Drafts
            </p>
            <p className="mt-2 text-3xl font-bold">
              {stats.drafts}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">
              Planned Budget
            </p>
            <p className="mt-2 text-3xl font-bold">
              {formatCurrency(stats.budget)}
            </p>
          </div>
        </div>

        {campaigns.length === 0 ? (
          <div className="rounded-xl border bg-white p-12 text-center">
            <h2 className="text-xl font-semibold">
              No campaigns yet
            </h2>

            <p className="mt-2 text-gray-500">
              Create your first campaign to start building
              your TicketAI growth engine.
            </p>

            <Link
              href="/organizer/campaigns/new"
              className="mt-6 inline-flex rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white"
            >
              Create Your First Campaign
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Campaign
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Event
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Budget
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Dates
                    </th>

                    <th className="px-5 py-4" />
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {campaigns.map((campaign) => {
                    const eventName =
                      campaign.event?.title ||
                      campaign.event?.name ||
                      "Event";

                    return (
                      <tr
                        key={campaign.id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-5 py-5">
                          <Link
                            href={`/organizer/campaigns/${campaign.id}`}
                            className="font-semibold text-gray-900 hover:underline"
                          >
                            {campaign.name}
                          </Link>

                          <p className="mt-1 text-xs text-gray-500">
                            {String(campaign.objective || "ticket_sales").replace(
                              "_",
                              " "
                            )}
                          </p>
                        </td>

                        <td className="px-5 py-5 text-sm text-gray-700">
                          {eventName}
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                              String(campaign.status || "draft")
                            )}`}
                          >
                            {String(campaign.status || "draft")}
                          </span>
                        </td>

                        <td className="px-5 py-5 text-sm font-medium">
                          {formatCurrency(
                            Number(campaign.budget || 0)
                          )}
                        </td>

                        <td className="px-5 py-5 text-sm text-gray-600">
                          {formatDate(campaign.start_date)}
                          {" - "}
                          {formatDate(campaign.end_date)}
                        </td>

                        <td className="px-5 py-5 text-right">
                          <Link
                            href={`/organizer/campaigns/${campaign.id}`}
                            className="text-sm font-semibold hover:underline"
                          >
                            Manage
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}