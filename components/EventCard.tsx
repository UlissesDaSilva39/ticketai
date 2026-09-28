 import Link from "next/link";
import type { Event } from "@/lib/types";

export function EventCard({ event }: { event: Event }) {
  const firstTicket = event.ticket_types?.[0];
  const date = new Date(event.start_date);

  return (
    <Link href={`/event/${event.id}`} className="group block">
      <div className="aspect-[4/5] bg-gray-100 overflow-hidden mb-3">
        {event.hero_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.hero_image}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            No image
          </div>
        )}
      </div>
      <h3
        className="font-bold text-2xl leading-none mb-2 tracking-tight uppercase"
        style={{ fontFamily: "var(--font-antonio)" }}
      >
        {event.title}
      </h3>
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
        {date.toLocaleDateString("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })}
      </p>
      {firstTicket && (
        <p className="text-xs text-gray-500 uppercase tracking-widest">
          From £{Number(firstTicket.price).toFixed(2)}
        </p>
      )}
    </Link>
  );
}