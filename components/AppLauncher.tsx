import Link from 'next/link';

export default function AppLauncher() {
  return (
    <div className="hidden 2xl:block fixed left-4 top-[70px] w-[240px] space-y-1">
      <Link href="/profile" className="flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer">
        <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-white text-xs font-bold">U</div>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Ulisses Da Silva</span>
      </Link>
      <Link href="#" className="flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer">
        <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-lg">✨</div>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">GRID AI</span>
      </Link>
      <Link href="/network" className="flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg">👥</div>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Network</span>
      </Link>
      <Link href="#" className="flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer">
        <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white text-lg">⏱️</div>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Memories</span>
      </Link>
      <Link href="#" className="flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer">
        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-lg">🔖</div>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Saved</span>
      </Link>
      <Link href="#" className="flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg">👥</div>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Groups</span>
      </Link>
      <Link href="#" className="flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer">
        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-lg">🎬</div>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Reels</span>
      </Link>
      <Link href="#" className="flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg">🛍️</div>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Marketplace</span>
      </Link>
      <hr className="border-gray-300 dark:border-zinc-800 my-2" />
      <Link href="#" className="flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer">
        <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white text-lg">📰</div>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Feeds</span>
      </Link>
      <Link href="#" className="flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer">
        <div className="w-8 h-8 bg-red-400 rounded-full flex items-center justify-center text-white text-lg">📅</div>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Events</span>
      </Link>
      <Link href="#" className="flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer">
        <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white text-lg">📊</div>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Ads Manager</span>
      </Link>
      <Link href="#" className="flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer">
        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-lg">⌄</div>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">See less</span>
      </Link>
    </div>
  );
}