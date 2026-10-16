import Link from 'next/link';
import type { Venue } from '@/lib/venues';
import { MessageButton } from '@/components/promoters/MessageButton';

export function VenueCard({ venue }: { venue: Venue }) {
  const slot = venue.tonightSlot;
  return (
    <article className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-900">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold">{venue.name}</h3>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {venue.city}
          </p>
        </div>
        {venue.verified && (
          <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-semibold text-white">
            VERIFIED
          </span>
        )}
      </header>

      <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{venue.bio}</p>

      <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
        <span className="rounded-full bg-neutral-100 px-2 py-1 font-medium">{venue.type}</span>
        <span className="rounded-full bg-neutral-100 px-2 py-1 font-medium">Cap {venue.capacity}</span>
        <span className="rounded-full bg-neutral-100 px-2 py-1 font-medium">{venue.deal}</span>
      </div>

      {slot ? (
        <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            Tonight&apos;s slot
          </p>
          <p className="mt-1 text-sm font-semibold text-neutral-900">
            {slot.date} · {slot.hours}
          </p>
          <p className="mt-0.5 text-sm text-neutral-600">
            {slot.price} · {slot.techLine}
          </p>
          <div className="mt-3 flex items-center justify-end">
            <Link href={`/venues/${venue.slug}/book`}
              className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800">
              BOOK NOW
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-4 text-sm text-neutral-500">
          No open slots right now —{' '}
          <Link href={`/venues/${venue.slug}`} className="underline">
            follow to be notified
          </Link>
          .
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 text-xs text-neutral-600">
        <span className="rounded-full bg-neutral-100 px-2 py-1">
          {venue.eventCount} events
        </span>
        <span className="rounded-full bg-neutral-100 px-2 py-1">
          {venue.ticketsSold.toLocaleString()}+ tickets
        </span>
      </div>

      {venue.photos.length > 0 && (
        <div className="mt-3 flex gap-1.5">
          {venue.photos.slice(0, 4).map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" className="h-10 w-10 rounded-md object-cover" />
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center gap-2 border-t border-neutral-100 pt-4">
        <MessageButton
          promoterSlug={venue.slug}
          promoterName={venue.name}
          variant="secondary"
          size="sm"
        />
        <Link href={`/venues/${venue.slug}`}
          className="ml-auto text-xs font-semibold text-neutral-700 underline-offset-4 hover:text-black hover:underline">
          View profile →
        </Link>
      </div>

      <footer className="mt-4 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
        {venue.social.instagram && (
          <a href={`https://instagram.com/${venue.social.instagram}`}
            target="_blank" rel="noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1 hover:border-neutral-900">
            IG @{venue.social.instagram}
          </a>
        )}
        {venue.social.website && (
          <a href={`https://${venue.social.website}`}
            target="_blank" rel="noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1 hover:border-neutral-900">
            Website
          </a>
        )}
        {venue.social.maps && (
          <a href={`https://maps.google.com/?q=${venue.social.maps}`}
            target="_blank" rel="noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1 hover:border-neutral-900">
            Maps
          </a>
        )}
      </footer>
    </article>
  );
}