import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PromoterNextEvent, PromoterUpcomingEvents } from '@/components/promoters/PromoterEvents';
import { PromoterVenuesWorked } from '@/components/promoters/PromoterVenuesWorked';
import { PromoterResidentDjs } from '@/components/promoters/PromoterResidentDjs';
import { PromoterReviews }     from '@/components/promoters/PromoterReviews';
import { PromoterDemoCTA }     from '@/components/promoters/PromoterDemoCTA';
import { getPromoterBySlug }   from '@/lib/promoters';

type Params = { params: Promise<{ slug: string }> };

export default async function PromoterProfilePage({ params }: Params) {
  const { slug } = await params;
  const promoter = await getPromoterBySlug(slug);
  if (!promoter) notFound();

  const stats = [
    { label: 'Events run', value: promoter.eventCount },
    { label: 'Tickets sold', value: promoter.ticketsSold.toLocaleString() },
    { label: 'Venues', value: promoter.venuesWorked?.length ?? 0 },
    { label: 'Avg. fill', value: promoter.avgFill ? ` ${promoter.avgFill}% ` : '—' },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link href="/promoters" className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-black">
        ← Back to promoters
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">{promoter.name}</h1>
          {promoter.verified && (
            <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-semibold text-white">
              VERIFIED
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-neutral-500">@{promoter.slug}</p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-neutral-500">
          {promoter.city}{promoter.timezone ? ` · ${promoter.timezone} ` : ''} · Promoter
        </p>
        <p className="mt-3 max-w-2xl text-base text-neutral-700">{promoter.bio}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {promoter.genres.map((g) => (
            <span key={g} className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium">
              {g}
            </span>
          ))}
        </div>
        {promoter.responseTime && (
          <p className="mt-3 text-sm text-neutral-500">
            Responds in {promoter.responseTime}
            {promoter.runningSince && <> · Running nights since {promoter.runningSince}</>}
          </p>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href={` /book/promoter/${promoter.slug} `}
            className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Propose partnership
          </Link>
        </div>
      </header>

      <section className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-neutral-200 bg-white p-4">
            <p className="text-2xl font-black tracking-tight">{s.value}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-neutral-500">
              {s.label}
            </p>
          </div>
        ))}
      </section>

      {promoter.longBio && (
        <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">About</h2>
          <div className="mt-3 max-w-3xl space-y-3 text-sm leading-relaxed text-neutral-700">
            {promoter.longBio.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>
      )}

      <div className="mt-8 space-y-8">
        <PromoterNextEvent event={promoter.nextEvent} />
        <PromoterUpcomingEvents events={promoter.upcomingEvents} />
        <PromoterVenuesWorked venues={promoter.venuesWorked} />
        <PromoterResidentDjs residents={promoter.residentDjs} />
        <PromoterReviews reviews={promoter.reviews} />
        <PromoterDemoCTA promoterName={promoter.name} />
      </div>
    </div>
  );
}