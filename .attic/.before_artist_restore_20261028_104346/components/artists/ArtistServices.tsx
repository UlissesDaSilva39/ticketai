type Service = { label: string; price: string; note?: string };

export function ArtistServices({ services }: { services: Service[] }) {
  if (!services || services.length === 0) return null;

  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        Services
      </h2>
      <dl className="mt-4 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
        {services.map((s, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-4">
            <dt className="text-sm font-medium text-neutral-900">{s.label}</dt>
            <dd className="text-sm font-semibold text-neutral-900">{s.price}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs text-neutral-500">
        All engagements include contract + invoice.
      </p>
    </section>
  );
}