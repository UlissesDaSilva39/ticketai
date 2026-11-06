import Link from 'next/link';

export default function MarketplacePage() {
  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen">
      <div className="mx-auto max-w-[1128px] px-4 py-6 grid grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Filters */}
        <nav aria-label="Marketplace Filters" className="col-span-12 lg:col-span-3 space-y-2">
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Categories</h2>
            <ul className="space-y-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              <li><Link href="#" className="block text-emerald-600 dark:text-emerald-500">All Tracks</Link></li>
              <li><Link href="#" className="block hover:text-gray-900 dark:hover:text-white">Exclusive Rights</Link></li>
              <li><Link href="#" className="block hover:text-gray-900 dark:hover:text-white">Lease / Non-Exclusive</Link></li>
              <li><Link href="#" className="block hover:text-gray-900 dark:hover:text-white">Beat Packs</Link></li>
              <li><Link href="#" className="block hover:text-gray-900 dark:hover:text-white">Mixing Services</Link></li>
              <li><Link href="#" className="block hover:text-gray-900 dark:hover:text-white">Studio Gear</Link></li>
            </ul>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Price Range</h2>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" /> Under £50</label>
              <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" /> £50 - £200</label>
              <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" /> £200 - £500</label>
              <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" /> £500+</label>
            </div>
          </div>
        </nav>

        {/* CENTER COLUMN: Track Listings */}
        <main className="col-span-12 lg:col-span-6 space-y-4">
          
          {/* Header */}
          <div className="flex justify-between items-center bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Marketplace</h1>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-2 rounded-md transition-colors">Sell a Track</button>
          </div>

          {/* Track Listing 1 */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm flex gap-4">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-3xl flex-shrink-0 shadow-inner">
              🎵
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h2 className="font-bold text-gray-900 dark:text-white text-base">Midnight Drive (Exclusive)</h2>
                  <span className="font-bold text-emerald-600 text-lg">£250</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">By <span className="font-semibold text-gray-700 dark:text-gray-300">Alex Rivera</span> · Synthwave / House</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">Hard-hitting analog bassline with retro 80s synths. Perfect for a vocal feature.</p>
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
                <div className="flex gap-2">
                  <button className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1"><span>▶</span> Preview</button>
                  <button className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 text-xs font-bold px-3 py-1.5 rounded">License</button>
                </div>
                <button className="text-xs font-bold text-gray-500 hover:text-emerald-600">Message Seller</button>
              </div>
            </div>
          </div>

          {/* Track Listing 2 */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm flex gap-4">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center text-white text-3xl flex-shrink-0 shadow-inner">
              🎸
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h2 className="font-bold text-gray-900 dark:text-white text-base">Acoustic Sunset (Lease)</h2>
                  <span className="font-bold text-emerald-600 text-lg">£45</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">By <span className="font-semibold text-gray-700 dark:text-gray-300">Mia Chen</span> · Pop / Acoustic</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">Warm acoustic guitars with a driving percussion loop. Ideal for singer-songwriters.</p>
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
                <div className="flex gap-2">
                  <button className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1"><span>▶</span> Preview</button>
                  <button className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 text-xs font-bold px-3 py-1.5 rounded">License</button>
                </div>
                <button className="text-xs font-bold text-gray-500 hover:text-emerald-600">Message Seller</button>
              </div>
            </div>
          </div>

        </main>

        {/* RIGHT COLUMN: Seller Tips */}
        <aside className="col-span-12 lg:col-span-3 space-y-2 hidden lg:block">
           <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Selling Tips</h2>
             <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Tracks with high-quality artwork and a 30-second audio preview sell 3x faster.</p>
             <Link href="#" className="text-sm font-semibold text-emerald-600 hover:underline">Read the Seller Guide</Link>
           </div>
        </aside>

      </div>
    </div>
  );
}