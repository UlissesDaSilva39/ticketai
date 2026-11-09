"use client";
import { useState } from "react";
import Link from "next/link";
import { MicIcon, SlidersIcon, MatchIcon, NoteIcon } from "@/components/MusicIcons";

export default function Page() {
  const [isPlaying, setIsPlaying] = useState(false);

  const [gigs, setGigs] = useState([
    { id:1, type:"COLLAB", title:"Session Vocalist needed — House track (royalty split)", poster:"Sarah J.", role:"Vocalist · House", loc:"London · Remote", pay:"Royalty split 50/50", match:"Strong match — 3 mutual collaborators", posted:"2h ago", icon:<MicIcon className="w-4 h-4"/>, saved:false },
    { id:2, type:"BOOKING", title:"Mixing & Mastering Engineer for EP", poster:"Studio X", role:"Engineer · Pop/R&B", loc:"London · On-site", pay:"Paid · £400/track", match:"Strong match — 2 mutual collaborators", posted:"5h ago", icon:<SlidersIcon className="w-4 h-4"/>, saved:false },
    { id:3, type:"COLLAB", title:"Drummer needed for Indie Band", poster:"The Midnight Collective", role:"Drummer · Indie", loc:"Manchester · On-site", pay:"Revenue share", match:"Strong match — 1 mutual collaborator", posted:"1d ago", icon:<MicIcon className="w-4 h-4"/>, saved:false },
  ]);

  const [showPostModal, setShowPostModal] = useState(false);
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [selectedGig, setSelectedGig] = useState<any>(null);
  const [filters, setFilters] = useState<string[]>([]);
  const [postSuccess, setPostSuccess] = useState(false);
  const [pitchSuccess, setPitchSuccess] = useState(false);

  const handleSave = (id: number) => {
    setGigs(gigs.map(g => g.id === id ? { ...g, saved: !g.saved } : g));
  };

  const handleQuickPitch = (gig: any) => {
    setSelectedGig(gig);
    setShowPitchModal(true);
  };

  const handlePitchSubmit = () => {
    setPitchSuccess(true);
    setTimeout(() => {
      setPitchSuccess(false);
      setShowPitchModal(false);
    }, 2000);
  };

  const handlePostSubmit = () => {
    setPostSuccess(true);
    setTimeout(() => {
      setPostSuccess(false);
      setShowPostModal(false);
    }, 2000);
  };

  const toggleFilter = (role: string) => {
    setFilters(prev => prev.includes(role) ? prev.filter(f => f !== role) : [...prev, role]);
  };

  // Filter logic
  const filteredGigs = gigs.filter(g => {
    if (filters.length === 0) return true;
    return filters.some(f => g.role.toLowerCase().includes(f.toLowerCase()));
  });

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen">
      <div className="mx-auto max-w-[1128px] px-4 py-6 grid grid-cols-12 gap-6">

        {/* LEFT SIDEBAR */}
        <aside className="col-span-12 lg:col-span-3 space-y-3">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-emerald-600 to-emerald-500" />
            <div className="p-5 -mt-10 text-center relative">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-800 text-white grid place-items-center font-bold text-2xl ring-4 ring-white dark:ring-zinc-900 mb-3">U</div>
              <p className="font-bold text-gray-900 dark:text-white text-lg">Ulisses Silva</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Music Producer &amp; DJ</p>
              <p className="text-xs text-gray-500 mt-1">London, UK</p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <button onClick={() => setShowPostModal(true)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 rounded-full transition-colors mb-2">Post a Gig</button>
            <button onClick={() => setShowPostModal(true)} className="w-full border border-emerald-600 text-emerald-700 dark:text-emerald-500 text-sm font-semibold py-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">Post a Collab Call</button>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <p className="text-xs font-bold text-gray-500 uppercase mb-3">Filter by role</p>
            <div className="space-y-1">
              {["Vocalist","Producer","Engineer","Songwriter","DJ","A&R","Label"].map(r => (
                <label key={r} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 py-1 cursor-pointer hover:text-emerald-600 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={filters.includes(r)} 
                    onChange={() => toggleFilter(r)}
                    className="accent-emerald-600 rounded" 
                  /> {r}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* CENTER: Gigs Feed */}
        <main className="col-span-12 lg:col-span-9 space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
            <h1 className="font-bold text-gray-900 dark:text-white text-2xl">Gigs &amp; opportunities</h1>
            <p className="text-sm text-gray-500 mt-1">Based on your role, genre, and mutual collaborators.</p>
          </div>

          {filteredGigs.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-12 text-center shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No gigs match your filter</h3>
              <p className="text-gray-500">Try removing some filters to see more results.</p>
            </div>
          ) : (
            filteredGigs.map(g => (
              <div key={g.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm hover:border-emerald-400 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <span className={`inline-block text-[10px] font-bold tracking-wide px-2 py-0.5 rounded mb-2 ${g.type === "COLLAB" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>
                      {g.type}
                    </span>
                    <h2 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                      <span className="text-emerald-600">{g.icon}</span> {g.title}
                    </h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{g.poster} · {g.role}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{g.loc} · {g.pay}</p>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 mt-3 font-medium bg-emerald-50 dark:bg-emerald-900/20 w-fit px-2 py-1 rounded-md">
                      <MatchIcon className="w-4 h-4" /> {g.match}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{g.posted}</span>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                  <button onClick={() => handleQuickPitch(g)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-1.5 rounded-full inline-flex items-center gap-1.5 transition-colors">
                    <NoteIcon className="w-4 h-4" /> Quick Pitch
                  </button>
                  <button onClick={() => handleSave(g.id)} className={`border text-sm font-semibold px-5 py-1.5 rounded-full transition-colors ${g.saved ? "border-emerald-600 text-emerald-600 bg-emerald-50" : "border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"}`}>
                    {g.saved ? "✓ Saved" : "Save"}
                  </button>
                </div>
              </div>
            ))
          )}
        </main>
      </div>

      {/* POST GIG MODAL */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md p-6">
            {postSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Gig Posted!</h2>
                <p className="text-sm text-gray-500">Your gig is now live in the Jobs feed.</p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Post a New Gig</h2>
                <div className="space-y-3 mb-6">
                  <input type="text" placeholder="Gig Title (e.g., Session Vocalist for House track)" className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                  <select className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500">
                    <option>Type: Collab</option>
                    <option>Type: Booking</option>
                  </select>
                  <input type="text" placeholder="Location (e.g., London · Remote)" className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                  <input type="text" placeholder="Payment (e.g., Royalty split 50/50)" className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowPostModal(false)} className="flex-1 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                  <button onClick={handlePostSubmit} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-colors">Post Gig</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* QUICK PITCH MODAL */}
      {showPitchModal && selectedGig && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md p-6">
            {pitchSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Pitch Sent!</h2>
                <p className="text-sm text-gray-500">Your pitch has been delivered to {selectedGig.poster}.</p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Quick Pitch</h2>
                <p className="text-sm text-gray-500 mb-4">Applying to: <strong>{selectedGig.title}</strong></p>
                <div className="space-y-3 mb-6">
                  <select className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500">
                    <option>Select your track</option>
                    <option>Midnight City (Original Mix)</option>
                    <option>Neon Lights (Demo)</option>
                  </select>
                  <textarea rows={3} placeholder="Why are you a good fit?" className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 text-sm resize-none focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowPitchModal(false)} className="flex-1 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                  <button onClick={handlePitchSubmit} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-colors">Send Pitch</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}