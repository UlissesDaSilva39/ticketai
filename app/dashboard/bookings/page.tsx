import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { BookingRow } from '@/components/dashboard/BookingRow';

type SearchParams = { searchParams: Promise<{ tab?: string }> };

const TABS = ['pending', 'confirmed', 'completed'] as const;
type Tab = (typeof TABS)[number];

export default async function BookingsDashboardPage({ searchParams }: SearchParams) {
  const supabase = await createServerSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { tab: rawTab } = await searchParams;
  const tab: Tab = (TABS as readonly string[]).includes(rawTab ?? '')
    ? (rawTab as Tab)
    : 'pending';

  // Get the artist row for this user
  const { data: artist } = await supabase
    .from('artists')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!artist) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-black tracking-tight">Bookings</h1>
        <p className="mt-4 text-base text-neutral-600">
          You don&apos;t have an artist profile yet.
        </p>
        <Link
          href="/artists/apply"
          className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          Create your artist profile →
        </Link>
      </div>
    );
  }

  // Fetch bookings for this artist, filtered by tab
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      id,
      service,
      start_date,
      details,
      status,
      booker:booker_id (id, username, display_name)
    `)
    .eq('artist_id', artist.id)
    .eq('status', tab)
    .order('created_at', { ascending: false })
    .limit(50);

  // Fetch counts for all tabs
  const counts: Record<string, number> = {};
  for (const t of TABS) {
    const { count } = await supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('artist_id', artist.id)
      .eq('status', t);
    counts[t] = count ?? 0;
  }

  const list = bookings ?? [];

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Bookings</h1>
        <p className="mt-2 text-base text-neutral-600">
          Manage incoming booking requests, contracts, and payouts.
        </p>
      </header>

      <nav className="mt-8 flex gap-2 border-b border-neutral-200">
        {TABS.map((t) => (
          <Link
            key={t}
            href={`/dashboard/bookings?tab=${t}`}
            className={
              'border-b-2 px-4 py-3 text-sm font-semibold capitalize transition ' +
              (tab === t
                ? 'border-black text-black'
                : 'border-transparent text-neutral-500 hover:text-black')
            }
          >
            {t} <span className="ml-1 text-neutral-400">({counts[t] ?? 0})</span>
          </Link>
        ))}
      </nav>

      <section className="mt-6">
        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center">
            <p className="text-base font-semibold">No {tab} bookings</p>
            <p className="mt-1 text-sm text-neutral-500">
              {tab === 'pending'
                ? 'New booking requests will appear here.'
                : tab === 'confirmed'
                ? 'Confirmed bookings will appear here.'
                : 'Completed bookings will appear here once projects finish.'}
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {list.map((b: any) => (
              <BookingRow
                key={b.id}
                booking={{
                  id: b.id,
                  service: b.service,
                  startDate: b.start_date,
                  details: b.details,
                  status: b.status,
                  booker: {
                    username: b.booker?.username ?? 'unknown',
                    displayName: b.booker?.display_name ?? b.booker?.username ?? 'Unknown',
                  },
                }}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}