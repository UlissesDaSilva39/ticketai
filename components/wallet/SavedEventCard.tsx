import Link from "next/link";

type SavedEvent = {
  id: string;
  title: string;
  start_date: string;
  venue_name?: string | null;
  city?: string | null;
  hero_image?: string | null;
  ticket_url?: string | null;
  external_source?: string | null;
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function SavedEventCard({ event }: { event: SavedEvent }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100">
        {event.hero_image ? (
          <img
            src={event.hero_image}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-neutral-200 to-neutral-300" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <Link
          href={`/event/${event.id}`}
          className="block truncate text-base font-semibold hover:underline"
        >
          {event.title}
        </Link>
        <p className="mt-1 text-sm text-neutral-600">
          {formatDate(event.start_date)}
          {event.venue_name ? ` · ${event.venue_name}` : ""}
          {event.city ? `, ${event.city}` : ""}
        </p>
        <div className="mt-3 flex items-center gap-3 text-sm">
          {event.ticket_url ? (
            <a
              href={event.ticket_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-neutral-900 px-4 py-1.5 font-semibold text-white"
            >
              Tickets
            </a>
          ) : (
            <span className="text-neutral-500">Tickets not available</span>
          )}
          {event.external_source ? (
            <span className="text-xs text-neutral-400">
              via {event.external_source}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}