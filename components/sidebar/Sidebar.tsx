import Link from 'next/link';

export function Sidebar() {
  return (
    <div className="space-y-2">
      
      {/* 1. Profile Card */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="h-[60px] bg-[#a0b4b7] dark:bg-gray-800"></div>
        <div className="px-4 pb-4 relative text-center">
          <div className="w-[72px] h-[72px] bg-zinc-800 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center text-2xl font-bold text-white shadow-sm mx-auto -mt-9 mb-2">
            U
          </div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white hover:underline cursor-pointer">Ulisses Bezerra Da Silva</h2>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Founder - CEO @ TicketAI</p>
          <p className="text-xs text-gray-500 mt-0.5">London, England</p>
        </div>
      </div>

      {/* 2. Premium Ad Card */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 shadow-sm text-left">
        <p className="text-xs text-gray-500 mb-1">Unlock Premium tools & insights</p>
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2"><span className="text-yellow-600">🟨</span> Retry now for £0</p>
      </div>

      {/* 3. Stats Card */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 shadow-sm text-sm">
        <Link href="#" className="flex items-center justify-between py-1 group">
          <span className="text-gray-500 group-hover:text-gray-900">Profile viewers</span>
          <span className="font-semibold text-blue-600">47</span>
        </Link>
        <Link href="#" className="flex items-center justify-between py-1 group mt-1">
          <span className="text-gray-500 group-hover:text-gray-900">Post impressions</span>
          <span className="font-semibold text-blue-600">57</span>
        </Link>
      </div>

      {/* 4. Navigation Card */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 shadow-sm text-sm">
        <Link href="#" className="flex items-center gap-2 py-2 text-gray-500 hover:text-gray-900 font-medium">
           <span className="text-lg">🔖</span> Saved items
        </Link>
        <Link href="#" className="flex items-center gap-2 py-2 text-gray-500 hover:text-gray-900 font-medium">
           <span className="text-lg">👥</span> Groups
        </Link>
        <Link href="#" className="flex items-center gap-2 py-2 text-gray-500 hover:text-gray-900 font-medium">
           <span className="text-lg">📰</span> Newsletters
        </Link>
        <Link href="#" className="flex items-center gap-2 py-2 text-gray-500 hover:text-gray-900 font-medium">
           <span className="text-lg">📅</span> Events
        </Link>
      </div>

    </div>
  );
}