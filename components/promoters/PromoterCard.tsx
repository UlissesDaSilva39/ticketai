import Link from 'next/link';
import type { Promoter } from '@/lib/promoters';
import { MessageButton } from './MessageButton';

export function PromoterCard({
  promoter,
  currentUserId,
}: {
  promoter: Promoter;
  currentUserId?: string | null;
}) {
  const next = promoter.nextEvent;
  const isOwner = !!currentUserId && currentUserId === promoter.userId;

  return (
    <article className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-900">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold">{promoter.name}</h3>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {promoter.city}
          </p>
        </div>
        {promoter.verified && (
          <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-semibold text-white">
            VERIFIED
          </span>
        )}
      </header>

      <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{promoter.bio}</p>

      {next ? (
        <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            Next event
          </p>
          <p className="mt-1 text-sm font-semibold text-neutral-900">{next.title}</p>
          <p className="mt-0.5 text-sm text-neutral-600">
            {next.date} â€š· {next.venue}
          </p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-neutral-900">{next.priceFrom}</span>
            <Link href={`/events/${next.slug}`}
              className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800">
              Get tickets ¢â€ ’</Link>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-4 text-sm text-neutral-500">
          No upcoming events yet ¢¢â€š¬¢â‚¬{' '}
          <Link href={`/promoters/${promoter.slug}`} className="underline">
            follow to be notified
          </Link>
          .
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 text-xs text-neutral-600">
        <span className="rounded-full bg-neutral-100 px-2 py-1">
          {promoter.eventCount} events
        </span>
        <span className="rounded-full bg-neutral-100 px-2 py-1">
          {promoter.ticketsSold.toLocaleString()}+ tickets
        </span>
      </div>

      {promoter.photos.length > 0 && (
        <div className="mt-3 flex gap-1.5">
          {promoter.photos.slice(0, 4).map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" className="h-10 w-10 rounded-md object-cover" />
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center gap-2 border-t border-neutral-100 pt-4">
        {isOwner ? (
          <>
            <Link href="/promoter/dashboard"
              className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800">
              View dashboard
            </Link>
            <Link href={`/promoters/${promoter.slug}/edit`}
              className="ml-auto text-xs font-semibold text-neutral-700 hover:text-black">
              Edit profile ¢¢â‚¬ ¢â‚¬â„¢
            </Link>
          </>
        ) : (
          <>
            <MessageButton
              promoterSlug={promoter.slug}
              promoterName={promoter.name}
              variant="secondary"
              size="sm"
            />
            <Link href={`/promoters/${promoter.slug}`}
              className="ml-auto text-xs font-semibold text-neutral-700 underline-offset-4 hover:text-black hover:underline">
              View profile ¢¢â‚¬ ¢â‚¬â„¢
            </Link>
          </>
        )}
      </div>

      <footer className="mt-4 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
        {promoter.social.instagram && (
          <a href={`https://instagram.com/${promoter.social.instagram}`}
            target="_blank" rel="noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1 hover:border-neutral-900">
            IG @{promoter.social.instagram}
          </a>
        )}
        {promoter.social.tiktok && (
          <a href={`https://tiktok.com/@${promoter.social.tiktok}`}
            target="_blank" rel="noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1 hover:border-neutral-900">
            TikTok @{promoter.social.tiktok}
          </a>
        )}
        {promoter.social.youtube && (
          <a href={`https://youtube.com/@${promoter.social.youtube}`}
            target="_blank" rel="noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1 hover:border-neutral-900">
            YT @{promoter.social.youtube}
          </a>
        )}
      </footer>
    </article>
  );
}