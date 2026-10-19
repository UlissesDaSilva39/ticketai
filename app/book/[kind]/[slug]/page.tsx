import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPromoterBySlug } from '@/lib/promoters';
import { getDjBySlug } from '@/lib/djs';

type Params = { params: Promise<{ kind: string; slug: string }> };

export default async function BookingRequestPage({ params }: Params) {
  const { kind, slug } = await params;

  let displayName = '';
  let bookHref = '';

  if (kind === 'promoter') {
    const promoter = await getPromoterBySlug(slug);
    if (!promoter) notFound();
    displayName = promoter.name;
    bookHref = `/promoters/${promoter.slug}`;
  } else if (kind === 'dj') {
    const dj = await getDjBySlug(slug);
    if (!dj) notFound();
    displayName = dj.name;
    bookHref = `/djs/${dj.slug}`;
  } else {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Link href={bookHref} className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-black">
        ← Back to profile
      </Link>

      <h1 className="mt-6 text-3xl font-black tracking-tight md:text-4xl">
        Booking request
      </h1>
      <p className="mt-2 text-sm text-neutral-600">
        Requesting a booking with <span className="font-semibold">{displayName}</span>.
      </p>

      <form className="mt-8 space-y-5 rounded-3xl border border-neutral-200 bg-white p-6 md:p-8">
        <input type="hidden" name="kind" value={kind} />
        <input type="hidden" name="slug" value={slug} />

        <div>
          <label htmlFor="name" className="block text-sm font-semibold">Your name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-900"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-900"
          />
        </div>

        <div>
          <label htmlFor="eventDate" className="block text-sm font-semibold">Event date</label>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            required
            className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-900"
          />
        </div>

        <div>
          <label htmlFor="venue" className="block text-sm font-semibold">Venue / location</label>
          <input
            id="venue"
            name="venue"
            type="text"
            required
            className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-900"
          />
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-semibold">Budget</label>
          <input
            id="budget"
            name="budget"
            type="text"
            placeholder="e.g. £800"
            className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-900"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-semibold">Message</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-900"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          Send booking request
        </button>

        <p className="text-center text-xs text-neutral-500">
          You&apos;ll get a response within 48 hours. No payment required yet.
        </p>
      </form>
    </div>
  );
}