import Link from 'next/link';

export function PromoterDemoCTA({
  promoterName,
  demoSubmissionUrl,
}: {
  promoterName: string;
  demoSubmissionUrl?: string;
}) {
  if (!demoSubmissionUrl) return null;

  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-8 md:p-10">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Submit your demo
        </p>
        <h2 className="mt-3 text-2xl font-black tracking-tight md:text-3xl">
          Want to play at {promoterName}?
        </h2>
        <p className="mt-3 text-base text-neutral-600">
          We review every demo. If it fits, we&apos;ll reach out within 2 weeks.
        </p>

        <Link
          href={demoSubmissionUrl}
          className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          Submit demo →
        </Link>
      </div>
    </section>
  );
}