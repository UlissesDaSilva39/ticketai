import Link from 'next/link';
import type { DJ } from '@/lib/djs';
import { MessageButton } from '@/components/promoters/MessageButton';

export function DjCard({ dj }: { dj: DJ }) {
  const set = dj.nextSet;
  return (
    <article className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-900">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold">{dj.name}</h3>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {dj.city}
          </p>
        </div>
        {dj.verified && (
          <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-semibold text-white">
            VERIFIED
          </span>
        )}
      </header>

      <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{dj.bio}</p>

      <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
        <span className="rounded-full bg-neutral-100 px-2 py-1 font-medium">{dj.style}</span>
        <span className="rounded-full bg-neutral-100 px-2 py-1 font-medium">{dj.tier}</span>
        <span className="rounded-full bg-neutral-100 px-2 py-1 font-medium">Draw {dj.draw}</span>
      </div>

      {set ? (
        <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            Next set
          </p>
          <p className="mt-1 text-sm font-semibold text-neutral-900">{set.venue}</p>
          <p className="mt-0.5 text-sm text-neutral-600">
            {set.date} â€š· Set {set.setTime} â€š· {set.city}
          </p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-neutral-900">{set.feeFrom}</span>
            <Link href={`/djs/${dj.slug}/book`}
              className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800">
              BOOK NOW
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-4 text-sm text-neutral-500">
          No upcoming sets yet ¢¢â€š¬¢â‚¬{' '}
          <Link href={`/djs/${dj.slug}`} className="underline">
            follow to be notified
          </Link>
          .
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 text-xs text-neutral-600">
        <span className="rounded-full bg-neutral-100 px-2 py-1">
          {dj.gigCount} gigs
        </span>
        <span className="rounded-full bg-neutral-100 px-2 py-1">
          {dj.ticketsSold.toLocaleString()}+ tickets
        </span>
      </div>

      {dj.photos.length > 0 && (
        <div className="mt-3 flex gap-1.5">
          {dj.photos.slice(0, 4).map((src: string, i: number) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" className="h-10 w-10 rounded-md object-cover" />
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center gap-2 border-t border-neutral-100 pt-4">
        <MessageButton
          promoterSlug={dj.slug}
          promoterName={dj.name}
          variant="secondary"
          size="sm"
        />
        <Link href={`/djs/${dj.slug}`}
          className="ml-auto text-xs font-semibold text-neutral-700 underline-offset-4 hover:text-black hover:underline">
          View profile ¢¢â‚¬ ¢â‚¬â„¢
        </Link>
      </div>

      <footer className="mt-4 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
        {dj.social.instagram && (
          <a href={`https://instagram.com/${dj.social.instagram}`}
            target="_blank" rel="noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1 hover:border-neutral-900">
            IG @{dj.social.instagram}
          </a>
        )}
        {dj.social.soundcloud && (
          <a href={`https://soundcloud.com/${dj.social.soundcloud}`}
            target="_blank" rel="noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1 hover:border-neutral-900">
            SoundCloud @{dj.social.soundcloud}
          </a>
        )}
        {dj.social.spotify && (
          <a href={`https://open.spotify.com/artist/${dj.social.spotify}`}
            target="_blank" rel="noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1 hover:border-neutral-900">
            Spotify
          </a>
        )}
        {dj.social.mixcloud && (
          <a href={`https://mixcloud.com/${dj.social.mixcloud}`}
            target="_blank" rel="noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1 hover:border-neutral-900">
            Mixcloud
          </a>
        )}
      </footer>
    </article>
  );
}