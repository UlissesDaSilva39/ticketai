import Link from 'next/link';

export function MetaSalesBlock({ role }: { role: string }) {
  return (
    <section className="rounded-3xl bg-neutral-900 p-8 text-white md:p-10">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
          For other {role}s
        </p>
        <h2 className="mt-3 text-2xl font-black tracking-tight md:text-3xl">
          This is what your profile could look like.
        </h2>
        <p className="mt-3 text-base text-neutral-300">
          Set your rates. Publish your services. Get booked by artists and
          producers who need what you offer.
        </p>

        <ul className="mt-5 grid gap-2 text-sm text-neutral-300 md:grid-cols-2">
          <li>✓ Rate card — set your hourly, monthly, or project rates</li>
          <li>✓ Auto contracts — GRID generates the paperwork</li>
          <li>✓ Same-day payouts — money lands the next morning</li>
          <li>✓ Client CRM — every booking, every review, in one place</li>
        </ul>

        <Link
          href="/artists/apply"
          className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-neutral-100"
        >
          Create your {role} profile →
        </Link>
      </div>
    </section>
  );
}