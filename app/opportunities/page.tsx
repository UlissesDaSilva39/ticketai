import Link from 'next/link';

export const metadata = {
  title: 'Opportunities',
  description: 'Find gigs, jobs, bookings, collaborations, festivals, and more.',
};

const CATEGORIES = [
  { label: 'All',            key: 'all' },
  { label: 'Gigs',           key: 'gig' },
  { label: 'Jobs',           key: 'job' },
  { label: 'Bookings',       key: 'booking' },
  { label: 'Collaborations', key: 'collab' },
  { label: 'Festivals',      key: 'festival' },
  { label: 'Remixes',        key: 'remix' },
  { label: 'Sync',           key: 'sync' },
  { label: 'Brand Deals',    key: 'brand' },
];

const SAMPLE = [
  { title: 'DJ WANTED',                  org: 'XYZ Events',           meta: 'House · London · Sat 24 Oct · £500-£1,000' },
  { title: 'PRODUCER COLLABORATION',     org: 'Independent',          meta: 'House / Electronic · Remote' },
  { title: 'FESTIVAL APPLICATIONS OPEN', org: 'Berlin House Festival', meta: 'Electronic · Berlin · Deadline 20 Oct' },
  { title: 'MUSIC MARKETING MANAGER',    org: 'XYZ Records',          meta: 'Full-time · London · Hybrid' },
];

export default function OpportunitiesPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="mx-auto w-full max-w-3xl px-6 py-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Find your next opportunity
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Gigs, jobs, collaborations, festivals, and more — all in one place.
          </p>

          <div className="mt-4 flex items-center rounded-full border border-gray-300 bg-white px-4 py-2">
            <input
              type="text"
              placeholder="Search opportunities..."
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <button className="rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white">
              Search
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c.key}
                href={c.key === 'all' ? '/opportunities' : `/opportunities?type=${c.key}`}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium hover:bg-gray-50"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {SAMPLE.map((o) => (
            <div key={o.title} className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="text-xs font-semibold tracking-wider text-gray-400">
                {o.org}
              </div>
              <div className="mt-1 text-lg font-bold text-gray-900">{o.title}</div>
              <div className="mt-1 text-sm text-gray-500">{o.meta}</div>
              <div className="mt-4 flex gap-2">
                <button className="rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white">
                  Apply
                </button>
                <button className="rounded-full border border-gray-300 px-4 py-1.5 text-xs font-medium hover:bg-gray-50">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center">
          <div className="text-sm font-medium text-gray-900">
            Have an opportunity to share?
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Post a gig, job, collaboration, or festival.
          </p>
          <Link
            href="/organizer"
            className="mt-3 inline-block rounded-full bg-black px-4 py-2 text-xs font-medium text-white"
          >
            Post Opportunity
          </Link>
        </div>
      </div>
    </main>
  );
}
