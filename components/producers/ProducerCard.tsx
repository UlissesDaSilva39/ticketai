import Link from 'next/link';
import type { Producer } from '@/lib/producers';
import { MessageButton } from '@/components/promoters/MessageButton';

export function ProducerCard({ producer }: { producer: Producer }) {
  const beat = producer.latestBeat;
  return (
    <article className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-900">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold">{producer.name}</h3>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {producer.city}
          </p>
        </div>
        {producer.verified && (
          <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-semibold text-white">
            VERIFIED
          </span>
        )}
      </header>

      <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{producer.bio}</p>

      {beat ? (
        <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            Latest beat
          </p>
          <p className="mt-1 text-sm font-semibold text-neutral-900">{beat.title}</p>
          <p className="mt-0.5 text-sm text-neutral-600">
            {beat.key} · {beat.bpm} BPM · {beat.genre}
          </p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <button type="button"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-900 hover:border-neutral-900"
              aria-label={`Preview ${beat.title}`}>
              ▶ Preview
            </button>
            <span className="text-sm font-semibold text-neutral-900">{beat.priceFrom}</span>
            <Link href={`/beats/${beat.slug}`}
              className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800">
              BUY NOW
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-4 text-sm text-neutral-500">
          No beats listed yet —{' '}
          <Link href={`/producers/${producer.slug}`} className="underline">
            follow to be notified
          </Link>
          .
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 text-xs text-neutral-600">
        <span className="rounded-full bg-neutral-100 px-2 py-1">
          {producer.beatCount} beats
        </span>
        <span className="rounded-full bg-neutral-100 px-2 py-1">
          {producer.placements} placements
        </span>
      </div>

      {producer.photos.length > 0 && (
        <div className="mt-3 flex gap-1.5">
          {producer.photos.slice(0, 4).map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" className="h-10 w-10 rounded-md object-cover" />
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center gap-2 border-t border-neutral-100 pt-4">
        <MessageButton
          promoterSlug={producer.slug}
          promoterName={producer.name}
          variant="secondary"
          size="sm"
        />
        <Link href={`/producers/${producer.slug}`}
          className="ml-auto text-xs font-semibold text-neutral-700 underline-offset-4 hover:text-black hover:underline">
          View profile →
        </Link>
      </div>

      <footer className="mt-4 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
        {producer.social.instagram && (
          <a href={`https://instagram.com/${producer.social.instagram}`}
            target="_blank" rel="noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1 hover:border-neutral-900">
            IG @{producer.social.instagram}
          </a>
        )}
        {producer.social.tiktok && (
          <a href={`https://tiktok.com/@${producer.social.tiktok}`}
            target="_blank" rel="noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1 hover:border-neutral-900">
            TikTok @{producer.social.tiktok}
          </a>
        )}
        {producer.social.youtube && (
          <a href={`https://youtube.com/@${producer.social.youtube}`}
            target="_blank" rel="noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1 hover:border-neutral-900">
            YT @{producer.social.youtube}
          </a>
        )}
        {producer.social.bandcamp && (
          <a href={`https://bandcamp.com/${producer.social.bandcamp}`}
            target="_blank" rel="noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1 hover:border-neutral-900">
            Bandcamp {producer.social.bandcamp}
          </a>
        )}
      </footer>
    </article>
  );
}