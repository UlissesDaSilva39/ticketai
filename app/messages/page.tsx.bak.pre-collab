import Link from 'next/link';

export default function MessagesPage() {
  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-[calc(100vh-52px)]">
      <div className="mx-auto max-w-[1128px] px-4 py-6 grid grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Full Page Messaging Window */}
        <main className="col-span-12 lg:col-span-8 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col h-[calc(100vh-120px)] overflow-hidden">
          
          {/* Header with Search */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Messaging</h1>
              <div className="relative w-64 hidden sm:block">
                <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input type="text" placeholder="Search messages" className="w-full bg-[#edf3f8] dark:bg-zinc-800 text-sm rounded px-3 pl-9 py-1.5 focus:outline-none" />
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-500">
              <button className="hover:bg-gray-100 dark:hover:bg-zinc-800 p-1.5 rounded-full font-bold">···</button>
              <button className="hover:bg-gray-100 dark:hover:bg-zinc-800 p-1.5 rounded-full">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 p-4 pb-2 border-b border-gray-200 dark:border-zinc-800 overflow-x-auto">
            <button className="bg-emerald-700 text-white font-semibold text-xs px-3 py-1.5 rounded-full flex items-center gap-1">Inbox <span className="text-[10px]">⌄</span></button>
            <button className="border border-gray-400 dark:border-zinc-600 text-gray-700 dark:text-gray-300 font-semibold text-xs px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">Jobs</button>
            <button className="border border-gray-400 dark:border-zinc-600 text-gray-700 dark:text-gray-300 font-semibold text-xs px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">Unread</button>
            <button className="border border-gray-400 dark:border-zinc-600 text-gray-700 dark:text-gray-300 font-semibold text-xs px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">Connections</button>
            <button className="border border-gray-400 dark:border-zinc-600 text-gray-700 dark:text-gray-300 font-semibold text-xs px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">InMail</button>
            <button className="border border-gray-400 dark:border-zinc-600 text-gray-700 dark:text-gray-300 font-semibold text-xs px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">Starred</button>
          </div>

          {/* Split View: List on Left, Chat on Right */}
          <div className="flex flex-1 overflow-hidden">
            
            {/* Message List */}
            <div className="w-[340px] border-r border-gray-200 dark:border-zinc-800 overflow-y-auto hidden md:block">
              
              {/* Active Message */}
              <div className="flex items-start gap-3 p-3 bg-[#edf3f8] dark:bg-zinc-800/50 border-l-4 border-emerald-600 cursor-pointer">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">in</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">LinkedIn Talent Solu...</p>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">4:08 PM</span>
                  </div>
                  <p className="text-xs text-gray-800 dark:text-gray-300 font-semibold truncate">LinkedIn Offer • Worried</p>
                  <p className="text-xs text-gray-500 truncate">you'll make the wrong hire?</p>
                </div>
              </div>

              {/* Message 2 */}
              <div className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer border-b border-gray-100 dark:border-zinc-800/50">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">E</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">Euronext Corporate ...</p>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">Nov 3</span>
                  </div>
                  <p className="text-xs text-gray-800 dark:text-gray-300 font-semibold truncate">Sponsored • Your invitation</p>
                </div>
              </div>

              {/* Message 3 */}
              <div className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer border-b border-gray-100 dark:border-zinc-800/50">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                  <img src="https://ui-avatars.com/api/?name=Edd+Holmwood&background=random" className="w-full h-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">Edd Holmwood</p>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">Oct 30</span>
                  </div>
                  <p className="text-xs text-gray-800 dark:text-gray-300 font-semibold truncate">InMail • Any Upcoming Projects...</p>
                </div>
              </div>
            </div>

            {/* Conversation View */}
            <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 hidden sm:flex">
              
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center">
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white text-base">LinkedIn Talent Solutions</h2>
                  <p className="text-xs text-gray-500">LinkedIn Offer</p>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <button className="hover:bg-gray-100 dark:hover:bg-zinc-800 p-1.5 rounded-full">···</button>
                  <button className="hover:bg-gray-100 dark:hover:bg-zinc-800 p-1.5 rounded-full">☆</button>
                </div>
              </div>

              {/* Chat Body */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                
                <div className="text-center text-xs text-gray-500 mb-2">Nov 6</div>
                
                <div className="flex flex-col gap-1 mb-2">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Worried you'll make the wrong hire?</p>
                  <div>
                    <button className="bg-[#0a66c2] hover:bg-blue-700 text-white text-sm font-semibold px-4 py-1.5 rounded-full mt-2 transition-colors">
                      Post a free job
                    </button>
                  </div>
                </div>

                {/* Message Bubble */}
                <div className="flex gap-2 items-start mt-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">in</div>
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">LinkedIn Talent Solutions</p>
                    <p className="text-xs text-gray-500 mb-1">Hi Ulisses,</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">Hiring is tough when you're already stretched thin.</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed mt-2">That's where <a href="#" className="text-blue-600 font-semibold hover:underline">LinkedIn Hiring Pro</a> helps. It's AI that works like the recruiter you wish you had — screening applicants, shortlisting the best fits, and surfacing candidates you may not have found on job boards.</p>
                  </div>
                </div>

              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50">
                <textarea className="w-full bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none h-20" placeholder="Write a message..."></textarea>
                <div className="flex justify-between items-center mt-2">
                   <div className="flex gap-2 text-gray-500 text-lg">
                      <button>📷</button>
                      <button>🖼️</button>
                      <button>📎</button>
                   </div>
                   <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-1.5 rounded-full transition-colors">Send</button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT COLUMN: Empty for layout balance */}
        <aside className="col-span-12 lg:col-span-4 hidden lg:block">
          {/* Empty space to match the LinkedIn layout which leaves the right side blank on this page */}
        </aside>

      </div>
    </div>
  );
}