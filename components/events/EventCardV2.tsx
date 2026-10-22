import Link from "next/link";
import { ArrowRight, MapPin, Users, Verified, Flame, Clock, Ticket } from "@/components/icons";

type EventArtist = {
  slug: string;
  name: string;
};

type EventVenue = {
  slug: string;
  name: string;
  city?: string;
};

type EventPromoter = {
  slug: string;
  name: string;
};

export type EventV2 = {
  id: string;
  title: string;
  date: string;
  time?: string;
  doorsIn?: string;
  priceFrom?: number;
  currency?: string;
  soldOut?: boolean;
  verified?: boolean;
  editorsPick?: boolean;
  ticketsLeft?: number;
  percentSold?: number;
  goingCount?: number;
  friendsGoing?: number;
  photo?: string;
  genres?: string[];
  artists?: EventArtist[];
  venue?: EventVenue;
  promoter?: EventPromoter;
};

type Props = {
  event: EventV2;
  variant?: "default" | "compact" | "featured";
};

export function EventCardV2({ event, variant = "default" }: Props) {
  const isFeature = variant === "featured";
  const isCompact = variant === "compact";

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border bg-white transition hover:border-neutral-900 ${
        isFeature ? "border-neutral-300" : "border-neutral-200"
      }`}
    >
      {event.photo && !isCompact && (
        <Link href={`/event/${event.id}`} className="block aspect-[16/9] overflow-hidden bg-neutral-100">
          <img
            src={event.photo}
            alt={event.title}
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          />
        </Link>
      )}

      <div className={`flex flex-1 flex-col ${isCompact ? "p-3" : "p-5"}`}>
        <div className="flex items-start justify-between gap-2">
          <Link href={`/event/${event.id}`} className="min-w-0 flex-1">
            <h3
              className={`font-black tracking-tight group-hover:underline ${
                isFeature ? "text-xl" : isCompact ? "text-sm" : "text-lg"
              }`}
            >
              {event.title}
            </h3>
          </Link>

          <div className="flex shrink-0 gap-1">
            {event.verified && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                <Verified size={10} />
                VERIFIED
              </span>
            )}
            {event.editorsPick && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                EDITOR
              </span>
            )}
          </div>
        </div>

        {event.genres && event.genres.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {event.genres.slice(0, 3).map((g) => (
              <Link
                key={g}
                href={`/genre/${g.toLowerCase()}`}
                className="rounded-full border border-neutral-200 px-2 py-0.5 text-[10px] font-medium hover:border-neutral-900"
              >
                {g}
              </Link>
            ))}
          </div>
        )}

        <p className="mt-2 text-sm text-neutral-600">
          {event.date}
          {event.time && <span className="text-neutral-400"> · {event.time}</span>}
          {event.venue && (
            <>
              {" · "}
              <Link
                href={`/venue/${event.venue.slug}`}
                className="inline-flex items-center gap-0.5 hover:text-black hover:underline"
              >
                <MapPin size={11} />
                {event.venue.name}
              </Link>
              {event.venue.city && <span className="text-neutral-400">, {event.venue.city}</span>}
            </>
          )}
        </p>

        {event.doorsIn && (
          <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
            <Clock size={11} />
            Doors {event.doorsIn}
          </p>
        )}

        {event.artists && event.artists.length > 0 && (
          <p className="mt-1 text-xs text-neutral-500">
            Feat.{" "}
            {event.artists.slice(0, 3).map((a, i) => (
              <span key={a.slug}>
                <Link href={`/artist/${a.slug}`} className="hover:text-black hover:underline">
                  {a.name}
                </Link>
                {i < Math.min(2, event.artists!.length - 1) ? ", " : ""}
              </span>
            ))}
            {event.artists.length > 3 && (
              <span className="text-neutral-400"> + {event.artists.length - 3} more</span>
            )}
          </p>
        )}

        {event.promoter && (
          <p className="mt-1 text-xs text-neutral-500">
            Presented by{" "}
            <Link href={`/promoters/${event.promoter.slug}`} className="hover:text-black hover:underline">
              {event.promoter.name}
            </Link>
          </p>
        )}

        {(event.goingCount || event.friendsGoing) && (
          <p className="mt-2 inline-flex items-center gap-1 text-xs text-neutral-500">
            <Users size={11} />
            {event.goingCount ?? 0} going
            {event.friendsGoing ? ` · ${event.friendsGoing} friends` : ""}
          </p>
        )}

        {event.ticketsLeft != null && event.ticketsLeft > 0 && event.ticketsLeft < 30 && (
          <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
            <Flame size={11} />
            Only {event.ticketsLeft} tickets left
          </p>
        )}

        {event.percentSold != null && event.percentSold >= 70 && !event.soldOut && (
          <p className="mt-1 text-xs font-semibold text-amber-600">
            {event.percentSold}% sold
          </p>
        )}

        <div className="mt-auto pt-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-neutral-500">
                {event.soldOut ? "Sold out" : event.priceFrom != null ? "From" : ""}
              </p>
              {!event.soldOut && event.priceFrom != null && (
                <p className="text-lg font-black">
                  {event.currency ?? "£"}
                  {event.priceFrom.toFixed(2)}
                </p>
              )}
              {event.soldOut && (
                <p className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-500">
                  <Ticket size={14} />
                  Sold out
                </p>
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {!event.soldOut ? (
              <Link
                href={`/event/${event.id}`}
                className="inline-flex items-center gap-1 rounded-full bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800"
              >
                Get Tickets <ArrowRight size={12} />
              </Link>
            ) : (
              <Link
                href={`/event/${event.id}#resale`}
                className="inline-flex items-center gap-1 rounded-full border border-neutral-300 px-4 py-2 text-xs font-semibold hover:border-neutral-900"
              >
                Join resale waitlist
              </Link>
            )}

            {event.artists?.[0] && !isCompact && (
              <Link
                href={`/book/artist/${event.artists[0].slug}`}
                className="inline-flex items-center gap-1 rounded-full border border-neutral-300 px-4 py-2 text-xs font-semibold hover:border-neutral-900"
              >
                Book artist
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}