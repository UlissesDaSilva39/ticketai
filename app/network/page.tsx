import Link from 'next/link';

export const metadata = {
  title: 'Network',
  description: 'Connect with the people building music.',
};

const CATEGORIES = [
  { label: 'People',        href: '/people' },
  { label: 'Artists',       href: '/artists' },
  { label: 'Promoters',     href: '/promoters' },
  { label: 'Venues',        href: '/venues' },
  { label: 'Friends',       href: '/friends' },
  { label: 'Messages',      href: '/messages' },
  { label: 'Following',     href: '/following' },
  { label: 'Opportunities', href: '/opportunities' },
];

export default function NetworkPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="mx-auto w-full max-w-3xl px-6 py-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h1 className="text-2xl font-bold text-gray-900">Network</h1>
          <p className="mt-1 text-sm text-gray-500">
            Connect with the people building music.
          </p>

          <div className="mt-4 flex items-center rounded-full border border-gray-300 bg-white px-4 py-2">
            <input
              type="text"
              placeholder="Search artists, DJs, producers, managers, promoters..."
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <Link
              href="/search"
              className="rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white"
            >
              Search
            </Link>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="rounded-2xl border border-gray-200 bg-white p-4 text-sm font-medium text-gray-700 hover:border-black"
            >
              {c.label}
            </Link>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
          <div className="text-xs font-semibold tracking-wider text-gray-500 mb-3">
            NETWORK FEED
          </div>

          <div className="rounded-xl border border-gray-100 p-4 mb-3">
            <div className="text-sm font-semibold text-gray-900">Sarah Johnson</div>
            <div className="text-xs text-gray-500">Producer · London</div>
            <p className="mt-2 text-sm text-gray-700">
              "Looking for a vocalist for a new house project."
            </p>
            <div className="mt-3 flex gap-2">
              <button className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium hover:bg-gray-50">
                Connect
              </button>
              <Link
                href="/messages"
                className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium hover:bg-gray-50"
              >
                Message
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 p-4">
            <div className="text-sm font-semibold text-gray-900">James Wilson</div>
            <div className="text-xs text-gray-500">Promoter · London</div>
            <p className="mt-2 text-sm text-gray-700">
              "Looking for DJs for October events."
            </p>
            <div className="mt-3">
              <Link
                href="/opportunities"
                className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium hover:bg-gray-50"
              >
                View Opportunity
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
