 "use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AIBuilder from "./AIBuilder";

type EventItem = {
  id: string;
  title?: string;
  name?: string;
  date?: string;
  event_date?: string;
};

const channelOptions = [
  "Instagram",
  "Facebook",
  "Google",
  "TikTok",
  "Email",
  "Organic",
];

export default function NewCampaignPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [eventId, setEventId] = useState(
    searchParams.get("event") || ""
  );

  const [objective, setObjective] =
    useState("ticket_sales");

  const [budget, setBudget] = useState("500");
  const [dailyBudget, setDailyBudget] = useState("50");

  const [location, setLocation] = useState("");
  const [ageMin, setAgeMin] = useState("18");
  const [ageMax, setAgeMax] = useState("65");
  const [interests, setInterests] = useState("");

  const [channels, setChannels] = useState<string[]>([
    "Instagram",
    "Facebook",
  ]);

  const [suggesting, setSuggesting] = useState(false);
  const [suggestionReasoning, setSuggestionReasoning] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await fetch(
          "/api/organizer/campaigns/events",
          { cache: "no-store" }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load events"
          );
        }

        setEvents(data.events || []);

        if (
          !eventId &&
          data.events &&
          data.events.length > 0
        ) {
          setEventId(data.events[0].id);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load events"
        );
      } finally {
        setLoadingEvents(false);
      }
    }

    loadEvents();
  }, [eventId]);

  async function suggestAudience() {
    if (!eventId) {
      setError("Pick an event first");
      return;
    }
    setSuggesting(true);
    setError("");
    setSuggestionReasoning([]);
    try {
      const res = await fetch("/api/organizer/audience/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      const s = data.suggestion;
      setLocation(s.location || "");
      setAgeMin(String(s.ageMin));
      setAgeMax(String(s.ageMax));
      setInterests((s.interests || []).join(", "));
      setChannels(s.channels || []);
      setSuggestionReasoning(s.reasoning || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to suggest audience");
    } finally {
      setSuggesting(false);
    }
  }

  function toggleChannel(channel: string) {
    setChannels((current) =>
      current.includes(channel)
        ? current.filter((item) => item !== channel)
        : [...current, channel]
    );
  }

  function handleApplyAI(data: {
    location: string;
    ageMin: string;
    ageMax: string;
    interests: string;
    channels: string[];
    budget: string;
    dailyBudget: string;
  }) {
    setLocation(data.location);
    setAgeMin(data.ageMin);
    setAgeMax(data.ageMax);
    setInterests(data.interests);
    setChannels(data.channels);
    if (data.budget) setBudget(data.budget);
    if (data.dailyBudget) setDailyBudget(data.dailyBudget);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      if (!name.trim()) {
        throw new Error("Enter a campaign name");
      }

      if (!eventId) {
        throw new Error("Select an event");
      }

      const response = await fetch(
        "/api/organizer/campaigns",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            eventId,
            objective,
            status: "draft",
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
          data.error || "Failed to create campaign"
        );
      }

      router.push(
        `/organizer/campaigns/${data.campaign.id}`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create campaign"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/organizer/campaigns"
          className="text-sm text-gray-500 hover:text-black"
        >
          Back to Campaigns
        </Link>

        <div className="mt-4 mb-8">
          <h1 className="text-3xl font-bold">
            Create Campaign
          </h1>

          <p className="mt-2 text-gray-600">
            Build a campaign around one of your TicketAI
            events.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {eventId && (
          <div className="mb-6">
            <AIBuilder eventId={eventId} onApply={handleApplyAI} />
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <section className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold">
              Campaign Basics
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
                  placeholder="October Ticket Sales Campaign"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Event
                </label>

                <select
                  value={eventId}
                  onChange={(e) =>
                    setEventId(e.target.value)
                  }
                  disabled={loadingEvents}
                  className="w-full rounded-lg border px-4 py-3 bg-white"
                >
                  <option value="">
                    {loadingEvents
                      ? "Loading events..."
                      : "Select an event"}
                  </option>

                  {events.map((event) => (
                    <option
                      key={event.id}
                      value={event.id}
                    >
                      {event.title ||
                        event.name ||
                        "Untitled Event"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Objective
                </label>

                <select
                  value={objective}
                  onChange={(e) =>
                    setObjective(e.target.value)
                  }
                  className="w-full rounded-lg border px-4 py-3 bg-white"
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
            </div>
          </section>

          <section className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold">
              Budget
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
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
          </section>

          <section className="rounded-xl border bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Audience</h2>
              <button
                type="button"
                onClick={suggestAudience}
                disabled={suggesting}
                className="rounded-lg border border-black px-4 py-2 text-sm font-medium hover:bg-black hover:text-white disabled:opacity-50"
              >
                {suggesting ? "Analysing..." : "Suggest audience"}
              </button>
            </div>

            {suggestionReasoning.length > 0 && (
              <ul className="mt-4 space-y-1 rounded-lg bg-gray-50 p-4 text-xs text-gray-600">
                {suggestionReasoning.map((r, i) => (
                  <li key={i}>- {r}</li>
                ))}
              </ul>
            )}

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
                  placeholder="London, UK"
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
                    min="13"
                    max="100"
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
                    min="13"
                    max="100"
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
                  placeholder="Afrobeats, concerts, nightlife"
                  className="w-full rounded-lg border px-4 py-3"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Separate interests with commas.
                </p>
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
                  className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-gray-50"
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
              Campaign Schedule
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

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/organizer/campaigns"
              className="rounded-lg border px-5 py-3 text-center text-sm font-semibold"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving
                ? "Creating..."
                : "Create Campaign"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}