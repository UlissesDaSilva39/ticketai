"use client";
import { useState } from "react";
import Link from "next/link";
import { PlayIcon, MarketIcon, BookmarkIcon, UsersIcon, CalendarSVG, NoteIcon } from "@/components/MusicIcons";

const StarIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
);
const CheckIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
);

export default function PromotePage() {
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [pitchSuccess, setPitchSuccess] = useState(false);

  const curators = [
    { id: 1, name: "Indie Nation", type: "Playlist Curator", genre: "Indie / Alt", followers: "45.2K", color: "bg-blue-600" },
    { id: 2, name: "House Heads", type: "Playlist Curator", genre: "Tech House", followers: "120K", color: "bg-purple-600" },
    { id: 3, name: "Pitchfork Rising", type: "Music Blogger", genre: "All Genres", followers: "250K", color: "bg-pink-600" },
    { id: 4, name: "BBC Radio 1", type: "Radio Producer", genre: "Pop / Dance", followers: "1.2M", color: "bg-red-600" },
  ];

  const handlePitch = () => {
    setPitchSuccess(true);
    setTimeout(() => {
      setPitchSuccess(false);
      setShowPitchModal(false);
    }, 2500);
  };

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen relative">
      <div className="mx-auto max-w-[1280px] px-4 py-6 grid grid-cols-12 gap-6">

        <aside className="col-span-12 lg:col-span-3 space-y-3 hidden lg:block">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-emerald-600 to-emerald-500" />
            <div className="p-5 -mt-10 text-center relative">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-800 text-white grid place-items-center font-bold text-2xl ring-4 ring-white dark:ring-zinc-900 mb-3">U</div>
              <p className="font-bold text-gray-900 dark:text-white text-lg">Ulisses Silva</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Music Producer &amp; DJ</p>
              <p className="text-xs text-gray-500 mt-1">London, UK</p>
              
              <div className="mt-5 space-y-2">
                <Link href="/premium" className="w-full bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold py-2 rounded-full transition-colors flex items-center justify-center gap-2">
                  <StarIcon className="w-4 h-4" /> Buy Credits
                </Link>
              </div>
            </div>
            <div className="border-t border-gray-100 dark:border-zinc-800 p-4">
              <ul className="space-y-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <li><Link href="/marketplace" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><MarketIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Marketplace</span></Link></li>
                <li><Link href="/saved" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><BookmarkIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Saved Items</span></Link></li>
                <li><Link href="/groups" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><UsersIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Groups</span></Link></li>
                <li><Link href="/events" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><CalendarSVG className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Events</span></Link></li>
              </ul>
            </div>
          </div>
        </aside>

        <main className="col-span-12 lg:col-span-9 space-y-4">
          
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white text-2xl flex items-center gap-2">
                <NoteIcon className="w-6 h-6 text-emerald-600" /> Promote Your Music
              </h1>
              <p className="text-sm text-gray-500 mt-1">Pitch your tracks directly to verified Playlist Curators, Bloggers, and Radio Producers.</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white"><StarIcon /></div>
              <div>
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider">Pitch Credits</p>
                <p className="font-bold text-gray-900 dark:text-white text-xl">12 Remaining</p>
              </div>
              <Link href="/premium" className="ml-4 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">Buy More</Link>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">Verified Curators</h2>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">4 accepting pitches</span>
            </div>
            
            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
              {curators.map((c) => (
                <div key={c.id} className="p-5 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full ${c.color} text-white grid place-items-center font-bold text-xl flex-shrink-0`}>
                      {c.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-1.5">
                        {c.name}
                        <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{c.type} · {c.genre}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{c.followers}</p>
                      <p className="text-xs text-gray-500">Followers</p>
                    </div>
                    <button onClick={() => setShowPitchModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors shadow-sm">
                      Pitch (1 Credit)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {showPitchModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-800 w-full max-w-md p-6">
            {pitchSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckIcon className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Pitch Sent!</h2>
                <p className="text-sm text-gray-500">Your track has been delivered to the curator. You will be notified if they add it to a playlist.</p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Submit Your Track</h2>
                <p className="text-sm text-gray-500 mb-6">Select a track from your library to pitch to this curator.</p>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Select Track</label>
                <select className="w-full bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 mb-4 focus:outline-none focus:border-emerald-500 text-sm">
                  <option>Midnight City (Original Mix)</option>
                  <option>Neon Lights (Demo)</option>
                  <option>Untitled Beat #4</option>
                </select>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Personal Message to Curator</label>
                <textarea rows={4} placeholder="Hi, I think this track would fit perfectly on your playlist..." className="w-full bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:border-emerald-500 text-sm resize-none" />
                <div className="flex gap-3">
                  <button onClick={() => setShowPitchModal(false)} className="flex-1 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-semibold py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">Cancel</button>
                  <button onClick={handlePitch} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-colors">Send Pitch</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}