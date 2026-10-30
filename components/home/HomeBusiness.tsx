import { Plus, Mic, Building2, BarChart3 } from 'lucide-react';

export function HomeBusiness() {
  return (
    <main className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 py-6">
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Viewing as: <span className="font-semibold text-gray-900 dark:text-gray-100">Your Business</span>
          </div>
          <button className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
            Switch to Personal
          </button>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Good evening</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Revenue',  value: 'â€”' },
            { label: 'Tickets',  value: 'â€”' },
            { label: 'Events',   value: 'â€”' },
            { label: 'Audience', value: 'â€”' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
              <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">{s.value}</div>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Plus,       label: 'Create Event',   href: '/organizer/events/new' },
            { icon: Mic,        label: 'Find Artists',  href: '/artists' },
            { icon: Building2,  label: 'Find Venues',   href: '/venues' },
            { icon: BarChart3,  label: 'View Analytics', href: '/organizer/analytics' },
          ].map((a) => {
            const IconCmp = a.icon;
            return (
              <a
                key={a.label}
                href={a.href}
                className="flex items-center gap-2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-black"
              >
                <IconCmp className="h-4 w-4" />
                {a.label}
              </a>
            );
          })}
        </div>
      </div>
    </main>
  );
}

