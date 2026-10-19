import Link from 'next/link';
import type { PromoterEvent } from '@/lib/promoters';

export function PromoterNextEvent({ event }: { event?: PromoterEvent }) {
  if (!event) return null;

  return (
    <section>
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        🎟️ Next event
      </p>
      <div className="mt-3 rounded-2xl border border-neutral-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-lg font-black tracking-tight">{event.title}</p>
            <p className="mt-1 text-sm text-neutral-600">
              {event.venue} · {event.date}
            </p>
            <p className="mt-1 text-sm font-semibold">{event.priceFrom}</p>
          </div>
          <Link
            href={`/events/${event.slug}`}
            className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Get tickets →
          </Link>
        </div>
      </div>
    </section>
  );
}

export function PromoterUpcomingEvents({ events }: { events?: PromoterEvent[] }) {
  if (!events || events.length === 0) return null;

  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        Upcoming events
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {events.map((e) => (
          <Link
            key={e.slug}
            href={`/events/${e.slug}`}
            className="group flex flex-col rounded-2xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-900"
          >
            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-100" />
            <p className="mt-3 truncate text-sm font-semibold">{e.title}</p>
            <p className="text-xs text-neutral-500">
              {e.venue} · {e.date}
            </p>
            <p className="mt-2 text-sm font-semibold">{e.priceFrom}</p>
            <p className="mt-2 text-xs font-semibold text-neutral-700 group-hover:text-black">
              Get tickets →
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}