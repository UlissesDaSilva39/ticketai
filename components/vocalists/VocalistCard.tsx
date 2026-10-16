import Link from 'next/link';
import type { Vocalist } from '@/lib/vocalists';
import { MessageButton } from '@/components/promoters/MessageButton';

export function VocalistCard({ vocalist }: { vocalist: Vocalist }) {
  const demo = vocalist.featuredDemo;
  return (
    <article className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-900">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold">{vocalist.name}</h3>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {vocalist.city}
          </p>
        </div>
        {vocalist.verified && (
          <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-semibold text-white">
            VERIFIED
          </span>
        )}
      </header>

      <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{vocalist.bio}</p>

      <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
        <span className="rounded-full bg-neutral-100 px-2 py-1 font-medium">{vocalist.type}</span>
        <span className="rounded-full bg-neutral-100 px-2 py-1 font-medium">{vocalist.range}</span>
        {vocalist.genres.map((g) => (
          <span key={g} className="rounded-full bg-neutral-100 px-2 py-1 font-medium">{g}</span>
        ))}
      </div>

      {demo ? (
        <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            Featured demo
          </p>
          <p className="mt-1 text-sm font-semibold text-neutral-900">{demo.title}</p>
          <p className="mt-0.5 text-sm text-neutral-600">
            {demo.key} · {demo.range} · {demo.genre}
          </p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <button type="button"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-900 hover:border-neutral-900"
              aria-label={`Preview ${demo.title}`}>
              ▶ Preview
            </button>
            <span className="text-sm font-semibold text-neutral-900">{demo.rate}</span>
            <Link href={`/vocalists/${vocalist.slug}/book`}
              className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800">
              BOOK NOW
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-4 text-sm text-neutral-500">
          No demos listed yet —{' '}
          <Link href={`/vocalists/${vocalist.slug}`} className="underline">
            follow to be notified
          </Link>
          .
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 text-xs text-neutral-600">
        <span className="rounded-full bg-neutral-100 px-2 py-1">
          {vocalist.bookingCount} bookings
        </span>
        <span className="rounded-full bg-neutral-100 px-2 py-1">
          {vocalist.placements} placements
        </span>
      </div>

      {vocalist.photos.length > 0 && (
        <div className="mt-3 flex gap-1.5">
          {vocalist.photos.slice(0, 4).map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" className="h-10 w-10 rounded-md object-cover" />
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center gap-2 border-t border-neutral-100 pt-4">
        <MessageButton
          promoterSlug={vocalist.slug}
          promoterName={vocalist.name}
          variant="secondary"
          size="sm"
        />
        <Link href={`/vocalists/${vocalist.slug}`}
          className="ml-auto text-xs font-semibold text-neutral-700 underline-offset-4 hover:text-black hover:underline">
          View profile →
        </Link>
      </div>

      <footer className="mt-4 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
        {vocalist.social.instagram && (
          <a href={`https://instagram.com/${vocalist.social.instagram}`}
            target="_blank" rel="noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1 hover:border-neutral-900">
            IG @{vocalist.social.instagram}
          </a>
        )}
        {vocalist.social.tiktok && (
          <a href={`https://tiktok.com/@${vocalist.social.tiktok}`}
            target="_blank" rel="noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1 hover:border-neutral-900">
            TikTok @{vocalist.social.tiktok}
          </a>
        )}
        {vocalist.social.youtube && (
          <a href={`https://youtube.com/@${vocalist.social.youtube}`}
            target="_blank" rel="noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1 hover:border-neutral-900">
            YT @{vocalist.social.youtube}
          </a>
        )}
        {vocalist.social.spotify && (
          <a href={`https://open.spotify.com/artist/${vocalist.social.spotify}`}
            target="_blank" rel="noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1 hover:border-neutral-900">
            Spotify
          </a>
        )}
      </footer>
    </article>
  );
}