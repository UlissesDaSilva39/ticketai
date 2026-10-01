import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

type SuggestedAudience = {
  location: string;
  ageMin: number;
  ageMax: number;
  interests: string[];
  channels: string[];
  reasoning: string[];
};

const CITY_KEYWORDS: Record<string, string> = {
  london: "London, UK",
  manchester: "Manchester, UK",
  birmingham: "Birmingham, UK",
  leeds: "Leeds, UK",
  liverpool: "Liverpool, UK",
  bristol: "Bristol, UK",
  glasgow: "Glasgow, UK",
  edinburgh: "Edinburgh, UK",
  cardiff: "Cardiff, UK",
  brighton: "Brighton, UK",
};

const GENRE_INTERESTS: Array<{ match: string[]; interests: string[] }> = [
  { match: ["house"], interests: ["House music", "Electronic music", "Nightlife", "Clubbing"] },
  { match: ["techno"], interests: ["Techno", "Electronic music", "Warehouse", "Nightlife"] },
  { match: ["hip hop", "hip-hop", "rap"], interests: ["Hip-Hop", "Rap", "Urban music", "Nightlife"] },
  { match: ["jazz"], interests: ["Jazz", "Live music", "Brunch"] },
  { match: ["comedy", "stand up", "stand-up"], interests: ["Comedy", "Stand-up", "Nightlife"] },
  { match: ["football", "soccer", "match"], interests: ["Football", "Sports", "Live events"] },
  { match: ["festival"], interests: ["Festivals", "Live music", "Outdoor events"] },
  { match: ["drag", "cabaret"], interests: ["Cabaret", "Drag", "Nightlife"] },
];

function inferAge(text: string) {
  const t = text.toLowerCase();
  if (/(family|kids|children|child)/.test(t)) return { ageMin: 25, ageMax: 55, reason: "Family-friendly event -> 25-55" };
  if (/(house|techno|warehouse|rave|club|night|dj)/.test(t)) return { ageMin: 18, ageMax: 34, reason: "Club / dance event -> 18-34" };
  if (/(festival|concert|live)/.test(t)) return { ageMin: 18, ageMax: 45, reason: "Live event -> 18-45" };
  return { ageMin: 18, ageMax: 45, reason: "Default range for general audiences" };
}

function inferInterests(text: string) {
  const t = text.toLowerCase();
  const found: string[] = [];
  for (const g of GENRE_INTERESTS) {
    if (g.match.some((m) => t.includes(m))) found.push(...g.interests);
  }
  const unique = Array.from(new Set(found)).slice(0, 8);
  if (unique.length > 0) return { interests: unique, reason: "Interests matched from event title/description" };
  return { interests: ["Live events", "Music", "Social events"], reason: "No genre keywords -> using generic event interests" };
}

function inferChannels(city: string, ageMin: number, ageMax: number) {
  const channels = ["Instagram", "Facebook", "Email", "Organic"];
  const reasons: string[] = [];
  const metro = ["london", "manchester", "birmingham", "glasgow", "leeds"];
  if (metro.some((m) => city.toLowerCase().includes(m))) { channels.push("Google"); reasons.push("Major UK city -> Google Ads recommended"); }
  if (ageMax <= 30) { channels.push("TikTok"); reasons.push("Young demographic -> TikTok recommended"); }
  return { channels, reason: reasons.join(" | ") || "Standard channel mix" };
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { eventId } = (body ?? {}) as { eventId?: string };
  if (!eventId) return NextResponse.json({ error: "eventId required" }, { status: 400 });

  const supabase = await createServerSupabase();
  const { data: event, error: evErr } = await supabase
    .from("events")
    .select("id, title, description, venue_id")
    .eq("id", eventId)
    .single();
  if (evErr || !event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

  let city = "";
  if (event.venue_id) {
    const { data: venue } = await supabase.from("venues").select("city").eq("id", event.venue_id).maybeSingle();
    if (venue?.city) city = venue.city;
  }
  const combined = ((event.title || "") + " " + (event.description || "")).trim();
  if (!city) {
    const t = combined.toLowerCase();
    for (const [key, label] of Object.entries(CITY_KEYWORDS)) {
      if (t.includes(key)) { city = label; break; }
    }
  }

  const age = inferAge(combined);
  const interests = inferInterests(combined);
  const channels = inferChannels(city, age.ageMin, age.ageMax);

  const reasoning: string[] = [];
  reasoning.push(city ? ("Location inferred: " + city) : "Location not detected -> leaving blank");
  reasoning.push(age.reason);
  reasoning.push(interests.reason);
  reasoning.push(channels.reason);

  const suggestion: SuggestedAudience = {
    location: city,
    ageMin: age.ageMin,
    ageMax: age.ageMax,
    interests: interests.interests,
    channels: channels.channels,
    reasoning,
  };

  return NextResponse.json({ suggestion });
}
