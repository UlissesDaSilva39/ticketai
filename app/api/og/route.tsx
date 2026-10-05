import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "edge";

function priceFrom(types: Array<{ price: number }> | null) {
  if (!types || types.length === 0) return null;
  return Math.min(...types.map((t) => Number(t.price)));
}

function formatDate(value: string | null) {
  if (!value) return "Date TBC";
  return new Date(value).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function GET(req: NextRequest) {
  const eventId = req.nextUrl.searchParams.get("event");
  if (!eventId) {
    return new Response("Missing event param", { status: 400 });
  }

  const supabase = await createServerSupabase();
  const { data: event } = await supabase
    .from("events")
    .select("title, start_date, hero_image, ticket_types, description")
    .eq("id", eventId)
    .maybeSingle();

  if (!event) {
    return new Response("Event not found", { status: 404 });
  }

  const price = priceFrom(event.ticket_types);
  const priceLabel = price !== null ? "From £" + price.toFixed(2) : "";
  const dateLabel = formatDate(event.start_date);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#000000",
          position: "relative",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {event.hero_image && (
          <img
            src={event.hero_image}
            alt=""
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.55,
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.2) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 48,
            left: 64,
            display: "flex",
            alignItems: "center",
            color: "#ffffff",
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          TICKETAI
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 64,
            left: 64,
            right: 64,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              color: "#ffffff",
              fontSize: 78,
              fontWeight: 900,
              lineHeight: 0.95,
              textTransform: "uppercase",
              letterSpacing: -1,
              marginBottom: 24,
            }}
          >
            {event.title.length > 50 ? event.title.slice(0, 50) + "…" : event.title}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              color: "#ffffff",
              fontSize: 30,
            }}
          >
            <span>{dateLabel}</span>
            {priceLabel && (
              <>
                <span style={{ color: "#00FF87" }}>·</span>
                <span style={{ color: "#00FF87", fontWeight: 700 }}>{priceLabel}</span>
              </>
            )}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}