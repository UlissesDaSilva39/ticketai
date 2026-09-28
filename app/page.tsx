import { createClient } from "@/lib/supabase/server";
import { EventCard } from "@/components/EventCard";
import type { Event } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .order("start_date", { ascending: true });

  const allEvents = (events as Event[]) || [];
  const liveStreams = allEvents.filter((e) => e.event_type === "live-stream");
  const inPerson = allEvents.filter((e) => e.event_type !== "live-stream");

  return (
    <div>
      <section className="bg-black text-white py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h1
            className="text-6xl md:text-8xl font-bold leading-none tracking-tight"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            FIND YOUR
            <br />
            NEXT EVENT
          </h1>
          <p className="mt-6 text-lg text-gray-300 max-w-xl">
            AI-powered discovery. Transparent pricing. Zero hassle.
          </p>
        </div>
      </section>

      {liveStreams.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2
              className="text-4xl font-bold mb-8"
              style={{ fontFamily: "var(--font-antonio)" }}
            >
              LIVE STREAMS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {liveStreams.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-4xl font-bold mb-8"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            UPCOMING EVENTS
          </h2>
          {inPerson.length === 0 ? (
            <p className="text-gray-500">
              No events yet. Add some in Supabase Table Editor.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {inPerson.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}