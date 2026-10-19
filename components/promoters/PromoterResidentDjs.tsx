import Link from 'next/link';

type Resident = { slug: string; name: string; city: string; role: string };

export function PromoterResidentDjs({ residents }: { residents?: Resident[] }) {
  if (!residents || residents.length === 0) return null;

  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        Resident DJs & collaborators
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
        {residents.map((r) => (
          <Link
            key={r.slug}
            href={`/djs/${r.slug}`}
            className="group flex flex-col rounded-2xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-900"
          >
            <div className="aspect-square w-full overflow-hidden rounded-xl bg-neutral-100 flex items-center justify-center text-3xl font-black text-neutral-300">
              {r.name.charAt(0)}
            </div>
            <p className="mt-3 truncate text-sm font-semibold">{r.name}</p>
            <p className="text-xs text-neutral-500">{r.city}</p>
            <p className="text-xs text-neutral-500">{r.role}</p>
            <p className="mt-3 text-xs font-semibold text-neutral-700 group-hover:text-black">
              View profile →
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}