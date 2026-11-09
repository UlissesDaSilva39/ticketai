"use client";
import { PlayIcon, MarketIcon, BookmarkIcon, UsersIcon, CalendarSVG, MicIcon } from "@/components/MusicIcons";

const ShieldIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const PenIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

export default function SplitsPage() {
  const splits = [
    {
      id: 1,
      title: "Midnight City (Demo)",
      status: "Draft",
      date: "Nov 2, 2026",
      total: "100%",
      collaborators: [
        { name: "Ulisses Silva", role: "Producer", split: "50%", color: "bg-emerald-500" },
        { name: "Sarah J.", role: "Vocalist / Writer", split: "50%", color: "bg-blue-500" }
      ]
    },
    {
      id: 2,
      title: "Neon Lights",
      status: "Signed",
      date: "Oct 15, 2026",
      total: "100%",
      collaborators: [
        { name: "Ulisses Silva", role: "Producer", split: "40%", color: "bg-emerald-500" },
        { name: "David Chen", role: "Co-Producer", split: "40%", color: "bg-indigo-500" },
        { name: "Sarah J.", role: "Topline Writer", split: "20%", color: "bg-blue-500" }
      ]
    }
  ];

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen">
      <div className="mx-auto max-w-[1280px] px-4 py-6 grid grid-cols-12 gap-6">

        {/* LEFT COLUMN: Profile & Stats */}
        <aside className="col-span-12 lg:col-span-3 space-y-3 hidden lg:block">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-emerald-600 to-emerald-500" />
            <div className="p-5 -mt-10 text-center relative">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-800 text-white grid place-items-center font-bold text-2xl ring-4 ring-white dark:ring-zinc-900 mb-3">U</div>
              <p className="font-bold text-gray-900 dark:text-white text-lg">Ulisses Silva</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Music Producer &amp; DJ</p>
              <p className="text-xs text-gray-500 mt-1">London, UK</p>
              
              <div className="mt-5 space-y-2">
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 rounded-full transition-colors flex items-center justify-center gap-2">
                  <PlayIcon className="w-3.5 h-3.5" /> Play Latest Track
                </button>
                <button className="w-full border-2 border-emerald-600 text-emerald-700 dark:text-emerald-400 text-sm font-bold py-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                  View EPK
                </button>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-zinc-800 p-4">
              <ul className="space-y-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors group">
                  <MarketIcon className="w-5 h-5 text-emerald-600" /> 
                  <span className="group-hover:text-emerald-700">Marketplace</span>
                </li>
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors group">
                  <BookmarkIcon className="w-5 h-5 text-emerald-600" /> 
                  <span className="group-hover:text-emerald-700">Saved Items</span>
                </li>
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors group">
                  <UsersIcon className="w-5 h-5 text-emerald-600" /> 
                  <span className="group-hover:text-emerald-700">Groups</span>
                </li>
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors group">
                  <CalendarSVG className="w-5 h-5 text-emerald-600" /> 
                  <span className="group-hover:text-emerald-700">Events</span>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* MAIN COLUMN: Split Sheets */}
        <main className="col-span-12 lg:col-span-9 space-y-4">
          
          {/* Header */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white text-2xl flex items-center gap-2">
                <ShieldIcon className="w-6 h-6 text-emerald-600" /> Split Sheets
              </h1>
              <p className="text-sm text-gray-500 mt-1">Legally protect your collaborations and agree on ownership before you release.</p>
            </div>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-sm">
              <PenIcon /> Create New Split
            </button>
          </div>

          {/* Split Sheets List */}
          <div className="space-y-4">
            {splits.map((s) => (
              <div key={s.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                
                {/* Header */}
                <div className="p-5 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-800/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                      <MicIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900 dark:text-white text-lg">{s.title}</h2>
                      <p className="text-xs text-gray-500">Created: {s.date}</p>
                    </div>
                  </div>
                  
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    s.status === 'Signed' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {s.status}
                  </span>
                </div>

                {/* Collaborators & Percentages */}
                <div className="p-5">
                  
                  {/* Visual Bar */}
                  <div className="flex h-3 w-full rounded-full overflow-hidden mb-5">
                    {s.collaborators.map((c, i) => (
                      <div key={i} className={`${c.color} h-full`} style={{ width: c.split }} title={`${c.name}: ${c.split}`}></div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {s.collaborators.map((c, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${c.color}`}></div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{c.name}</p>
                          <p className="text-xs text-gray-500">({c.role})</p>
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{c.split}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/20 flex justify-end gap-3">
                  <button className="text-gray-600 dark:text-gray-400 text-sm font-semibold hover:text-gray-900 dark:hover:text-white transition-colors">
                    Edit Splits
                  </button>
                  {s.status === 'Draft' && (
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                      Sign Contract
                    </button>
                  )}
                  {s.status === 'Signed' && (
                    <button className="border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-white dark:hover:bg-zinc-800 transition-colors">
                      Download PDF
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}