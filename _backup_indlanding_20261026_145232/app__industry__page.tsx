import Link from 'next/link';
import { INDUSTRY_NAV_COLUMNS } from '@/config/industryNav';

export default function IndustryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="inline-block rounded-full bg-violet-100 text-violet-700 px-4 py-1 text-sm font-semibold mb-4">
            GRID Industry Marketplace
          </div>
          <h1 className="text-5xl font-bold mb-4">Hire anyone in live music</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            38 professional roles. One marketplace. Book producers, engineers, designers,
            promoters, and venues — all vetted, all with riders, all with references.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/industry/post-job" className="rounded-full bg-black text-white px-6 py-3 font-semibold hover:bg-neutral-800">
              Post a job →
            </Link>
            <Link href="/rider" className="rounded-full border border-gray-300 text-gray-900 px-6 py-3 font-semibold hover:bg-gray-50">
              Build a rider
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Browse by category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INDUSTRY_NAV_COLUMNS.map((col) => (
            <div key={col.category} className="rounded-2xl border border-gray-200 bg-white p-6 hover:border-violet-300 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Link href={col.categoryHref} className="text-xl font-bold text-gray-900 hover:text-violet-600">
                    {col.label}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">{col.description}</p>
                </div>
                <Link href={col.categoryHref} className="text-sm font-medium text-violet-600 hover:text-violet-700">
                  Browse →
                </Link>
              </div>
              <ul className="grid grid-cols-2 gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-neutral-600 hover:text-violet-600">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
