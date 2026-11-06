import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen">
      <div className="mx-auto max-w-[1128px] px-4 py-6 grid grid-cols-12 gap-6">
        
        {/* CENTER COLUMN: Main Profile Card */}
        <main className="col-span-12 lg:col-span-8 space-y-4">
          
          {/* Main Profile Container */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm relative">
            
            {/* Cover Photo */}
            <div className="h-[200px] bg-[#8da3a6] dark:bg-zinc-800 relative">
              <button className="absolute top-4 right-4 bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </button>
            </div>

            {/* Profile Info */}
            <div className="px-6 pb-6 relative">
              
              {/* Avatar */}
              <div className="w-[152px] h-[152px] bg-gray-400 rounded-full border-4 border-white dark:border-zinc-900 flex items-center justify-center text-5xl font-bold text-white shadow-sm -mt-[76px] mb-4 relative z-10 overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Ulisses+Silva&background=random&size=152" className="w-full h-full object-cover" />
              </div>

              {/* Edit Icon */}
              <button className="absolute top-4 right-6 text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
              </button>

              {/* Name & Headline */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Ulisses Bezerra Da Silva <span className="text-base font-normal text-gray-500 ml-1">He/Him</span>
                  </h1>
                  <p className="text-base text-gray-800 dark:text-gray-200 mt-1">Founder - CEO @ TicketAI</p>
                  
                  {/* Location & Contact */}
                  <p className="text-sm text-gray-500 mt-1">
                    London, England, United Kingdom · <a href="#" className="text-emerald-700 font-semibold hover:underline">Contact info</a>
                  </p>
                  <p className="text-sm font-semibold text-emerald-700 hover:underline cursor-pointer mt-1">500+ connections</p>
                </div>
                
                {/* Company Logo Top Right */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-sm"></div>
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">TicketAI</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <button className="bg-[#0a66c2] hover:bg-blue-700 text-white font-semibold text-sm px-4 py-1.5 rounded-full transition-colors">Open to</button>
                <button className="border border-gray-500 text-gray-700 dark:text-gray-300 font-semibold text-sm px-4 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">Add section</button>
                <button className="border border-gray-500 text-gray-700 dark:text-gray-300 font-semibold text-sm px-4 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">Enhance profile</button>
                <button className="border border-gray-500 text-gray-700 dark:text-gray-300 font-semibold text-sm px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">···</button>
              </div>

              {/* Unverified Banner */}
              <div className="bg-[#f3f6f8] dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg p-4 mt-4 flex justify-between items-start relative">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Ulisses, you aren’t verified yet</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 mb-3">Verified members get 60% more profile views on average.</p>
                  <button className="flex items-center gap-1 border border-gray-500 text-gray-800 dark:text-gray-200 font-semibold text-sm px-3 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                    Verify now
                  </button>
                </div>
                <button className="text-gray-500 hover:bg-gray-200 p-1 rounded-full"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
              </div>

              {/* Open To Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                <div className="border border-gray-200 dark:border-zinc-700 rounded-lg p-4 relative bg-white dark:bg-zinc-900">
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white mb-1">Show recruiters you're Open to Work — start by adding job preferences.</p>
                  <button className="mt-2 border border-gray-500 text-gray-700 dark:text-gray-300 font-semibold text-xs px-3 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">Get started</button>
                </div>
                <div className="border border-gray-200 dark:border-zinc-700 rounded-lg p-4 relative bg-white dark:bg-zinc-900">
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white mb-1">Share that you're hiring and attract qualified candidates.</p>
                  <button className="mt-2 border border-gray-500 text-gray-700 dark:text-gray-300 font-semibold text-xs px-3 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">Get started</button>
                </div>
                <div className="border border-gray-200 dark:border-zinc-700 rounded-lg p-4 relative bg-white dark:bg-zinc-900">
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white mb-1">Tell non-profits you are interested in getting involved with your time and skills.</p>
                  <button className="mt-2 border border-gray-500 text-gray-700 dark:text-gray-300 font-semibold text-xs px-3 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">Get started</button>
                </div>
              </div>

            </div>
          </div>

          {/* Analytics Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Analytics <span className="text-xs font-normal text-gray-500 ml-2">Private to you</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div>
                 <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2"><svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg> 47 profile views</p>
                 <p className="text-xs text-gray-500 mt-1">Discover who's viewed your profile.</p>
               </div>
               <div>
                 <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2"><svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg> 57 post impressions</p>
                 <p className="text-xs text-gray-500 mt-1">Check out who's engaging with your posts.</p>
               </div>
               <div>
                 <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2"><svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg> 63 search appearances</p>
                 <p className="text-xs text-gray-500 mt-1">See how often you appear in search results.</p>
               </div>
            </div>
          </div>

        </main>

        {/* RIGHT COLUMN: Sidebar Widgets */}
        <aside className="col-span-12 lg:col-span-4 space-y-4 hidden lg:block">
          
          {/* Language Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm flex justify-between items-start">
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Profile language</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">English</p>
            </div>
            <button className="text-gray-500 hover:text-gray-800"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg></button>
          </div>

          {/* Public Profile URL Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm flex justify-between items-start">
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Public profile & URL</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 break-all">www.linkedin.com/in/ulisses-bezerra-da-silva-43094927</p>
            </div>
            <button className="text-gray-500 hover:text-gray-800 flex-shrink-0"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg></button>
          </div>

          {/* Who viewed this profile */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Who your viewers also viewed <span className="block text-xs font-normal text-gray-500">Private to you</span></h2>
            <div className="space-y-4 mt-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">Someone in the IT Services and IT Consulting industry...</p>
                  <button className="text-xs font-semibold text-gray-600 border border-gray-500 px-3 py-1 rounded-full mt-1 hover:bg-gray-100 transition-colors">View</button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">Information Technology Consultant at AmTrust ...</p>
                  <button className="text-xs font-semibold text-gray-600 border border-gray-500 px-3 py-1 rounded-full mt-1 hover:bg-gray-100 transition-colors">View</button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">Someone in the Maritime Transportation industry</p>
                  <button className="text-xs font-semibold text-gray-600 border border-gray-500 px-3 py-1 rounded-full mt-1 hover:bg-gray-100 transition-colors">View</button>
                </div>
              </div>
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
}