import Link from 'next/link';

export default function JobsPage() {
  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen">
      <div className="mx-auto max-w-[1128px] px-4 py-6 grid grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Navigation & Profile Card */}
        <nav aria-label="Jobs Sidebar" className="col-span-12 lg:col-span-3 space-y-2">
          
          {/* Profile Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="h-[60px] bg-[#a0b4b7] dark:bg-zinc-800"></div>
            <div className="px-4 pb-4 relative text-center">
              <div className="w-[72px] h-[72px] bg-zinc-800 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center text-2xl font-bold text-white shadow-sm mx-auto -mt-9 mb-2">
                U
              </div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white hover:underline cursor-pointer">Ulisses Bezerra Da Silva</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Founder - CEO @ TicketAI</p>
              <p className="text-xs text-gray-500 mt-0.5">London, England</p>
              <div className="mt-2 text-xs font-medium text-gray-600 flex items-center justify-center gap-1">
                <span className="bg-gray-100 dark:bg-zinc-800 px-1 rounded text-[10px]">in</span> TicketAI
              </div>
            </div>
          </div>

          {/* Jobs Menu */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-3 shadow-sm">
            <ul className="space-y-1 text-sm font-medium text-gray-600 dark:text-gray-300">
              <li>
                <Link href="#" className="flex items-center gap-3 px-2 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition-colors">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
                  Preferences
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-3 px-2 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition-colors">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                  Job tracker
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-3 px-2 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition-colors">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  My Career Insights
                </Link>
              </li>
              <li className="pt-2 mt-2 border-t border-gray-100 dark:border-zinc-800">
                <Link href="#" className="flex items-center gap-3 px-2 py-2 text-emerald-600 dark:text-emerald-500 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  Post a job
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-3 px-2 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition-colors">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  Manage job posts
                </Link>
              </li>
            </ul>
          </div>

          {/* Footer */}
          <div className="px-4 text-[11px] text-center text-gray-500 space-y-1 mt-4">
             <p className="flex flex-wrap justify-center gap-x-2 gap-y-1">
              <a href="#" className="hover:underline">About</a>
              <a href="#" className="hover:underline">Accessibility</a>
              <a href="#" className="hover:underline">Help Center</a>
            </p>
            <p className="flex flex-wrap justify-center gap-x-2 gap-y-1">
              <a href="#" className="hover:underline">Privacy & Terms ⌄</a>
              <a href="#" className="hover:underline">Ad Choices</a>
              <a href="#" className="hover:underline">Advertising</a>
            </p>
            <p className="flex flex-wrap justify-center gap-x-2 gap-y-1">
              <a href="#" className="hover:underline">Business Services ⌄</a>
              <a href="#" className="hover:underline">Get the GRID app</a>
              <a href="#" className="hover:underline">More</a>
            </p>
          </div>
        </nav>

        {/* CENTER COLUMN: Main Content */}
        <main className="col-span-12 lg:col-span-6 space-y-4">
          
          {/* Hiring Banner */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-5 shadow-sm relative">
            <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <div className="flex justify-between items-start">
               <div>
                  <h1 className="text-xl text-gray-900 dark:text-white mb-1">Hi Ulisses, are you hiring?</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Post a free job and add the #Hiring frame to your profile to make a hire, fast.</p>
                  <div className="flex gap-2">
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-4 py-1.5 rounded-full transition-colors">Yes, I'm hiring</button>
                    <button className="border border-gray-400 dark:border-zinc-600 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 font-semibold text-sm px-4 py-1.5 rounded-full transition-colors">No, not right now</button>
                  </div>
               </div>
               <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden border-2 border-purple-500 hidden sm:block">
                  <img src="https://ui-avatars.com/api/?name=U+S&background=random" className="w-full h-full" />
               </div>
            </div>
          </div>

          {/* Jobs Match Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-zinc-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Jobs that match your profile</h2>
              <p className="text-sm text-gray-500 mt-1">Based on your profile and the job criteria</p>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
              
              {/* Job 1 */}
              <div className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-white border border-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-lg">2i</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-600 dark:text-blue-500 hover:underline text-base">Senior Performance Engineer <span className="text-xs text-gray-500 font-normal">(in)</span></h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">2i • London Area, United Kingdom (Hybrid)</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 font-medium">
                      <span className="text-yellow-500">🟨</span> You'd be a top applicant
                    </div>
                    <p className="text-xs text-gray-500 mt-1">2 weeks ago</p>
                  </div>
                </div>
              </div>

              {/* Job 2 */}
              <div className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-white border border-gray-200 rounded flex items-center justify-center flex-shrink-0 text-gray-800 font-bold text-sm">
                    SAVANT
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-600 dark:text-blue-500 hover:underline text-base">Quality Assurance Engineer <span className="text-xs text-gray-500 font-normal">(in)</span></h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">Savant Recruitment Experts • London Area, United Kingdom (Hybrid)</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 font-medium">
                      <span className="text-yellow-500">🟨</span> You'd be a top applicant
                    </div>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">1 week ago <span className="bg-blue-100 text-blue-800 px-1 rounded-sm font-semibold">in</span> Easy Apply</p>
                  </div>
                </div>
              </div>

              {/* Promo block */}
              <div className="p-4 bg-gray-50 dark:bg-zinc-800/20">
                <div className="flex gap-3 items-center mb-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white dark:border-zinc-900 z-10"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white dark:border-zinc-900 z-20"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-white dark:border-zinc-900 z-30"></div>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold flex-1">See the full list of jobs where you'd be a top applicant</p>
                </div>
                <p className="text-xs text-gray-500 mb-3">Mangesh and millions of other members use Premium</p>
                <button className="bg-[#f8c77e] hover:bg-[#e5b26b] text-[#5d4008] font-semibold text-sm px-4 py-1.5 rounded-full transition-colors">Restart Premium for £0</button>
                <p className="text-[10px] text-gray-500 mt-2">1-month free trial. Easy to cancel. We'll remind you 7 days before your trial ends.</p>
              </div>

            </div>
          </div>
        </main>

        {/* RIGHT COLUMN: Empty to maintain grid */}
        <aside className="col-span-12 lg:col-span-3 space-y-2 hidden lg:block">
        </aside>

      </div>
    </div>
  );
}