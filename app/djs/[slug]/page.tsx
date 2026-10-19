import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DjMixesList }   from '@/components/djs/DjMixesList';
import { DjNextSets }    from '@/components/djs/DjNextSets';
import { DjResidencies } from '@/components/djs/DjResidencies';
import { DjRates }       from '@/components/djs/DjRates';
import { getDjBySlug }   from '@/lib/djs';

type Params = { params: Promise<{ slug: string }> };

export default async function DjProfilePage({ params }: Params) {
  const { slug } = await params;
  const dj = await getDjBySlug(slug);
  if (!dj) notFound();

  const stats = [
    { label: 'Gigs', value: dj.gigCount },
    { label: 'Mix plays', value: dj.mixPlays.toLocaleString() },
    { label: 'Mixes', value: dj.mixCount },
    { label: 'Earned', value: dj.earnedTotal ?? '—' },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link href="/djs" className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-black">
        ← Back to DJs
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">{dj.name}</h1>
          {dj.verified && (
            <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-semibold text-white">
              VERIFIED
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-neutral-500">@{dj.slug}</p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-neutral-500">
          {dj.city}{dj.timezone ? ` · ${dj.timezone} ` : ''} · DJ
          {dj.djSince && <> · Since {dj.djSince}</>}
        </p>
        <p className="mt-3 max-w-2xl text-base text-neutral-700">{dj.bio}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {dj.genres.map((g) => (
            <span key={g} className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium">
              {g}
            </span>
          ))}
        </div>
        {dj.responseTime && (
          <p className="mt-3 text-sm text-neutral-500">Responds in {dj.responseTime}</p>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href={` /book/dj/${dj.slug} `}
            className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Book this DJ
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

      {dj.longBio && (
        <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">About</h2>
          <div className="mt-3 max-w-3xl space-y-3 text-sm leading-relaxed text-neutral-700">
            {dj.longBio.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>
      )}

      <div className="mt-8 space-y-8">
        <DjMixesList mixes={dj.mixes} />
        <DjNextSets sets={dj.nextSets} />
        <DjResidencies residencies={dj.residencies} />
        <DjRates rates={dj.rates} slug={dj.slug} />
      </div>
    </div>
  );
}