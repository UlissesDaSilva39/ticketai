import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword") || "Festival";
  const API_KEY = process.env.TICKETMASTER_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: "API Key missing" }, { status: 401 });
  }

  try {
    const url = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + API_KEY
      + "&keyword=" + encodeURIComponent(keyword)
      + "&classificationName=music"
      + "&countryCode=GB"
      + "&segmentName=Music"
      + "&size=40"
      + "&sort=date,asc";

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Ticketmaster API failed: " + res.status);

    const data = await res.json();
    const events = data._embedded?.events || [];

    const seen = new Set<string>();
    const formatted = [];

    for (const event of events) {
      const name = (event.name || "").trim();
      if (!name) continue;

      const date = event.dates?.start?.localDate || "";
      const key = name.toLowerCase() + "|" + date;
      if (seen.has(key)) continue;
      seen.add(key);

      const image = event.images?.find((img: any) => img.ratio === "16_9" && img.width > 500)?.url
        || event.images?.[0]?.url
        || "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80";

      const venue = event._embedded?.venues?.[0];
      const venueName = venue?.name || "Location TBA";
      const city = venue?.city?.name || "UK";

      const priceRange = event.priceRanges?.[0];
      const priceMin = priceRange?.min ?? null;
      const currency = priceRange?.currency || "GBP";

      const dateObj = date ? new Date(date) : null;
      const formattedDate = dateObj
        ? dateObj.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })
        : "TBA";

      formatted.push({
        id: event.id,
        name: name,
        date: formattedDate,
        rawDate: date,
        venue: venueName,
        city: city,
        image: image,
        priceMin: priceMin,
        currency: currency,
        ticketUrl: event.url || null,
      });

      if (formatted.length >= 12) break;
    }

    return NextResponse.json({ data: formatted, count: formatted.length });
  } catch (error: any) {
    console.error("Festivals API Error:", error.message);
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
