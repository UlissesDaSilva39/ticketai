import Link from "next/link";
import type { Event } from "@/lib/types";

export function EventCard({ event, dark = false }: { event: Event; dark?: boolean }) {
  const firstTicket = event.ticket_types?.[0];
  const date = new Date(event.start_date);
  const isFeatured =
    event.featured_until && new Date(event.featured_until) > new Date();

  return (
    <Link href={"/event/" + event.id} className="group block relative">
      <div className="aspect-[4/5] bg-gray-100 overflow-hidden mb-3 relative">
        {event.hero_image ? (
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
        {isFeatured && (
          <span className="absolute top-4 left-4 px-4 py-2 bg-[#00FF87] text-black text-sm font-bold rounded-full uppercase tracking-wider shadow-lg">
            Featured
          </span>
        )}
      </div>
      <h3
        className={"font-bold text-2xl leading-none mb-2 tracking-tight uppercase " + (dark ? "text-white" : "text-black")}
        style={{ fontFamily: "var(--font-antonio)" }}
      >
        {event.title}
      </h3>
      <p className={"text-xs uppercase tracking-widest mb-1 " + (dark ? "text-gray-400" : "text-gray-500")}>
        {date.toLocaleDateString("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })}
      </p>
      {firstTicket && (
        <p className={"text-xs uppercase tracking-widest " + (dark ? "text-gray-400" : "text-gray-500")}>
          From £{Number(firstTicket.price).toFixed(2)}
        </p>
      )}
    </Link>
  );
}
