import type { DjResidency } from '@/lib/djs';

export function DjResidencies({ residencies }: { residencies?: DjResidency[] }) {
  if (!residencies || residencies.length === 0) return null;

  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        Residencies
      </h2>
      <ul className="mt-4 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
        {residencies.map((r, i) => (
          <li key={i} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div>
              <p className="text-sm font-semibold">{r.venue}</p>
              <p className="text-xs text-neutral-500">{r.city}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{r.status}</p>
              <p className="text-xs text-neutral-500">{r.years}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}