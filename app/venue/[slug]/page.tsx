import { createServerSupabase } from "@/lib/supabase/server";
import { EventCard } from "@/components/EventCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Venue, Event } from "@/lib/types";
import FollowButton from "@/components/FollowButton";
import VenueAvailabilityCalendar from "@/components/venue/VenueAvailabilityCalendar";
import VenueFacilities from "@/components/venue/VenueFacilities";
import {
  MapPin,
  Users,
  Music,
  Calendar,
  Mail,
  Phone,
  Globe,
  Music2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabase();
  const { data: venue } = await supabase
    .from("venues")
    .select("name, description, hero_image, city")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!venue) return { title: "Venue not found" };
  const desc =
    venue.description ||
    "Events at " + venue.name + (venue.city ? ", " + venue.city : "") + ".";

  return {
    title: venue.name,
    description: desc,
    openGraph: {
      title: venue.name,
      description: desc,
      type: "website",
      images: venue.hero_image
        ? [{ url: venue.hero_image, width: 1200, height: 630 }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: venue.name,
      description: desc,
      images: venue.hero_image ? [venue.hero_image] : [],
    },
  };
}

export default async function VenuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServerSupabase();

  const { data: venue } = await supabase
    .from("venues")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!venue) return notFound();
  const v = venue as Venue;

  // All events at this venue
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("venue_id", v.id)
    .eq("status", "published")
    .order("start_date", { ascending: true });

  const allEvents = (events as Event[]) || [];

  const now = new Date();
  const upcomingEvents = allEvents.filter(
    (e) => new Date(e.start_date) >= now
  );
  const pastEvents = allEvents
    .filter((e) => new Date(e.start_date) < now)
    .slice(-4)
    .reverse();

  const eventIds = allEvents.map((e) => e.id);

  const soldMap: Record<string, number> = {};
  if (eventIds.length > 0) {
    const { data: tickets } = await supabase
      .from("tickets")
      .select("event_id")
      .in("event_id", eventIds)
      .neq("status", "cancelled");
    for (const t of tickets || []) {
      soldMap[t.event_id] = (soldMap[t.event_id] || 0) + 1;
    }
  }

  // Fallback availability — next 30 days, weekends only, except days with events
  const eventDaySet = new Set(
    allEvents.map((e) => new Date(e.start_date).toISOString().slice(0, 10))
  );
  const availableDates: string[] = [];
  for (let i = 0; i < 60; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const weekday = d.getDay(); // 0 Sun..6 Sat
    const isWeekend = weekday === 5 || weekday === 6; // Fri/Sat
    if (isWeekend && !eventDaySet.has(iso)) {
      availableDates.push(iso);
    }
  }

  const initials = (v.name || "?")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const likeCounts: Record<string, number> = {};
  const userLikes: Record<string, boolean> = {};
  const followerCounts: Record<string, number> = {};
  const userFollows: Record<string, boolean> = {};

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* COVER */}
        {v.hero_image && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={v.hero_image}
              alt={v.name + " cover"}
              className="w-full h-64 sm:h-80 object-cover"
            />
          </div>
        )}

        {/* HEADER */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-24 h-24 rounded-2xl bg-black text-white grid place-items-center text-2xl font-bold flex-shrink-0">
              {initials}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {v.name}
              </h1>

              {/* Chips */}
              <div className="flex flex-wrap gap-2 mt-3">
                {v.venue_type && (
                  <span className="px-3 py-1 text-xs font-medium bg-gray-100 border border-gray-200 rounded-full capitalize">
                    {v.venue_type}
                  </span>
                )}
                {v.city && (
                  <span className="px-3 py-1 text-xs font-medium bg-gray-100 border border-gray-200 rounded-full inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {v.city}
                    {v.country ? `, ${v.country}` : ""}
                  </span>
                )}
                {v.capacity && (
                  <span className="px-3 py-1 text-xs font-medium bg-gray-100 border border-gray-200 rounded-full inline-flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {v.capacity.toLocaleString()} capacity
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-wrap gap-3">
                <FollowButton
                  targetType="venue"
                  targetId={v.id}
                  initialCount={0}
                  label="Follow"
                  variant="dark"
                />
                {v.contact_email && (
                  <a
                    href={"mailto:" + v.contact_email}
                    className="px-5 py-2.5 border border-gray-300 text-sm font-medium rounded-full hover:bg-gray-50 transition inline-flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Message
                  </a>
                )}
                <a
                  href="#enquire"
                  className="px-5 py-2.5 border border-gray-300 text-sm font-medium rounded-full hover:bg-gray-50 transition"
                >
                  Enquire about booking
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-6">
            {/* ABOUT */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-3">About</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {v.description || "No description yet."}
              </p>
            </section>

            {/* AVAILABILITY — NEW */}
            <VenueAvailabilityCalendar availableDates={availableDates} />

            {/* FACILITIES — NEW */}
            <VenueFacilities facilities={null} />

            {/* UPCOMING EVENTS */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-lg font-semibold inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Upcoming events
                </h2>
                {upcomingEvents.length > 0 && (
                  <a
                    href="/events"
                    className="text-sm text-gray-500 hover:text-black"
                  >
                    See all
                  </a>
                )}
              </div>

              {upcomingEvents.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                  <Calendar className="mx-auto h-8 w-8 text-gray-400" />
                  <div className="mt-3 text-sm font-medium text-gray-900">
                    No upcoming events yet
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Follow {v.name} to get notified when new events are announced.
                  </p>
                  <a
                    href="/events"
                    className="mt-4 inline-block rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white hover:bg-gray-900 transition"
                  >
                    Explore events
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {upcomingEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      soldCount={soldMap[event.id] || 0}
                      likeCount={likeCounts[event.id] || 0}
                      userLiked={userLikes[event.id] || false}
                      followerCount={followerCounts[event.organizer_id] || 0}
                      userFollowing={userFollows[event.organizer_id] || false}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* PAST EVENTS — NEW */}
            {pastEvents.length > 0 && (
              <section className="bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4 inline-flex items-center gap-2">
                  <Music2 className="h-4 w-4" />
                  Past events
                </h2>
                <ul className="divide-y divide-gray-100">
                  {pastEvents.map((event) => (
                    <li key={event.id} className="py-3 flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <a
                          href={`/event/${event.id}`}
                          className="font-medium text-sm hover:underline"
                        >
                          {event.title}
                        </a>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(event.start_date).toLocaleDateString("en-GB", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-gray-500">
                        {soldMap[event.id] || 0} sold
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            <section className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Location
              </h3>
              <p className="text-sm inline-flex items-start gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                <span>
                  {v.address_line1 && <>{v.address_line1}<br /></>}
                  {v.address_line2 && <>{v.address_line2}<br /></>}
                  {v.city}
                  {v.postcode ? `, ${v.postcode}` : ""}
                  {v.country ? <><br />{v.country}</> : null}
                </span>
              </p>
            </section>

            {v.capacity && (
              <section className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Capacity
                </h3>
                <p className="text-sm inline-flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-gray-400" />
                  {v.capacity.toLocaleString()}
                  {v.standing_capacity && (
                    <span className="text-xs text-gray-500 ml-1">
                      ({v.standing_capacity.toLocaleString()} standing)
                    </span>
                  )}
                </p>
                {v.seated_capacity && (
                  <p className="text-xs text-gray-500 mt-1 ml-5">
                    {v.seated_capacity.toLocaleString()} seated
                  </p>
                )}
              </section>
            )}

            {/* CONTACT */}
            {(v.contact_email || v.contact_phone || v.website) && (
              <section className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Contact
                </h3>
                <ul className="space-y-2 text-sm">
                  {v.contact_email && (
                    <li>
                      <a
                        href={`mailto:${v.contact_email}`}
                        className="inline-flex items-center gap-2 hover:underline"
                      >
                        <Mail className="h-3.5 w-3.5 text-gray-400" />
                        {v.contact_email}
                      </a>
                    </li>
                  )}
                  {v.contact_phone && (
                    <li>
                      <a
                        href={`tel:${v.contact_phone}`}
                        className="inline-flex items-center gap-2 hover:underline"
                      >
                        <Phone className="h-3.5 w-3.5 text-gray-400" />
                        {v.contact_phone}
                      </a>
                    </li>
                  )}
                  {v.website && (
                    <li>
                      <a
                        href={v.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 hover:underline"
                      >
                        <Globe className="h-3.5 w-3.5 text-gray-400" />
                        Website
                      </a>
                    </li>
                  )}
                </ul>
              </section>
            )}

            {/* ENQUIRY */}
            <section
              id="enquire"
              className="bg-white border border-gray-200 rounded-2xl p-6"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Book this venue
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                Send an enquiry to the venue booking team.
              </p>
              {v.contact_email ? (
                <a
                  href={`mailto:${v.contact_email}?subject=Booking enquiry for ${v.name}`}
                  className="block w-full text-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 transition"
                >
                  Send enquiry
                </a>
              ) : (
                <p className="text-xs text-gray-500">
                  Contact details not available yet.
                </p>
              )}
            </section>

            {/* DETAILS */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Details
              </h3>
              <dl className="text-sm space-y-2">
                {v.venue_type && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Type</dt>
                    <dd className="capitalize">{v.venue_type}</dd>
                  </div>
                )}
                {v.city && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">City</dt>
                    <dd>{v.city}</dd>
                  </div>
                )}
                {v.capacity && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Capacity</dt>
                    <dd>{v.capacity.toLocaleString()}</dd>
                  </div>
                )}
              </dl>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
