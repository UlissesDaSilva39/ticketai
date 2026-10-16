import Link from 'next/link';
import type { Band } from '@/lib/bands';
import { MessageButton } from '@/components/promoters/MessageButton';

export function BandCard({ band }: { band: Band }) {
  const gig = band.nextGig;
  return (
    <article className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-900">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold">{band.name}</h3>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {band.city}
          </p>
        </div>
        {band.verified && (
          <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-semibold text-white">
            VERIFIED
          </span>
        )}
      </header>

      <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{band.bio}</p>

      <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
        <span className="rounded-full bg-neutral-100 px-2 py-1 font-medium">{band.genre}</span>
        <span className="rounded-full bg-neutral-100 px-2 py-1 font-medium">{band.lineup}</span>
        <span className="rounded-full bg-neutral-100 px-2 py-1 font-medium">Draw {band.draw}</span>
      </div>

      {gig ? (
        <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            Next gig
          </p>
          <p className="mt-1 text-sm font-semibold text-neutral-900">{gig.venue}</p>
          <p className="mt-0.5 text-sm text-neutral-600">
            {gig.date} · Doors {gig.doors} · {gig.city}
          </p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-neutral-900">{gig.priceFrom}</span>
            <Link href={`/gigs/${gig.slug}`}
              className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800">
              GET TICKETS
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-4 text-sm text-neutral-500">
          No upcoming gigs yet —{' '}
          <Link href={`/bands/${band.slug}`} className="underline">
            follow to be notified
          </Link>
          .
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 text-xs text-neutral-600">
        <span className="rounded-full bg-neutral-100 px-2 py-1">
          {band.gigCount} gigs
        </span>
        <span className="rounded-full bg-neutral-100 px-2 py-1">
          {band.ticketsSold.toLocaleString()}+ tickets
        </span>
      </div>

      {band.photos.length > 0 && (
        <div className="mt-3 flex gap-1.5">
          {band.photos.slice(0, 4).map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" className="h-10 w-10 rounded-md object-cover" />
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center gap-2 border-t border-neutral-100 pt-4">
        <MessageButton
          promoterSlug={band.slug}
          promoterName={band.name}
          variant="secondary"
          size="sm"
        />
        <Link href={`/bands/${band.slug}`}
          className="ml-auto text-xs font-semibold text-neutral-700 underline-offset-4 hover:text-black hover:underline">
          View profile →
        </Link>
      </div>

      <footer className="mt-4 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
        {band.social.instagram && (
          <a href={`https://instagram.com/${band.social.instagram}`}
            target="_blank" rel="noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1 hover:border-neutral-900">
            IG @{band.social.instagram}
          </a>
        )}
        {band.social.tiktok && (
          <a href={`https://tiktok.com/@${band.social.tiktok}`}
            target="_blank" rel="noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1 hover:border-neutral-900">
            TikTok @{band.social.tiktok}
          </a>
        )}
        {band.social.spotify && (
          <a href={`https://open.spotify.com/artist/${band.social.spotify}`}
            target="_blank" rel="noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1 hover:border-neutral-900">
            Spotify
          </a>
        )}
        {band.social.appleMusic && (
          <a href={`https://music.apple.com/artist/${band.social.appleMusic}`}
            target="_blank" rel="noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1 hover:border-neutral-900">
            Apple Music
          </a>
        )}
      </footer>
    </article>
  );
}