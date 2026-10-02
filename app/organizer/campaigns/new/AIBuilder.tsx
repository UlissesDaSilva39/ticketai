 "use client";

import { useState } from "react";

type AIResult = {
  audience: {
    location: string;
    ageMin: number;
    ageMax: number;
    interests: string[];
  };
  budget: {
    total: number;
    daily: number;
    reasoning: string;
  };
  channels: string[];
  concepts: Array<{
    headline: string;
    body: string;
    cta: string;
  }>;
  captions: string[];
  duration_days: number;
  expected_conversion_rate: number;
  reasoning: string;
};

type ApplyPayload = {
  location: string;
  ageMin: string;
  ageMax: string;
  interests: string;
  channels: string[];
  budget: string;
  dailyBudget: string;
};

export default function AIBuilder({
  eventId,
  onApply,
}: {
  eventId: string;
  onApply: (data: ApplyPayload) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AIResult | null>(null);

  async function generate() {
    if (!prompt.trim()) {
      setError("Describe your goal first");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/ai/campaign-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, eventId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setResult(data.result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  function apply() {
    console.log("APPLY CLICKED");
    console.log("result =", result);
    if (!result) {
      console.log("No result — bailing out");
      return;
    }
    const payload = {
      location: result.audience.location || "",
      ageMin: String(result.audience.ageMin ?? 18),
      ageMax: String(result.audience.ageMax ?? 65),
      interests: (result.audience.interests || []).join(", "),
      channels: result.channels || [],
      budget: String(result.budget.total ?? ""),
      dailyBudget: String(result.budget.daily ?? ""),
    };
    console.log("Payload =", payload);
    onApply(payload);
    console.log("onApply called");
  }

  return (
    <section className="rounded-xl border-2 border-black bg-white p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-2xl">🤖</span>
        <div>
          <h2 className="text-lg font-semibold">AI Campaign Builder</h2>
          <p className="text-sm text-gray-500">
            Describe your goal in plain English. We&apos;ll design the campaign.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={`Examples:\n• I need to sell 150 more tickets for my London house night in the next 2 weeks\n• Help me fill my venue on a Friday night\n• Boost sales for the final weekend`}
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black resize-none"
        />

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Powered by Google Gemini
          </div>
          <button
            type="button"
            onClick={generate}
            disabled={loading || !prompt.trim()}
            className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate campaign"}
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-4 rounded-lg bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Recommended campaign</h3>
              <button
                type="button"
                onClick={apply}
                className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Apply to form →
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border bg-white p-4">
                <p className="text-xs uppercase tracking-wider text-gray-500">Audience</p>
                <p className="mt-1 font-medium">
                  {result.audience.location || "—"} · {result.audience.ageMin}–{result.audience.ageMax}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  {result.audience.interests.join(" · ")}
                </p>
              </div>

              <div className="rounded-lg border bg-white p-4">
                <p className="text-xs uppercase tracking-wider text-gray-500">Budget</p>
                <p className="mt-1 font-medium">
                  £{result.budget.total} total · £{result.budget.daily}/day
                </p>
                <p className="mt-2 text-sm text-gray-600">{result.budget.reasoning}</p>
              </div>

              <div className="rounded-lg border bg-white p-4">
                <p className="text-xs uppercase tracking-wider text-gray-500">Channels</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {result.channels.map((c) => (
                    <span key={c} className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border bg-white p-4">
                <p className="text-xs uppercase tracking-wider text-gray-500">Forecast</p>
                <p className="mt-1 font-medium">
                  {result.duration_days} days · {result.expected_conversion_rate}% conv rate
                </p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-wider text-gray-500">Ad concepts</p>
              <div className="space-y-3">
                {result.concepts.map((c, i) => (
                  <div key={i} className="rounded-lg border bg-white p-4">
                    <p className="font-semibold">&ldquo;{c.headline}&rdquo;</p>
                    <p className="mt-2 text-sm text-gray-600">{c.body}</p>
                    <p className="mt-2 text-sm font-medium">{c.cta}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-wider text-gray-500">Social captions</p>
              <div className="space-y-2">
                {result.captions.map((c, i) => (
                  <div key={i} className="rounded-lg border bg-white p-3 text-sm">
                    {c}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-black p-4 text-white">
              <p className="text-xs uppercase tracking-wider opacity-70">Why this works</p>
              <p className="mt-1 text-sm">{result.reasoning}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}