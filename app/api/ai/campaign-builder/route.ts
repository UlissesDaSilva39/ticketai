import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

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

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => null);
    const { prompt, eventId } = (body ?? {}) as {
      prompt?: string;
      eventId?: string;
    };

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt required" }, { status: 400 });
    }
    if (!eventId) {
      return NextResponse.json({ error: "eventId required" }, { status: 400 });
    }

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const { data: event } = await supabase
      .from("events")
      .select("title, description, start_date, ticket_types, venue_id")
      .eq("id", eventId)
      .single();

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    let city = "";
    if (event.venue_id) {
      const { data: venue } = await supabase
        .from("venues")
        .select("city")
        .eq("id", event.venue_id)
        .maybeSingle();
      if (venue?.city) city = venue.city;
    }

    const eventDate = event.start_date
      ? new Date(event.start_date).toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "unscheduled";

    const daysUntilEvent = event.start_date
      ? Math.max(
          0,
          Math.floor(
            (new Date(event.start_date).getTime() - Date.now()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : null;

    const ticketInfo =
      Array.isArray(event.ticket_types) && event.ticket_types.length > 0
        ? (event.ticket_types as Array<{ name: string; price: number; quantity?: number }>)
            .map((t) => `${t.name} at £${t.price}`)
            .join(", ")
        : "no ticket types defined";

    const systemPrompt = `You are a marketing strategist for a UK event ticketing platform called TicketAI.
You help promoters design campaigns that sell more tickets.

Always respond with a single JSON object. No preamble, no markdown, no explanation outside the JSON.

Required JSON shape:
{
  "audience": { "location": "string", "ageMin": number, "ageMax": number, "interests": ["string"] },
  "budget": { "total": number, "daily": number, "reasoning": "string" },
  "channels": ["Instagram","Facebook","Google","TikTok","Email","Organic"],
  "concepts": [
    { "headline": "string", "body": "string", "cta": "string" },
    { "headline": "string", "body": "string", "cta": "string" },
    { "headline": "string", "body": "string", "cta": "string" }
  ],
  "captions": ["string","string","string"],
  "duration_days": number,
  "expected_conversion_rate": number,
  "reasoning": "string"
}

Rules:
- budget.total must be a reasonable GBP number for the audience size and event type.
- budget.daily = budget.total / duration_days (rounded to nearest 5).
- channels must only contain values from the allowed list above.
- 3 concepts and 3 captions, all specific to this event.
- expected_conversion_rate is a percentage (e.g. 2.5 means 2.5%).`;

    const userPrompt = `Event: ${event.title}
${event.description ? "Description: " + event.description : ""}
City: ${city || "unknown"}
Date: ${eventDate}${daysUntilEvent !== null ? ` (${daysUntilEvent} days away)` : ""}
Tickets: ${ticketInfo}

Promoter's goal: "${prompt.trim()}"`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent(userPrompt);
    const text = result.response.text();

    let parsed: AIResult;
    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("AI returned invalid JSON");
      parsed = JSON.parse(match[0]);
    }

    return NextResponse.json({ result: parsed });
  } catch (err) {
    console.error("AI campaign builder error:", err);
    const message = err instanceof Error ? err.message : "Failed to generate";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}