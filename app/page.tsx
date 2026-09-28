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
  const now = new Date();

  const featured = allEvents.filter(
    (e) => e.featured_until && new Date(e.featured_until) > now
  );
  const nonFeatured = allEvents.filter(
    (e) => !e.featured_until || new Date(e.featured_until) <= now
  );
  const liveStreams = nonFeatured.filter((e) => e.event_type === "live-stream");
  const inPerson = nonFeatured.filter((e) => e.event_type !== "live-stream");

  return (
    <div>
      <section className="bg-black text-white px-4 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold leading-[0.85] tracking-tighter uppercase mb-12" style={{ fontFamily: "var(--font-antonio)" }}>
            FIND
            <br />
            YOUR NEXT
            <br />
            EVENT
          </h1>

          {featured.length > 0 ? (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-[#00FF87] text-black text-xs font-bold rounded-full uppercase tracking-widest">Featured</span>
                <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight" style={{ fontFamily: "var(--font-antonio)" }}>
                  Don&apos;t Miss These
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {featured.map((event) => (
                  <EventCard key={event.id} event={event} dark />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-lg text-gray-400 max-w-xl">
              AI-powered discovery. Transparent pricing. Zero hassle.
            </p>
          )}
        </div>
      </section>

      {liveStreams.length > 0 && (
        <section className="px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 uppercase tracking-tight" style={{ fontFamily: "var(--font-antonio)" }}>
              LIVE
              <br />
              STREAMS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {liveStreams.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 uppercase tracking-tight" style={{ fontFamily: "var(--font-antonio)" }}>
            UPCOMING
            <br />
            EVENTS
          </h2>
          {inPerson.length === 0 ? (
            <p className="text-gray-500">No events yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
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
