import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

async function getFeaturedNames(): Promise<string[]> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );
    const { data } = await supabase
      .from("featured_placements")
      .select("artist_name")
      .gt("ends_at", new Date().toISOString())
      .eq("payment_status", "paid")
      .in("placement_type", ["music_page", "both"]);
    return (data || []).map((row: any) => String(row.artist_name).toLowerCase());
  } catch {
    return [];
  }
}

function extractArtistName(eventName: string): string | null {
  if (!eventName) return null;
  let name = eventName.trim();
  const seps = [" - ", " | ", " Live at ", " at The ", " at "];
  for (const sep of seps) { if (name.includes(sep)) name = name.split(sep)[0].trim(); }
  if (name.includes("-")) {
    const parts = name.split("-");
    if (parts.length > 1 && parts[0].trim().length >= 2) name = parts[0].trim();
  }
  const ci = name.indexOf(":");
  if (ci > 0 && ci < 40) name = name.substring(0, ci).trim();
  name = name.replace(/\s+(19|20)\d{2}\s*$/, "").trim();
  if (name.length < 2) return null;
  return name;
}

function isLikelyMusicArtist(name: string, genre: string): boolean {
  if (!name) return false;
  const lower = name.toLowerCase();
  const genreLower = (genre || "").toLowerCase();
  const exclude = ["tribute", "experience", "the show", "starring", "voyage", "parade", "symphonic", "family", "pantomime", "circus", "magic", "comedy", "season ticket", "entry", "dungeon", "tussauds", "wicked", "cirque", "strictly", "glastonbury", "an evening with", "festival", "country to country", "romeo", "juliet", "shakespeare", "the holiday", "premium ticket", "official ticket", "vip ticket", "children"];
  if (exclude.some((p) => lower.includes(p))) return false;
  if (genreLower.includes("children") || genreLower.includes("kids")) return false;
  return true;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("keyword") || searchParams.get("city") || "London";
  const API_KEY = process.env.TICKETMASTER_API_KEY;
  if (!API_KEY) return NextResponse.json({ error: "Ticketmaster API Key missing" }, { status: 401 });

  const featuredNames = await getFeaturedNames();

  try {
    const url = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + API_KEY
      + "&city=" + encodeURIComponent(city) + "&classificationName=music&size=50&sort=relevance,desc";
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Ticketmaster failed: " + res.status);

    const data = await res.json();
    const events = data._embedded?.events || [];
    const seen = new Set<string>();
    const artists: any[] = [];

    for (const event of events) {
      const name = extractArtistName(event.name || "");
      const genre = event.classifications?.[0]?.genre?.name || "Music";
      if (!name || !isLikelyMusicArtist(name, genre)) continue;
      const key = name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);

      const tmImage = event.images?.find((img: any) => img.ratio === "16_9" && img.width > 500)?.url || event.images?.[0]?.url || "";
      const venue = event._embedded?.venues?.[0];
      const eventDate = event.dates?.start?.localDate || "";
      const dateObj = eventDate ? new Date(eventDate) : null;
      const formattedDate = dateObj ? dateObj.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "TBA";
      const priceRange = event.priceRanges?.[0];
      const isFeatured = featuredNames.includes(name.toLowerCase());

      artists.push({
        id: event.id,
        name: name,
        genre: genre,
        image: tmImage,
        nextGig: { date: formattedDate, venue: venue?.name || "TBA", city: venue?.city?.name || city },
        priceMin: priceRange?.min ?? null,
        priceCurrency: priceRange?.currency || "GBP",
        ticketUrl: event.url || null,
        spotifyUrl: "https://open.spotify.com/search/" + encodeURIComponent(name),
        featured: isFeatured,
      });

      if (artists.length >= 12) break;
    }

    // Sort featured first
    artists.sort((a, b) => {
      const aF = a.featured ? 1 : 0;
      const bF = b.featured ? 1 : 0;
      return bF - aF;
    });

    return NextResponse.json({ artists, location: city, count: artists.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}