import { Sidebar } from '@/components/sidebar/Sidebar';

export function HomeLoggedIn({ user }: { user?: { name?: string } }) {
  const name = user?.name ?? 'there';

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 py-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3">
          <Sidebar />
        </div>

        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
          <div className="rounded-2xl bg-black text-white p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">You have an artist page</div>
              <div className="text-xs text-white/60">Manage your profile, bookings & releases</div>
            </div>
            <a href="/artist" className="text-sm font-medium hover:underline">View page →</a>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-black text-xs font-bold text-white">
                {name[0]?.toUpperCase() ?? 'U'}
              </span>
              <input
                type="text"
                placeholder={`What's on your mind, ${name}?`}
                className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-black"
              />
            </div>
            <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
              <button>📷 Photo</button>
              <button>📅 Event</button>
              <button>🎵 Music</button>
              <a href="/feed" className="ml-auto rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white">
                Post
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-1 flex">
            <a href="/feed" className="flex-1 rounded-xl bg-black py-2 text-center text-sm font-medium text-white">
              For You
            </a>
            <a href="/feed?tab=following" className="flex-1 rounded-xl py-2 text-center text-sm font-medium text-gray-600">
              Following
            </a>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="text-xs font-semibold tracking-wider text-gray-500 mb-3">
              TRENDING ON GRID
            </div>
            {[
              { label: 'House Nights London', meta: '284 interested' },
              { label: 'DJ Carla new release', meta: '1.2K plays' },
              { label: 'Warehouse Sessions',   meta: 'Selling fast' },
            ].map((t) => (
              <div key={t.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="flex items-center gap-2 text-sm text-gray-700"><span className="h-2 w-2 rounded-full bg-red-500"></span>{t.label}</span>
                <span className="text-xs text-gray-400">{t.meta}</span>
              </div>
            ))}
          </div>

          <a
            href="/feed"
            className="rounded-2xl border border-gray-200 bg-white p-4 text-center text-sm font-medium text-gray-700 hover:border-black"
          >
            View full feed on GRID →
          </a>
        </div>

        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="text-xs font-semibold tracking-wider text-gray-500 mb-3">
              PEOPLE TO FOLLOW
            </div>
            {[
              { name: 'DJ Carla',      sub: 'House · London' },
              { name: 'Mike Producer', sub: 'Electronic · Berlin' },
              { name: 'Sarah A&R',     sub: 'XYZ Records' },
            ].map((p) => (
              <div key={p.name} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-black text-[11px] font-bold text-white">
                  {p.name[0]}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{p.name}</div>
                  <div className="text-xs text-gray-500 truncate">{p.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="text-xs font-semibold tracking-wider text-gray-500 mb-3">
              OPPORTUNITIES FOR YOU
            </div>
            {[
              { title: 'Vocalist wanted',  match: '92%' },
              { title: 'DJ needed — MCR',  match: '89%' },
              { title: 'Producer collab',  match: '85%' },
            ].map((o) => (
              <a
                key={o.title}
                href="/opportunities"
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg px-1"
              >
                <span className="text-sm text-gray-700">✨ {o.title}</span>
                <span className="text-xs text-gray-400">{o.match}</span>
              </a>
            ))}
            <a href="/opportunities" className="mt-3 block text-xs font-medium text-black hover:underline">
              View all opportunities →
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}


