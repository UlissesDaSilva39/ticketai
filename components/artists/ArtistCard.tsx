import Link from 'next/link';
import type { Artist } from '@/lib/artists';
import { MessageButton } from '@/components/promoters/MessageButton';

export function ArtistCard({ artist }: { artist: Artist }) {
  const demo = artist.featuredDemo;
  return (
    <article className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-900">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold">{artist.name}</h3>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {artist.city}
          </p>
        </div>
        {artist.verified && (
          <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-semibold text-white">
            VERIFIED
          </span>
        )}
      </header>

      <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{artist.bio}</p>

      <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
        <span className="rounded-full bg-neutral-100 px-2 py-1 font-medium">{artist.role}</span>
        <span className="rounded-full bg-neutral-100 px-2 py-1 font-medium">{artist.key}</span>
        {artist.genres.map((g) => (
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
            {demo.key} · {demo.role} · {demo.genre}
          </p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <button type="button"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-900 hover:border-neutral-900"
              aria-label={`Preview ${demo.title}`}>
              ▶ Preview
            </button>
            <span className="text-sm font-semibold text-neutral-900">{demo.rate}</span>
            <Link href={`/artists/${artist.slug}/book`}
              className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800">
              BOOK NOW
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-4 text-sm text-neutral-500">
          No demos listed yet —{' '}
          <Link href={`/artists/${artist.slug}`} className="underline">
            follow to be notified
          </Link>
          .
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 text-xs text-neutral-600">
        <span className="rounded-full bg-neutral-100 px-2 py-1">
          {artist.bookingCount} bookings
        </span>
        <span className="rounded-full bg-neutral-100 px-2 py-1">
          {artist.placements} placements
        </span>
      </div>

      {artist.photos.length > 0 && (
        <div className="mt-3 flex gap-1.5">
          {artist.photos.slice(0, 4).map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" className="h-10 w-10 rounded-md object-cover" />
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center gap-2 border-t border-neutral-100 pt-4">
        <MessageButton
          promoterSlug={artist.slug}
          promoterName={artist.name}
          variant="secondary"
          size="sm"
        />
        <Link href={`/artists/${artist.slug}`}
          className="ml-auto text-xs font-semibold text-neutral-700 underline-offset-4 hover:text-black hover:underline">
          View profile →
        </Link>
      </div>

      <footer className="mt-4 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
        {artist.social.instagram && (
          <a href={`https://instagram.com/${artist.social.instagram}`}
            target="_blank" rel="noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1 hover:border-neutral-900">
            IG @{artist.social.instagram}
          </a>
        )}
        {artist.social.tiktok && (
          <a href={`https://tiktok.com/@${artist.social.tiktok}`}
            target="_blank" rel="noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1 hover:border-neutral-900">
            TikTok @{artist.social.tiktok}
          </a>
        )}
        {artist.social.soundcloud && (
          <a href={`https://soundcloud.com/${artist.social.soundcloud}`}
            target="_blank" rel="noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1 hover:border-neutral-900">
            SoundCloud @{artist.social.soundcloud}
          </a>
        )}
        {artist.social.spotify && (
          <a href={`https://open.spotify.com/artist/${artist.social.spotify}`}
            target="_blank" rel="noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1 hover:border-neutral-900">
            Spotify
          </a>
        )}
        {artist.social.appleMusic && (
          <a href={`https://music.apple.com/artist/${artist.social.appleMusic}`}
            target="_blank" rel="noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1 hover:border-neutral-900">
            Apple Music
          </a>
        )}
      </footer>
    </article>
  );
}