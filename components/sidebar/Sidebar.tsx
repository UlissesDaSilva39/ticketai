import { SIDEBAR_LIBRARY } from '@/config/sidebar';
import { Icon } from '@/components/ui/Icon';

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col gap-4 w-64 pb-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-2 texl-xs font-semibold tracking-wider text-gray-500 mb-3">
          <Icon name="grid" className="w-4 h-4" />
          YOUR LIBRARY
        </div>
        <nav className="flex flex-col">
          {SIDEBAR_LIBRARY.map((section) => (
            <div key={section.section} className="flex flex-col py-2 border-b border-gray-100 last:border-0">
              {section.items.map((item) => (
                <a key={item.href} href={item.href} className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                  <Icon name={item.icon as any} className="w-5 h-5 text-gray-500" />
                  {item.label}
                </a>
              ))}
            </div>
          ))}
        </nav>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-1">
          <Icon name="compass" className="w-5 h-5" />
          Find events near you
        </div>
        <p className="text-xs text-gray-500 mb-3">Browse by city, genre, and date.</p>
        <a href="/events" className="block w-full text-center rounded-full border border-gray-900 px-4 py-2 text-sm font-medium hover:bg-gray-900 hover:text-white transition">
          Explore
        </a>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-1">
          <Icon name="sparkle" className="w-5 h-5" />
          Grow on GRID
        </div>
        <p className="text-xs text-gray-500 mb-3">Get verified, unlock booking tools and AI.</p>
        <a href="/for-promoters" className="block w-full text-center rounded-full border border-gray-900 px-4 py-2 text-sm font-medium hover:bg-gray-900 hover:text-white transition">
          Upgrade to Pro
        </a>
      </div>
    </aside>
  );
}

