import Link from 'next/link';

type Set = { date: string; venue: string; city: string; setTime: string; ticketUrl: string };

export function DjNextSets({ sets }: { sets?: Set[] }) {
  if (!sets || sets.length === 0) return null;

  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        Next sets
      </h2>
      <ul className="mt-4 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
        {sets.map((s, i) => (
          <li key={i} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div>
              <p className="text-sm font-semibold">
                {s.date} · {s.venue}, {s.city}
              </p>
              <p className="text-xs text-neutral-500">{s.setTime} set</p>
            </div>
            <Link
              href={s.ticketUrl}
              className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800"
            >
              Get tickets →
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}