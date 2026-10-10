'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { Sparkles, MapPin, Clock } from 'lucide-react';
import { ApplyModal } from '@/components/opportunities/ApplyModal';

type Opportunity = {
  id: string;
  title: string;
  org: string;
  category: string;
  location: string;
  compensation: string;
  deadline?: string | null;
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

export default function OpportunitiesPage() {
  const [active, setActive] = useState('all');
  const [items, setItems] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyTo, setApplyTo] = useState<Opportunity | null>(null);

  useEffect(() => {
    setLoading(true);
    const qs = active === 'all' ? '' : `?type=${active}`;
    fetch(`/api/opportunities${qs}`)
      .then((r) => r.json())
      .then((d) => setItems(d.opportunities ?? []))
      .finally(() => setLoading(false));
  }, [active]);

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 py-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3">
          <Sidebar />
        </div>

        <div className="col-span-12 lg:col-span-9 flex flex-col gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Find your next opportunity
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Gigs, jobs, collaborations, festivals, and more.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setActive(c.key)}
                  className={
                    'rounded-full px-3 py-1 text-xs font-medium transition ' +
                    (active === c.key
                      ? 'bg-black text-white'
                      : 'border border-gray-200 bg-white hover:bg-gray-50')
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-gray-400" />
              <div className="mt-3 text-sm font-medium text-gray-900">
                No opportunities yet
              </div>
              <p className="mt-1 text-xs text-gray-500">Post the first one.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((o) => (
                <div key={o.id} className="rounded-2xl border border-gray-200 bg-white p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                    <Sparkles className="h-3 w-3 text-fuchsia-500" />
                    {o.org}
                  </div>
                  <div className="mt-1 text-lg font-bold text-gray-900">{o.title}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    {o.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {o.location}
                      </span>
                    )}
                    {o.compensation && <span>{o.compensation}</span>}
                    {o.deadline && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Apply by {new Date(o.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setApplyTo(o)}
                      className="rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white"
                    >
                      Apply
                    </button>
                    <button className="rounded-full border border-gray-300 px-4 py-1.5 text-xs font-medium hover:bg-gray-50">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center">
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
      </div>

      {applyTo && (
        <ApplyModal opportunity={applyTo} onClose={() => setApplyTo(null)} />
      )}
    </main>
  );
}
