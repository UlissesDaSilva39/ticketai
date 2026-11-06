import Link from 'next/link';

export default function FeedHeader() {
  return (
    <div className="space-y-4">
      
      {/* Facebook Style Composer */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-zinc-800 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold overflow-hidden">
            <img src="https://ui-avatars.com/api/?name=Ulisses+Silva&background=random" className="w-full h-full object-cover" />
          </div>
          <button className="flex-1 text-left bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-500 rounded-full px-4 py-2.5 text-sm font-medium transition-colors">
            What's on your mind, Ulisses?
          </button>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-zinc-800">
          <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
            <span className="text-red-500 text-lg">🎥</span> Live video
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
            <span className="text-green-500 text-lg">🖼️</span> Photo/video
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
            <span className="text-yellow-500 text-lg">😊</span> Feeling/activity
          </button>
        </div>
      </div>

      {/* Facebook Style Stories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Create Story */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm cursor-pointer group relative h-48 flex flex-col">
          <div className="h-3/4 overflow-hidden relative">
             <img src="https://ui-avatars.com/api/?name=Ulisses+Silva&background=random&size=150" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          </div>
          <div className="h-1/4 flex flex-col items-center justify-end pb-2 relative bg-white dark:bg-zinc-900">
            <div className="absolute -top-4 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white border-4 border-white dark:border-zinc-900 font-bold">+</div>
            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-2">Create story</span>
          </div>
        </div>

        {/* Story 1 */}
        <div className="bg-gray-300 rounded-xl overflow-hidden shadow-sm cursor-pointer group relative h-48">
          <img src="https://ui-avatars.com/api/?name=Pablo&background=random&size=150" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          <div className="absolute top-2 left-2 w-8 h-8 rounded-full border-2 border-blue-500 overflow-hidden bg-gray-200">
             <img src="https://ui-avatars.com/api/?name=Pablo&background=random" className="w-full h-full object-cover" />
          </div>
          <div className="absolute bottom-2 left-2 text-white font-semibold text-xs drop-shadow-md">Pablo</div>
        </div>

        {/* Story 2 */}
        <div className="bg-gray-300 rounded-xl overflow-hidden shadow-sm cursor-pointer group relative h-48">
          <img src="https://ui-avatars.com/api/?name=Sarah&background=random&size=150" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          <div className="absolute top-2 left-2 w-8 h-8 rounded-full border-2 border-blue-500 overflow-hidden bg-gray-200">
             <img src="https://ui-avatars.com/api/?name=Sarah&background=random" className="w-full h-full object-cover" />
          </div>
          <div className="absolute bottom-2 left-2 text-white font-semibold text-xs drop-shadow-md">Sarah</div>
        </div>

        {/* Story 3 */}
        <div className="bg-gray-300 rounded-xl overflow-hidden shadow-sm cursor-pointer group relative h-48">
          <img src="https://ui-avatars.com/api/?name=David&background=random&size=150" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          <div className="absolute top-2 left-2 w-8 h-8 rounded-full border-2 border-blue-500 overflow-hidden bg-gray-200">
             <img src="https://ui-avatars.com/api/?name=David&background=random" className="w-full h-full object-cover" />
          </div>
          <div className="absolute bottom-2 left-2 text-white font-semibold text-xs drop-shadow-md">David</div>
        </div>
      </div>

    </div>
  );
}