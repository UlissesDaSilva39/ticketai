"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Campaign = {
  id: string;
  name: string;
  event_id: string;
  objective: string;
  status: string;
  budget: number;
  daily_budget: number | null;
  audience: {
    location?: string;
    ageMin?: number;
    ageMax?: number;
    interests?: string[];
  };
  channels: string[];
  start_date: string | null;
  end_date: string | null;
  tracking_code: string;
  clicks: number;
  conversions: number;
  revenue: number;
  event?: {
    id: string;
    title?: string;
    name?: string;
  } | null;
};

const channelOptions = [
  "Instagram",
  "Facebook",
  "Google",
  "TikTok",
  "Email",
  "Organic",
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(Number(value || 0));
}

function formatDate(value: string | null) {
  if (!value) return "-";

  return new Date(value).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();

  const campaignId = String(params.id);

  const [campaign, setCampaign] =
    useState<Campaign | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState("");
  const [objective, setObjective] =
    useState("ticket_sales");
  const [status, setStatus] = useState("draft");
  const [budget, setBudget] = useState("");
  const [dailyBudget, setDailyBudget] = useState("");

  const [location, setLocation] = useState("");
  const [ageMin, setAgeMin] = useState("18");
  const [ageMax, setAgeMax] = useState("65");
  const [interests, setInterests] = useState("");

  const [channels, setChannels] = useState<string[]>(
    []
  );

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    async function loadCampaign() {
      try {
        const response = await fetch(
          `/api/organizer/campaigns/${campaignId}`,
          { cache: "no-store" }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load campaign"
          );
        }

        const item = data.campaign as Campaign;

        setCampaign(item);

        setName(item.name || "");
        setObjective(
          item.objective || "ticket_sales"
        );
        setStatus(item.status || "draft");
        setBudget(String(item.budget ?? ""));
        setDailyBudget(
          item.daily_budget === null
            ? ""
            : String(item.daily_budget ?? "")
        );

        const audience = item.audience || {};

        setLocation(audience.location || "");
        setAgeMin(
          String(audience.ageMin ?? 18)
        );
        setAgeMax(
          String(audience.ageMax ?? 65)
        );
        setInterests(
          (audience.interests || []).join(", ")
        );

        setChannels(item.channels || []);

        if (item.start_date) {
          setStartDate(
            new Date(item.start_date)
              .toISOString()
              .slice(0, 16)
          );
        }

        if (item.end_date) {
          setEndDate(
            new Date(item.end_date)
              .toISOString()
              .slice(0, 16)
          );
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load campaign"
        );
      } finally {
        setLoading(false);
      }
    }

    loadCampaign();
  }, [campaignId]);

  function toggleChannel(channel: string) {
    setChannels((current) =>
      current.includes(channel)
        ? current.filter((item) => item !== channel)
        : [...current, channel]
    );
  }

  async function saveCampaign() {
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const response = await fetch(
        `/api/organizer/campaigns/${campaignId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            objective,
            status,
            budget: Number(budget),
            dailyBudget:
              dailyBudget === ""
                ? null
                : Number(dailyBudget),
            audience: {
              location,
              ageMin: Number(ageMin),
              ageMax: Number(ageMax),
              interests: interests
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            },
            channels,
            startDate: startDate
              ? new Date(startDate).toISOString()
              : null,
            endDate: endDate
              ? new Date(endDate).toISOString()
              : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save campaign"
        );
      }

      setCampaign((current) =>
        current
          ? {
              ...current,
              ...data.campaign,
            }
          : data.campaign
      );

      setSaved(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save campaign"
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteCampaign() {
    const confirmed = window.confirm(
      "Delete this campaign? This cannot be undone."
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(
        `/api/organizer/campaigns/${campaignId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete campaign"
        );
      }

      router.push("/organizer/campaigns");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete campaign"
      );
      setDeleting(false);
    }
  }

  const campaignUrl = useMemo(() => {
    if (!campaign) return "";

    if (typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}/event/${campaign.event_id}?campaign=${campaign.tracking_code}`;
  }, [campaign]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-6xl">
          Loading campaign...
        </div>
      </main>
    );
  }

  if (!campaign) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl border bg-white p-8">
            Campaign not found.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link
            href="/organizer/campaigns"
            className="text-sm text-gray-500 hover:text-black"
          >
            Back to Campaigns
          </Link>
        </div>

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <p className="text-sm text-gray-500">
              Campaign
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              {campaign.name}
            </h1>

            <p className="mt-2 text-gray-600">
              {campaign.event?.title ||
                campaign.event?.name ||
                "Event"}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={saveCampaign}
              disabled={saving}
              className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {saved && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
            Campaign saved successfully.
          </div>
        )}

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">
              Budget
            </p>

            <p className="mt-2 text-2xl font-bold">
              {formatCurrency(
                Number(campaign.budget || 0)
              )}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">
              Clicks
            </p>

            <p className="mt-2 text-2xl font-bold">
              {campaign.clicks || 0}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">
              Conversions
            </p>

            <p className="mt-2 text-2xl font-bold">
              {campaign.conversions || 0}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">
              Revenue
            </p>

            <p className="mt-2 text-2xl font-bold">
              {formatCurrency(
                Number(campaign.revenue || 0)
              )}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-xl border bg-white p-6">
              <h2 className="text-lg font-semibold">
                Campaign Settings
              </h2>

              <div className="mt-5 grid gap-5">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Campaign name
                  </label>

                  <input
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    className="w-full rounded-lg border px-4 py-3"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Objective
                    </label>

                    <select
                      value={objective}
                      onChange={(e) =>
                        setObjective(e.target.value)
                      }
                      className="w-full rounded-lg border bg-white px-4 py-3"
                    >
                      <option value="ticket_sales">
                        Ticket Sales
                      </option>

                      <option value="traffic">
                        Website Traffic
                      </option>

                      <option value="awareness">
                        Awareness
                      </option>

                      <option value="engagement">
                        Engagement
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Status
                    </label>

                    <select
                      value={status}
                      onChange={(e) =>
                        setStatus(e.target.value)
                      }
                      className="w-full rounded-lg border bg-white px-4 py-3"
                    >
                      <option value="draft">
                        Draft
                      </option>

                      <option value="active">
                        Active
                      </option>

                      <option value="paused">
                        Paused
                      </option>

                      <option value="completed">
                        Completed
                      </option>

                      <option value="cancelled">
                        Cancelled
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Total budget GBP
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={budget}
                      onChange={(e) =>
                        setBudget(e.target.value)
                      }
                      className="w-full rounded-lg border px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Daily budget GBP
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={dailyBudget}
                      onChange={(e) =>
                        setDailyBudget(e.target.value)
                      }
                      className="w-full rounded-lg border px-4 py-3"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl border bg-white p-6">
              <h2 className="text-lg font-semibold">
                Audience
              </h2>

              <div className="mt-5 grid gap-5">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Location
                  </label>

                  <input
                    value={location}
                    onChange={(e) =>
                      setLocation(e.target.value)
                    }
                    className="w-full rounded-lg border px-4 py-3"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Minimum age
                    </label>

                    <input
                      type="number"
                      value={ageMin}
                      onChange={(e) =>
                        setAgeMin(e.target.value)
                      }
                      className="w-full rounded-lg border px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Maximum age
                    </label>

                    <input
                      type="number"
                      value={ageMax}
                      onChange={(e) =>
                        setAgeMax(e.target.value)
                      }
                      className="w-full rounded-lg border px-4 py-3"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Interests
                  </label>

                  <input
                    value={interests}
                    onChange={(e) =>
                      setInterests(e.target.value)
                    }
                    className="w-full rounded-lg border px-4 py-3"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-xl border bg-white p-6">
              <h2 className="text-lg font-semibold">
                Channels
              </h2>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {channelOptions.map((channel) => (
                  <label
                    key={channel}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border p-4"
                  >
                    <input
                      type="checkbox"
                      checked={channels.includes(channel)}
                      onChange={() =>
                        toggleChannel(channel)
                      }
                    />

                    <span className="text-sm font-medium">
                      {channel}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className="rounded-xl border bg-white p-6">
              <h2 className="text-lg font-semibold">
                Schedule
              </h2>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Start
                  </label>

                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) =>
                      setStartDate(e.target.value)
                    }
                    className="w-full rounded-lg border px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    End
                  </label>

                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) =>
                      setEndDate(e.target.value)
                    }
                    className="w-full rounded-lg border px-4 py-3"
                  />
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-xl border bg-white p-6">
              <h2 className="text-lg font-semibold">
                Campaign Tracking
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Unique campaign code:
              </p>

              <div className="mt-2 rounded-lg bg-gray-100 p-3 font-mono text-sm break-all">
                {campaign.tracking_code}
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Campaign URL:
              </p>

              <div className="mt-2 rounded-lg bg-gray-100 p-3 text-xs break-all">
                {campaignUrl || "-"}
              </div>

              <p className="mt-3 text-xs text-gray-500">
                This campaign parameter provides the
                foundation for future click and conversion
                attribution.
              </p>
            </section>

            <section className="rounded-xl border bg-white p-6">
              <h2 className="text-lg font-semibold">
                Campaign Dates
              </h2>

              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">
                    Start
                  </p>

                  <p className="font-medium">
                    {formatDate(campaign.start_date)}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">
                    End
                  </p>

                  <p className="font-medium">
                    {formatDate(campaign.end_date)}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-red-200 bg-white p-6">
              <h2 className="font-semibold text-red-700">
                Danger Zone
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Deleting a campaign permanently removes
                its campaign configuration.
              </p>

              <button
                type="button"
                onClick={deleteCampaign}
                disabled={deleting}
                className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Campaign"}
              </button>
            </section>
          </div>
        </div>

        <div className="mt-8">
          
        </div>
      </div>
    </main>
  );
}

