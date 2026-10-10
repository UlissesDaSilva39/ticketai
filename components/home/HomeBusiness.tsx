export function HomeBusiness() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 py-6">
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-700">
            Viewing as: <span className="font-semibold text-gray-900">Your Business</span>
          </div>
          <button className="text-sm font-medium text-gray-600 hover:text-black">
            Switch to Personal
          </button>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Good evening</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Revenue',  value: '—' },
            { label: 'Tickets',  value: '—' },
            { label: 'Events',   value: '—' },
            { label: 'Audience', value: '—' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-4">
              <div className="text-xs text-gray-500">{s.label}</div>
              <div className="mt-1 text-2xl font-bold text-gray-900">{s.value}</div>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: '➕ Create Event',  href: '/organizer/events/new' },
            { label: '🎤 Find Artists',   href: '/artists' },
            { label: '🏟 Find Venues',    href: '/venues' },
            { label: '📊 View Analytics', href: '/organizer/analytics' },
          ].map((a) => (
            <a
              key={a.label}
              href={a.href}
              className="rounded-2xl border border-gray-200 bg-white p-4 text-sm font-medium text-gray-700 hover:border-black"
            >
              {a.label}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
