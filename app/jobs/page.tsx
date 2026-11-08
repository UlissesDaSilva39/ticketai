"use client";
import { MicIcon, SlidersIcon, MatchIcon, NoteIcon } from "@/components/MusicIcons";

export default function JobsPage() {
  const gigs = [
    { 
      id:1, 
      type:"COLLAB", 
      title:"Session Vocalist needed — House track (royalty split)", 
      poster:"Sarah J.", 
      role:"Vocalist · House", 
      loc:"London · Remote", 
      pay:"Royalty split 50/50", 
      match:"Strong match — 3 mutual collaborators", 
      posted:"2h ago", 
      icon:<MicIcon className="w-4 h-4"/> 
    },
    { 
      id:2, 
      type:"BOOKING", 
      title:"Mixing & Mastering Engineer for EP", 
      poster:"Studio X", 
      role:"Engineer · Pop/R&B", 
      loc:"London · On-site", 
      pay:"Paid · £400/track", 
      match:"Strong match — 2 mutual collaborators", 
      posted:"5h ago", 
      icon:<SlidersIcon className="w-4 h-4"/> 
    },
  ];

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen">
      <div className="mx-auto max-w-[1128px] px-4 py-6 grid grid-cols-12 gap-6">

        {/* LEFT COLUMN: Profile & Filters */}
        <aside className="col-span-12 lg:col-span-3 space-y-3">
          {/* Profile Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="h-16 bg-gradient-to-r from-emerald-600 to-emerald-500" />
            <div className="p-4 -mt-8">
              <div className="w-16 h-16 rounded-full bg-emerald-600 text-white grid place-items-center font-bold text-xl ring-4 ring-white dark:ring-zinc-900">
                U
              </div>
              <p className="font-semibold text-gray-900 dark:text-white mt-2">Ulisses Bezerra Da Silva</p>
              <p className="text-xs text-gray-500 mt-0.5">Music Producer &amp; DJ · London, UK</p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 rounded-full transition-colors mb-2">
              Post a Gig
            </button>
            <button className="w-full border border-emerald-600 text-emerald-700 dark:text-emerald-500 text-sm font-semibold py-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
              Post a Collab Call
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Filter by role</p>
            <div className="space-y-1">
              {["Vocalist","Producer","Engineer","Songwriter","DJ","A&R","Label"].map(r => (
                <label key={r} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 py-1 cursor-pointer hover:text-emerald-600 transition-colors">
                  <input type="checkbox" className="accent-emerald-600 rounded" /> {r}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* CENTER COLUMN: Gigs Feed */}
        <main className="col-span-12 lg:col-span-6 space-y-3">
          {/* Header */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
            <h1 className="font-semibold text-gray-900 dark:text-white text-lg">Gigs &amp; opportunities matched to you</h1>
            <p className="text-xs text-gray-500 mt-1">Based on your role, genre, and mutual collaborators.</p>
          </div>

          {/* Gig Cards */}
          {gigs.map(g => (
            <div key={g.id} className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-5 shadow-sm hover:border-emerald-400 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  {/* Badge */}
                  <span className={`inline-block text-[10px] font-bold tracking-wide px-2 py-0.5 rounded mb-2 ${
                    g.type === "COLLAB" 
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  }`}>
                    {g.type}
                  </span>
                  
                  {/* Title & Icon */}
                  <h2 className="font-semibold text-gray-900 dark:text-white text-base flex items-center gap-2">
                    <span className="text-emerald-600">{g.icon}</span>
                    {g.title}
                  </h2>
                  
                  {/* Meta */}
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{g.poster} · {g.role}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{g.loc} · {g.pay}</p>
                  
                  {/* Match Indicator */}
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 mt-3 font-medium bg-emerald-50 dark:bg-emerald-900/20 w-fit px-2 py-1 rounded-md">
                    <MatchIcon className="w-4 h-4" /> 
                    {g.match}
                  </div>
                </div>

                {/* Time */}
                <span className="text-xs text-gray-400 whitespace-nowrap">{g.posted}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-1.5 rounded-full inline-flex items-center gap-1.5 transition-colors">
                  <NoteIcon className="w-4 h-4" /> Quick Pitch
                </button>
                <button className="border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 text-sm font-semibold px-5 py-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  Save
                </button>
              </div>
            </div>
          ))}
        </main>

        {/* RIGHT COLUMN: GRID Pro Upsell */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm sticky top-20">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
              <span className="text-emerald-600">★</span> GRID Pro
            </h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Priority in collab feeds, EPK analytics, and royalty split templates.
            </p>
            <button className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 rounded-full transition-colors">
              Start free trial
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
}