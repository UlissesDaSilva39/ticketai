"use client";
import { useState } from "react";
import Link from "next/link";
import { PlayIcon, MarketIcon, BookmarkIcon, UsersIcon, CalendarSVG, MicIcon, NoteIcon } from "@/components/MusicIcons";

const ShieldIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
);
const PenIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
);

export default function SplitsPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSignModal, setShowSignModal] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState<any>(null);
  const [showDownloadToast, setShowDownloadToast] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  const [splits, setSplits] = useState([
    {
      id: 1,
      title: "Midnight City (Demo)",
      status: "Draft",
      date: "Nov 2, 2026",
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
      collaborators: [
        { name: "Ulisses Silva", role: "Producer", split: "40%", color: "bg-emerald-500" },
        { name: "David Chen", role: "Co-Producer", split: "40%", color: "bg-indigo-500" },
        { name: "Sarah J.", role: "Topline Writer", split: "20%", color: "bg-blue-500" }
      ]
    }
  ]);

  const handleSign = (split: any) => {
    setSplits(splits.map(s => s.id === split.id ? { ...s, status: "Signed" } : s));
    setShowSignModal(null);
  };

  const handleDownload = () => {
    setShowDownloadToast(true);
    setTimeout(() => setShowDownloadToast(false), 3000);
  };

  const handleCreate = () => {
    setCreateSuccess(true);
    setTimeout(() => {
      setCreateSuccess(false);
      setShowCreateModal(false);
    }, 2000);
  };

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen">
      <div className="mx-auto max-w-[1280px] px-4 py-6 grid grid-cols-12 gap-6">

        {/* LEFT SIDEBAR */}
        <aside className="col-span-12 lg:col-span-3 space-y-3">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-emerald-600 to-emerald-500" />
            <div className="p-5 -mt-10 text-center relative">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-800 text-white grid place-items-center font-bold text-2xl ring-4 ring-white dark:ring-zinc-900 mb-3">U</div>
              <p className="font-bold text-gray-900 dark:text-white text-lg">Ulisses Silva</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Music Producer &amp; DJ</p>
              <p className="text-xs text-gray-500 mt-1">London, UK</p>
              
              <div className="mt-5 space-y-2">
                <button onClick={() => setIsPlaying(!isPlaying)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 rounded-full transition-colors flex items-center justify-center gap-2">
                  <PlayIcon className="w-3.5 h-3.5" /> {isPlaying ? "Pause Track" : "Play Latest Track"}
                </button>
                <Link href="/epk" className="w-full border-2 border-emerald-600 text-emerald-700 dark:text-emerald-400 text-sm font-bold py-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors block text-center">
                  View EPK
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-6 pt-5 border-t border-gray-100 dark:border-zinc-800 text-center">
                <div><p className="font-bold text-gray-900 dark:text-white text-base">124</p><p className="text-[11px] text-gray-500 uppercase tracking-wide">Connections</p></div>
                <div><p className="font-bold text-gray-900 dark:text-white text-base">2.4K</p><p className="text-[11px] text-gray-500 uppercase tracking-wide">Followers</p></div>
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

        {/* MAIN COLUMN */}
        <main className="col-span-12 lg:col-span-9 space-y-4">
          
          {/* HEADER */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white text-2xl flex items-center gap-2">
                <ShieldIcon className="w-6 h-6 text-emerald-600" /> Split Sheets
              </h1>
              <p className="text-sm text-gray-500 mt-1">Legally protect your collaborations and agree on ownership before you release.</p>
            </div>
            <button onClick={() => setShowCreateModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-sm">
              <PenIcon /> Create New Split
            </button>
          </div>

          {/* SPLITS LIST */}
          <div className="space-y-4">
            {splits.map((s) => (
              <div key={s.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                
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

                <div className="p-5">
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

                <div className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/20 flex justify-end gap-3">
                  <button onClick={() => setShowEditModal(s)} className="text-gray-600 dark:text-gray-400 text-sm font-semibold hover:text-gray-900 dark:hover:text-white transition-colors">
                    Edit Splits
                  </button>
                  {s.status === 'Draft' && (
                    <button onClick={() => setShowSignModal(s)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                      Sign Contract
                    </button>
                  )}
                  {s.status === 'Signed' && (
                    <button onClick={handleDownload} className="border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-white dark:hover:bg-zinc-800 transition-colors">
                      Download PDF
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>

        </main>
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md p-6">
            {createSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Split Created!</h2>
                <p className="text-sm text-gray-500">Share it with your collaborators to sign.</p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Create New Split</h2>
                <div className="space-y-3 mb-6">
                  <input type="text" placeholder="Track Title" className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                  <input type="email" placeholder="Collaborator Email" className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                  <div className="flex gap-2">
                    <input type="text" placeholder="Your Split %" className="w-1/2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                    <input type="text" placeholder="Their Split %" className="w-1/2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowCreateModal(false)} className="flex-1 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                  <button onClick={handleCreate} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-colors">Create</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* SIGN MODAL */}
      {showSignModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sign Contract</h2>
            <p className="text-sm text-gray-500 mb-4">By signing, you agree to the ownership splits for <strong>{showSignModal.title}</strong>.</p>
            <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3 mb-6 text-sm text-gray-600 dark:text-gray-400">
              You are signing as Ulisses Silva (Producer - 50%).
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowSignModal(null)} className="flex-1 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-semibold py-2 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleSign(showSignModal)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg">Sign</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Splits</h2>
            <div className="space-y-3 mb-6">
              {showEditModal.collaborators.map((c: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{c.name}</span>
                  <input type="text" defaultValue={c.split} className="w-20 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-2 py-1 text-sm text-right" />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowEditModal(null)} className="flex-1 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-semibold py-2 rounded-lg">Cancel</button>
              <button onClick={() => setShowEditModal(null)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* DOWNLOAD TOAST */}
      {showDownloadToast && (
        <div className="fixed bottom-8 right-8 z-50 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl animate-fade-in-up">
          <p className="font-bold">✓ PDF Downloading...</p>
          <p className="text-xs text-gray-400">Neon Lights - Split Sheet</p>
        </div>
      )}

    </div>
  );
}