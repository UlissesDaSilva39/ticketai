import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Event } from "@/lib/types";
import ViewTracker from "@/components/ViewTracker";
import WaitlistButton from "@/components/WaitlistButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("title, description, hero_image")
    .eq("id", id)
    .single();

  if (!event) return { title: "Event not found" };

  const desc = event.description || "Get tickets on TicketAI.";

  return {
    title: event.title,
    description: desc,
    openGraph: {
      title: event.title,
      description: desc,
      type: "website",
      images: event.hero_image ? [{ url: event.hero_image, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: desc,
      images: event.hero_image ? [event.hero_image] : [],
    },
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*, venues:venue_id(name, slug, city)")
    .eq("id", id)
    .single();

  if (!event) return notFound();

  const e = event as Event & {
    venues: { name: string; slug: string; city: string } | null;
  };
  const startDate = new Date(e.start_date);
  const lowestPrice = e.ticket_types?.length
    ? Math.min(...e.ticket_types.map((t) => Number(t.price)))
    : 0;

  // Calculate total capacity and sold count
  const totalCapacity = (e.ticket_types || []).reduce(
    (sum, t) => sum + Number(t.quantity || 0),
    0
  );

  const { count: soldCount } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })
    .eq("event_id", id)
    .neq("status", "cancelled");

  const isSoldOut = totalCapacity > 0 && (soldCount || 0) >= totalCapacity;

  return (
    <div>
      <ViewTracker eventId={e.id} />
      <div className="relative h-[60vh] bg-gray-200">
        {e.hero_image && (
          <img src={e.hero_image} alt="" aria-hidden="true" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-none uppercase" style={{ fontFamily: "var(--font-antonio)" }}>
            {e.title}
          </h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center gap-4 mb-4 text-lg">
              <span className="font-medium">📅 {startDate.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
              <span>🕐 {startDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
            {e.venues && e.venues.slug && (
              <p className="text-sm uppercase tracking-widest text-gray-500 mb-8">
                📍 At <Link href={"/venue/" + e.venues.slug} className="text-black hover:underline">{e.venues.name}</Link>
                {e.venues.city ? " · " + e.venues.city : ""}
              </p>
            )}
            <h2 className="text-3xl font-bold mb-4 uppercase" style={{ fontFamily: "var(--font-antonio)" }}>About This Event</h2>
            <p className="text-gray-700 leading-relaxed">{e.description || "No description yet."}</p>
            <h2 className="text-3xl font-bold mt-12 mb-4 uppercase" style={{ fontFamily: "var(--font-antonio)" }}>Ticket Options</h2>
            <div className="space-y-3">
              {e.ticket_types?.map((t) => (
                <div key={t.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <p className="font-medium">{t.name}</p>
                  <p className="font-bold">£{Number(t.price).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {isSoldOut ? (
                <WaitlistButton eventId={e.id} />
              ) : (
                <div className="bg-gray-50 rounded-lg p-8">
                  <p className="text-sm text-gray-500 mb-2">From</p>
                  <p className="text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-antonio)" }}>£{lowestPrice.toFixed(2)}</p>
                  <Link href={"/checkout?event=" + e.id} className="block w-full py-4 bg-black text-white text-center font-medium rounded-full hover:bg-gray-800 transition-colors">
                    Get Tickets
                  </Link>
                  {totalCapacity > 0 && (
                    <p className="text-xs text-gray-500 text-center mt-3">
                      {(totalCapacity - (soldCount || 0))} of {totalCapacity} tickets remaining
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
