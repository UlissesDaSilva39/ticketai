import { Suspense } from "react";
import { createServerSupabase } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Event } from "@/lib/types";
import ViewTracker from "@/components/ViewTracker";
import CheckoutLink from "@/components/CheckoutLink";
import WaitlistButton from "@/components/WaitlistButton";
import FollowButton from "@/components/FollowButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const supabase = await createServerSupabase();

  const { data: event } = await supabase
    .from("events")
    .select("title, description, hero_image")
    .eq("id", id)
    .single();

  if (!event) {
    return {
      title: "Event not found",
    };
  }

  const desc = event.description || "Get tickets on TicketAI.";

  return {
    title: event.title,
    description: desc,
    openGraph: {
      title: event.title,
      description: desc,
      type: "website",
      images: event.hero_image
        ? [
            {
              url: event.hero_image,
              width: 1200,
              height: 630,
            },
          ]
        : [],
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

  const supabase = await createServerSupabase();

  const { data: event } = await supabase
    .from("events")
    .select("*, venues:venue_id(name, slug, city)")
    .eq("id", id)
    .single();

  if (!event) {
    return notFound();
  }

  const e = event as Event & {
    venues: {
      name: string;
      slug: string;
      city: string;
    } | null;
  };

  const startDate = new Date(e.start_date);

  const ticketTypes = Array.isArray(e.ticket_types)
    ? e.ticket_types
    : [];

  const lowestPrice =
    ticketTypes.length > 0
      ? Math.min(...ticketTypes.map((t) => Number(t.price || 0)))
      : 0;

  const totalCapacity = ticketTypes.reduce(
    (sum, t) => sum + Number(t.quantity || 0),
    0
  );

  const { count: soldCount } = await supabase
    .from("tickets")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("event_id", id)
    .neq("status", "cancelled");

  const sold = soldCount || 0;

  const remainingTickets = Math.max(totalCapacity - sold, 0);

  const isSoldOut =
    totalCapacity > 0 && sold >= totalCapacity;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { count: followerCount } = await supabase
    .from("follows")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("organizer_id", e.organizer_id);

  let userFollowing = false;

  if (user) {
    const { data: follow } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("organizer_id", e.organizer_id)
      .maybeSingle();

    userFollowing = !!follow;
  }

  return (
    <div>
      <Suspense fallback={null}><ViewTracker eventId={e.id} /></Suspense>

      <div className="relative h-[60vh] bg-gray-200">
        {e.hero_image && (
          <img
            src={e.hero_image}
            alt={e.title}
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <h1
            className="text-5xl md:text-7xl font-bold text-white leading-none uppercase"
            style={{
              fontFamily: "var(--font-antonio)",
            }}
          >
            {e.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <FollowButton targetType="promoter" targetId={e.organizer_id} initialCount={0} label="Follow organizer" variant="light" />

            {e.preview_audio_url && (
              <a
                href={e.preview_audio_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00FF87] text-black text-sm font-medium rounded-full hover:bg-[#00e67a]"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play Preview
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center gap-4 mb-8 text-lg">
              <span className="font-medium">
                {startDate.toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>

              {e.venues && (
                <span>
                  At{" "}
                  <Link
                    href={"/venue/" + e.venues.slug}
                    className="text-black hover:underline"
                  >
                    {e.venues.name}
                  </Link>
                  {e.venues.city ? " · " + e.venues.city : ""}
                </span>
              )}
            </div>

            <h2
              className="text-3xl font-bold mb-4 uppercase"
              style={{
                fontFamily: "var(--font-antonio)",
              }}
            >
              About This Event
            </h2>

            <p className="text-gray-700 leading-relaxed">
              {e.description || "No description yet."}
            </p>

            <h2
              className="text-3xl font-bold mt-12 mb-4 uppercase"
              style={{
                fontFamily: "var(--font-antonio)",
              }}
            >
              Ticket Options
            </h2>

            <div className="space-y-3">
              {ticketTypes.map((t) => (
                <div
                  key={t.name}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <p className="font-medium">{t.name}</p>

                  <p className="font-bold">
                    £{Number(t.price || 0).toFixed(2)}
                  </p>
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
                  <p className="text-sm text-gray-500 mb-2">
                    From
                  </p>

                  <p
                    className="text-5xl font-bold mb-6"
                    style={{
                      fontFamily: "var(--font-antonio)",
                    }}
                  >
                    £{lowestPrice.toFixed(2)}
                  </p>

                  <Suspense fallback={null}>
  <CheckoutLink
    eventId={e.id}
    className="block w-full py-4 bg-black text-white text-center font-medium rounded-full hover:bg-gray-800 transition-colors"
  >
    Get Tickets
  </CheckoutLink>
</Suspense>

                  {totalCapacity > 0 && (
                    <p className="text-xs text-gray-500 text-center mt-3">
                      {remainingTickets} of {totalCapacity} tickets
                      remaining
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








