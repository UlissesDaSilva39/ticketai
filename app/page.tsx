import Link from 'next/link';
import { Sidebar } from '@/components/sidebar/Sidebar';

export default function HomePage() {
  return (
    <div className="bg-gray-100 dark:bg-black min-h-screen">
      <div className="mx-auto max-w-[1128px] px-4 py-6 grid grid-cols-12 gap-6">
        
        {/* LEFT COLUMN */}
        <nav aria-label="Sidebar" className="col-span-12 lg:col-span-3">
          <Sidebar />
        </nav>

        {/* CENTER COLUMN */}
        <main className="col-span-12 lg:col-span-6 space-y-2">
          
          {/* Premium Banner with GRID Green Button */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">80% of professionals find networking key to career success.</h2>
              <p className="text-sm text-gray-500 dark:text-zinc-400 mb-3">Grow your connections with Premium.</p>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-4 py-1.5 rounded-full transition-colors">Try Premium for £0</button>
              <p className="text-xs text-gray-500 mt-2">1-month free trial. Cancel anytime.</p>
            </div>
            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex-shrink-0 hidden sm:block"></div>
          </div>

          {/* Composer */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <div className="flex gap-3 mb-3">
              <div className="w-12 h-12 bg-zinc-800 dark:bg-zinc-700 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-lg">U</div>
              <button className="flex-1 text-left border border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-500 font-semibold rounded-full px-4 py-2.5 transition-colors">
                Start a post
              </button>
            </div>
            <div className="flex justify-between items-center px-1">
              <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 px-3 py-2 rounded transition-colors">
                <span className="text-emerald-600 text-lg">🎥</span> Video
              </button>
              <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 px-3 py-2 rounded transition-colors">
                <span className="text-emerald-600 text-lg">🖼️</span> Photo
              </button>
              <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 px-3 py-2 rounded transition-colors">
                <span className="text-emerald-600 text-lg">📝</span> Write article
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2 py-1">
            <div className="h-px bg-gray-300 dark:bg-zinc-800 flex-1"></div>
            <span className="text-xs text-gray-500">Sort by: <span className="font-semibold text-black dark:text-white">Top</span></span>
          </div>

          {/* Post */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">P</div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm hover:underline cursor-pointer flex items-center gap-1">PrepNxt <span className="text-xs font-normal text-gray-500">• 2d</span></p>
                    <p className="text-xs text-gray-500">1,072 followers</p>
                  </div>
                </div>
                <button className="text-emerald-600 dark:text-emerald-500 font-semibold text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-3 py-1 rounded transition-colors">+ Follow</button>
              </div>
              <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-3">
                🏔️ 𝐓𝐡𝐞 𝐐𝐀 𝐀𝐮𝐭𝐨𝐦𝐚𝐭𝐢𝐨𝐧 𝐉𝐨𝐮𝐫𝐧𝐞𝐲 𝐈𝐬 𝐄𝐯𝐨𝐥𝐯𝐢𝐧𝐠. 𝐀𝐫𝐞 𝐘𝐨𝐮 𝐑𝐞𝐚𝐝𝐲 𝐟𝐨𝐫 𝐭𝐡𝐞 𝐍𝐞𝐱𝐭 𝐌𝐨𝐮𝐧𝐭𝐚𝐢𝐧? Every generation of QA professionals has faced a new set of technologies to master...
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-zinc-800 p-4 border-t border-gray-100 dark:border-zinc-800 text-center">
                <p className="text-xl font-bold text-gray-900 dark:text-white">Life of a QA in the AI Era</p>
            </div>

            <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-500 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-1">
                <span className="bg-emerald-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">👍</span>
                <span>1,072</span>
              </div>
              <span>7 comments • 175 reposts</span>
            </div>
            
            <div className="px-2 py-1 flex justify-between">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-gray-500 hover:text-emerald-600 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition-colors">👍 Like</button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-gray-500 hover:text-emerald-600 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition-colors">💬 Comment</button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-gray-500 hover:text-emerald-600 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition-colors">🔁 Repost</button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-gray-500 hover:text-emerald-600 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition-colors">✈️ Send</button>
            </div>
          </div>
        </main>

        {/* RIGHT COLUMN */}
        <aside className="col-span-12 lg:col-span-3 space-y-2 hidden lg:block">
          
          {/* LinkedIn News */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Grid News</h2>
              <button className="text-gray-500">ℹ️</button>
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="block hover:bg-gray-100 dark:hover:bg-zinc-800 p-1 -m-1 rounded transition-colors">
                  <p className="font-semibold text-gray-800 dark:text-gray-200 leading-tight">London faces Tube strikes in Christmas period</p>
                  <p className="text-xs text-gray-500 mt-1">7m ago</p>
                </a>
              </li>
              <li>
                <a href="#" className="block hover:bg-gray-100 dark:hover:bg-zinc-800 p-1 -m-1 rounded transition-colors">
                  <p className="font-semibold text-gray-800 dark:text-gray-200 leading-tight">Canva's exit package sparks wider conversation on layoffs</p>
                  <p className="text-xs text-gray-500 mt-1">1h ago • 6,072 readers</p>
                </a>
              </li>
              <li>
                <a href="#" className="block hover:bg-gray-100 dark:hover:bg-zinc-800 p-1 -m-1 rounded transition-colors">
                  <p className="font-semibold text-gray-800 dark:text-gray-200 leading-tight">Supermarket hacks expose supply chain weak links</p>
                  <p className="text-xs text-gray-500 mt-1">7h ago • 878 readers</p>
                </a>
              </li>
            </ul>
            <button className="text-sm font-semibold text-gray-500 hover:text-gray-800 mt-3 flex items-center gap-1">Show more news</button>
          </div>

          {/* Today's Puzzles */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm sticky top-20">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Today's puzzles</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-zinc-800 p-1 -m-1 rounded cursor-pointer transition-colors">
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded flex items-center justify-center text-emerald-600 font-bold">Z</div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 leading-tight">Zip #599</p>
                  <p className="text-xs text-gray-500">70 connections played</p>
                </div>
              </li>
              <li className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-zinc-800 p-1 -m-1 rounded cursor-pointer transition-colors">
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded flex items-center justify-center text-emerald-600 font-bold">W</div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 leading-tight">Wend #151</p>
                  <p className="text-xs text-gray-500">37 connections played</p>
                </div>
              </li>
            </ul>
            <button className="text-sm font-semibold text-gray-500 hover:text-gray-800 mt-3 flex items-center gap-1">Show more</button>
          </div>

        </aside>

      </div>
    </div>
  );
}