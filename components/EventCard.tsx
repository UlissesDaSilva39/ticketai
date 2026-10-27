import Link from "next/link";
import type { Event } from "@/lib/types";
import EventCardActions from "./EventCardActions";
import { Bell, MapPin, Users } from "lucide-react";
import { CardSaveButton } from "@/components/wallet/CardSaveButton";

type EventArtist = { slug: string; name: string };
type EventVenue = { slug: string; name: string; city?: string };
type EventPromoter = { slug: string; name: string };

export function EventCard({
  event,
  dark = false,
  soldCount = 0,
  likeCount = 0,
  userLiked = false,
  followerCount = 0,
  userFollowing = false,
  artists = [],
  venue = null,
  promoter = null,
}: {
  event: Event;
  dark?: boolean;
  soldCount?: number;
  likeCount?: number;
  userLiked?: boolean;
  followerCount?: number;
  userFollowing?: boolean;
  artists?: EventArtist[];
  venue?: EventVenue | null;
  promoter?: EventPromoter | null;
}) {
  const firstTicket = event.ticket_types?.[0];
  const date = new Date(event.start_date);
  const isFeatured =
    event.featured_until && new Date(event.featured_until) > new Date();

  const capacity = (event.ticket_types || []).reduce(
    (sum, t) => sum + Number(t.quantity || 0),
    0
  );
  const remaining = Math.max(capacity - soldCount, 0);
  const soldPercent = capacity > 0 ? Math.min((soldCount / capacity) * 100, 100) : 0;
  const isSoldOut = capacity > 0 && soldCount >= capacity;
  const almostSoldOut = capacity > 0 && soldPercent >= 80 && !isSoldOut;

  return (
    <div className="group block relative">
      <CardSaveButton eventId={event.id} />
      <Link href={"/event/" + event.id} className="block">
        <div className="aspect-[4/5] bg-gray-100 overflow-hidden mb-3 relative">
          {event.hero_image ? (
            <img
              src={event.hero_image}
              alt=""
              aria-hidden="true"
              className={
                "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 " +
                (isSoldOut ? "opacity-60" : "")
              }
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              No image
            </div>
          )}
          {isSoldOut && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white">
              <div className="text-center">
                <p className="text-white text-4xl md:text-5xl font-bold uppercase tracking-wider" style={{ fontFamily: "var(--font-antonio)" }}>
                  SOLD OUT
                </p>
                <p className="text-white/90 text-sm mt-2 uppercase tracking-widest">
                  Join the waitlist below
                </p>
              </div>
            </div>
          )}
          {isFeatured && !isSoldOut && (
            <span className="absolute top-4 left-4 px-4 py-2 bg-[#00FF87] text-black text-sm font-bold rounded-full uppercase tracking-wider shadow-lg">
              Featured
            </span>
          )}
          {almostSoldOut && (
            <span className="absolute top-4 right-4 px-3 py-1.5 bg-yellow-400 text-black text-xs font-bold rounded-full uppercase tracking-wider">
              Almost Gone
            </span>
          )}
        </div>
      </Link>

      <Link href={"/event/" + event.id} className="block">
        <h3
          className={"font-bold text-2xl leading-none mb-2 tracking-tight uppercase " + (dark ? "text-white" : "text-black")}
          style={{ fontFamily: "var(--font-antonio)" }}
        >
          {event.title}
        </h3>
      </Link>

      <p className={"text-xs uppercase tracking-widest mb-1 " + (dark ? "text-gray-400" : "text-gray-500")}>
        {date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
      </p>

      {venue && (
        <p className={"text-xs uppercase tracking-widest mb-1 flex items-center gap-1 " + (dark ? "text-gray-400" : "text-gray-500")}>
          <MapPin className="h-3 w-3" />
          <Link href={"/venue/" + venue.slug} className="hover:underline">{venue.name}</Link>
          {venue.city && <span>, {venue.city}</span>}
        </p>
      )}

      {firstTicket && (
        <p className={"text-xs uppercase tracking-widest " + (dark ? "text-gray-400" : "text-gray-500")}>
          From Â£{Number(firstTicket.price).toFixed(2)}
        </p>
      )}

      {artists && artists.length > 0 && (
        <p className={"text-xs uppercase tracking-widest mt-1 flex flex-wrap items-center gap-1 " + (dark ? "text-gray-400" : "text-gray-500")}>
          <Users className="h-3 w-3" />
          <span>Feat.</span>
          {artists.slice(0, 3).map((a, i) => (
            <span key={a.slug}>
              <Link href={"/artist/" + a.slug} className="hover:underline">{a.name}</Link>
              {i < Math.min(2, artists.length - 1) ? "," : ""}
            </span>
          ))}
          {artists.length > 3 && <span>+ {artists.length - 3} more</span>}
        </p>
      )}

      {promoter && (
        <p className={"text-xs uppercase tracking-widest mt-1 " + (dark ? "text-gray-400" : "text-gray-500")}>
          Presenter:{" "}
          <Link href={"/promoters/" + promoter.slug} className="hover:underline">{promoter.name}</Link>
        </p>
      )}

      {capacity > 0 && (
        <div className="mt-3">
          <div className={"w-full h-1.5 rounded-full overflow-hidden " + (dark ? "bg-white/10" : "bg-gray-200")}>
            <div
              className={"h-full rounded-full transition-all " + (isSoldOut ? "bg-red-600" : almostSoldOut ? "bg-yellow-400" : "bg-[#00FF87]")}
              style={{ width: soldPercent + "%" }}
            />
          </div>
          <p className={"text-xs mt-1.5 " + (dark ? "text-gray-400" : "text-gray-500")}>
            {isSoldOut
              ? "Sold out Â· " + soldCount + " tickets sold"
              : remaining <= 10
                ? "Only " + remaining + " left"
                : remaining + " of " + capacity + " left"}
          </p>
        </div>
      )}

      {isSoldOut ? (
        <Link
          href={"/event/" + event.id + "#resale"}
          className="mt-3 inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
        >
          <Bell className="h-4 w-4" />
          <span>Join Waitlist</span>
        </Link>
      ) : (
        <div className="mt-3 flex gap-2">
          <Link
            href={"/event/" + event.id}
            className={"flex-1 text-center px-4 py-3 text-sm font-medium rounded-full transition-colors " + (dark ? "bg-[#00FF87] text-black hover:bg-[#00e67a]" : "bg-black text-white hover:bg-gray-800")}
          >
            Get Tickets
          </Link>
          {artists && artists.length > 0 && (
            <Link
              href={"/book/artist/" + artists[0].slug}
              className={"px-4 py-3 text-sm font-medium rounded-full border transition-colors " + (dark ? "border-white/30 text-white hover:border-white" : "border-gray-300 text-black hover:border-black")}
            >
              Book artist
            </Link>
          )}
        </div>
      )}

      <EventCardActions
        eventId={event.id}
        organizerId={event.organizer_id}
        audioUrl={event.preview_audio_url || null}
        initialLiked={userLiked}
        initialLikeCount={likeCount}
        initialFollowing={userFollowing}
        initialFollowerCount={followerCount}
      />
    </div>
  );
}