import Link from 'next/link';

export default function NotificationsPage() {
  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen">
      <div className="mx-auto max-w-[1128px] px-4 py-6 grid grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Navigation */}
        <nav aria-label="Notifications Sidebar" className="col-span-12 lg:col-span-3 space-y-2">
          
          {/* Main Filter Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <h2 className="font-semibold text-gray-900 dark:text-white text-lg mb-4">Manage your notifications</h2>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link href="#" className="flex items-center gap-3 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-500 rounded-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                  All Notifications
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  My Posts
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/></svg>
                  Mentions
                </Link>
              </li>
            </ul>
          </div>

          {/* Settings Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <h2 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Notification settings</h2>
            <p className="text-xs text-gray-500 mb-3">Choose what you want to be notified about, and how.</p>
            <Link href="#" className="text-sm font-semibold text-emerald-600 hover:text-emerald-500 hover:underline">Manage settings</Link>
          </div>
        </nav>

        {/* CENTER COLUMN: Notification Feed */}
        <main className="col-span-12 lg:col-span-6 space-y-2">
          
          {/* Header Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</h1>
            <div className="flex gap-4 text-xs font-semibold text-gray-500">
              <button className="hover:text-gray-900 dark:hover:text-white">Mark all as read</button>
              <button className="hover:text-gray-900 dark:hover:text-white">Settings</button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            
            {/* Notification 1 (Unread) */}
            <div className="flex items-start gap-3 p-4 bg-emerald-50/50 dark:bg-emerald-900/10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer border-b border-gray-100 dark:border-zinc-800 transition-colors">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Sarah+Jenkins&background=random" className="w-full h-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  <span className="font-semibold text-gray-900 dark:text-white">Sarah Jenkins</span> and 14 others viewed your profile.
                </p>
                <p className="text-xs text-gray-500 mt-1">2h ago</p>
              </div>
              <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full mt-1.5 flex-shrink-0"></div>
            </div>

            {/* Notification 2 (Unread) */}
            <div className="flex items-start gap-3 p-4 bg-emerald-50/50 dark:bg-emerald-900/10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer border-b border-gray-100 dark:border-zinc-800 transition-colors">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">in</div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  <span className="font-semibold text-gray-900 dark:text-white">LinkedIn News</span> shared a new article: "Tech layoffs hit London startups".
                </p>
                <p className="text-xs text-gray-500 mt-1">5h ago</p>
              </div>
              <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full mt-1.5 flex-shrink-0"></div>
            </div>

            {/* Notification 3 (Read) */}
            <div className="flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer border-b border-gray-100 dark:border-zinc-800 transition-colors">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                 <img src="https://ui-avatars.com/api/?name=David+Chen&background=random" className="w-full h-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  <span className="font-semibold text-gray-900 dark:text-white">David Chen</span> commented on your post: "This is exactly what I was looking for. Great insight!"
                </p>
                <p className="text-xs text-gray-500 mt-1">1d ago</p>
              </div>
            </div>

            {/* Notification 4 (Read) */}
            <div className="flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors">
              <div className="w-12 h-12 bg-indigo-500 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-lg">G</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  <span className="font-semibold text-gray-900 dark:text-white">GRID Corporation</span> posted a new event: "Tech Networking Mixer - London".
                </p>
                <p className="text-xs text-gray-500 mt-1">2d ago</p>
              </div>
            </div>

          </div>
        </main>

        {/* RIGHT COLUMN: Empty for layout balance */}
        <aside className="col-span-12 lg:col-span-3 space-y-2 hidden lg:block">
        </aside>

      </div>
    </div>
  );
}