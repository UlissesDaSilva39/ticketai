import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

type ChatMessage = { role: "system" | "user"; content: string };

async function callDeepSeek(
  apiKey: string,
  messages: ChatMessage[],
  json = false
): Promise<string> {
  const res = await fetch(DEEPSEEK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages,
      stream: false,
      ...(json ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("DeepSeek error:", res.status, text);
    throw new Error(`DeepSeek API error (${res.status})`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

type Filters = {
  city: string | null;
  keywords: string[];
  max_price: number | null;
  date_from: string | null;
  date_to: string | null;
};

type EventRow = {
  id: string;
  title: string;
  description: string | null;
  hero_image: string | null;
  start_date: string;
  ticket_types: { name: string; price: number | string }[] | null;
  venues: { name: string; city: string } | null;
};

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "DEEPSEEK_API_KEY is not set in .env.local" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    if (!message) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    const today = new Date().toISOString().slice(0, 10);

    // Step 1: understand the request as search filters
    let filters: Filters = {
      city: null,
      keywords: [],
      max_price: null,
      date_from: null,
      date_to: null,
    };

    try {
      const raw = await callDeepSeek(
        apiKey,
        [
          {
            role: "system",
            content: `Extract event search filters from the user's message. Today is ${today}. Respond with JSON only, in this exact shape: {"city": string|null, "keywords": string[], "max_price": number|null, "date_from": "YYYY-MM-DD"|null, "date_to": "YYYY-MM-DD"|null}. Keywords are genres, artists or event types (e.g. "house", "afrobeat", "comedy"). Use null or [] when not mentioned.`,
          },
          { role: "user", content: message },
        ],
        true
      );
      const parsed = JSON.parse(raw);
      filters = {
        city: typeof parsed.city === "string" ? parsed.city : null,
        keywords: Array.isArray(parsed.keywords)
          ? parsed.keywords.filter((k: unknown) => typeof k === "string")
          : [],
        max_price: typeof parsed.max_price === "number" ? parsed.max_price : null,
        date_from: typeof parsed.date_from === "string" ? parsed.date_from : null,
        date_to: typeof parsed.date_to === "string" ? parsed.date_to : null,
      };
    } catch (err) {
      console.error("Filter extraction failed, searching without filters", err);
    }

    // Step 2: search real events
    const supabase = await createClient();
    const { data } = await supabase
      .from("events")
      .select(
        "id, title, description, hero_image, start_date, ticket_types, venues:venue_id(name, city)"
      )
      .gte("start_date", new Date().toISOString())
      .order("start_date", { ascending: true })
      .limit(100);

    const all = (data || []) as unknown as EventRow[];

    const matches = all
      .filter((e) => {
        const lowest = e.ticket_types?.length
          ? Math.min(...e.ticket_types.map((t) => Number(t.price)))
          : null;
        const start = new Date(e.start_date).getTime();

        if (filters.city) {
          const c = filters.city.toLowerCase();
          if (!(e.venues?.city || "").toLowerCase().includes(c)) return false;
        }
        if (filters.max_price !== null && lowest !== null && lowest > filters.max_price) {
          return false;
        }
        if (filters.date_from && start < new Date(filters.date_from).getTime()) {
          return false;
        }
        if (filters.date_to && start > new Date(filters.date_to + "T23:59:59").getTime()) {
          return false;
        }
        if (filters.keywords.length) {
          const text = `${e.title} ${e.description || ""}`.toLowerCase();
          if (!filters.keywords.some((k) => text.includes(k.toLowerCase()))) {
            return false;
          }
        }
        return true;
      })
      .slice(0, 8);

    const events = matches.map((e) => ({
      id: e.id,
      title: e.title,
      date: e.start_date,
      venue: e.venues?.name || null,
      city: e.venues?.city || null,
      lowest_price: e.ticket_types?.length
        ? Math.min(...e.ticket_types.map((t) => Number(t.price)))
        : null,
      image: e.hero_image,
    }));

    // Step 3: explain the real results
    const answer = await callDeepSeek(apiKey, [
      {
        role: "system",
        content:
          "You are TicketAI, a friendly assistant for an event ticketing marketplace. Answer the user using ONLY the events in the provided JSON list. Never invent events, prices, dates or venues. If the list is empty, say no matching events were found and suggest broadening the search (different date, city or genre). Keep it short (2-5 sentences) and mention the best matches by name. Prices are in GBP.",
      },
      {
        role: "user",
        content: `User request: ${message}\n\nMatching events (JSON): ${JSON.stringify(events)}`,
      },
    ]);

    return NextResponse.json({ success: true, response: answer, events });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Something went wrong on the server." },
      { status: 500 }
    );
  }
}
