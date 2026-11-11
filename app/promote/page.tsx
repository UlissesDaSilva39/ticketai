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
const ClockIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const BuildingIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
);

export default function PromotePage() {
  const [activeTab, setActiveTab] = useState("Curators");
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<any>(null);
  const [pitchSuccess, setPitchSuccess] = useState(false);
  const [pitchMessage, setPitchMessage] = useState("");
  const [credits, setCredits] = useState(12);

  const curators = [
    { id: 1, name: "Indie Nation", type: "Playlist Curator", genre: "Indie / Alt", followers: "45.2K", credits: 1, color: "bg-blue-600", verified: true },
    { id: 2, name: "House Heads", type: "Playlist Curator", genre: "Tech House", followers: "120K", credits: 1, color: "bg-purple-600", verified: true },
    { id: 3, name: "Pitchfork Rising", type: "Music Blogger", genre: "All Genres", followers: "250K", credits: 1, color: "bg-pink-600", verified: true },
    { id: 4, name: "BBC Radio 1", type: "Radio Producer", genre: "Pop / Dance", followers: "1.2M", credits: 1, color: "bg-red-600", verified: true },
  ];

  const arReps = [
    { id: 1, name: "Sellick Records", type: "A&R · Pop & R&B", rep: "Lewis Thompson", credits: 2, color: "bg-emerald-600", verified: true, responseTime: "24h" },
    { id: 2, name: "Toolroom Records", type: "A&R · Tech House", rep: "James M.", credits: 2, color: "bg-indigo-600", verified: true, responseTime: "48h" },
    { id: 3, name: "Defected Records", type: "A&R · House", rep: "Sarah K.", credits: 2, color: "bg-amber-600", verified: true, responseTime: "24h" },
    { id: 4, name: "Spinnin' Records", type: "A&R · EDM / Pop", rep: "Marco V.", credits: 2, color: "bg-purple-600", verified: true, responseTime: "36h" },
  ];

  const currentList = activeTab === "Curators" ? curators : arReps;

  const handlePitch = (target: any) => {
    setSelectedTarget(target);
    setShowPitchModal(true);
    setPitchMessage("");
    setPitchSuccess(false);
  };

  const handlePitchSubmit = () => {
    if (credits < (selectedTarget?.credits || 1)) {
      alert("Not enough credits. Please buy more.");
      return;
    }
    setCredits(credits - selectedTarget.credits);
    setPitchSuccess(true);
    setTimeout(() => {
      setPitchSuccess(false);
      setShowPitchModal(false);
    }, 2500);
  };

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen relative">
      <div className="mx-auto max-w-[1280px] px-4 py-6 grid grid-cols-12 gap-6">

        {/* LEFT SIDEBAR */}
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

        {/* MAIN COLUMN */}
        <main className="col-span-12 lg:col-span-9 space-y-4">
          
          {/* HEADER */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white text-2xl flex items-center gap-2">
                <NoteIcon className="w-6 h-6 text-emerald-600" /> Promote Your Music
              </h1>
              <p className="text-sm text-gray-500 mt-1">Pitch your tracks directly to verified Playlist Curators, A&Rs, and Radio Producers.</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white"><StarIcon /></div>
              <div>
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider">Pitch Credits</p>
                <p className="font-bold text-gray-900 dark:text-white text-xl">{credits} Remaining</p>
              </div>
              <Link href="/premium" className="ml-4 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">Buy More</Link>
            </div>
          </div>

          {/* TABS */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("Curators")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-colors ${
                activeTab === "Curators" 
                  ? "bg-emerald-600 text-white" 
                  : "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              <NoteIcon className="w-4 h-4" /> Playlist Curators (1 credit)
            </button>
            <button
              onClick={() => setActiveTab("A&R")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-colors ${
                activeTab === "A&R" 
                  ? "bg-emerald-600 text-white" 
                  : "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              <BuildingIcon className="w-4 h-4" /> Labels &amp; A&amp;Rs (2 credits)
            </button>
          </div>

          {/* LIST */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">
                {activeTab === "Curators" ? "Verified Curators" : "Verified Labels & A&Rs"}
              </h2>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">{currentList.length} accepting pitches</span>
            </div>
            
            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
              {currentList.map((c: any) => (
                <div key={c.id} className="p-5 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full ${c.color} text-white grid place-items-center font-bold text-xl flex-shrink-0`}>
                      {c.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-1.5">
                        {c.name}
                        {c.verified && <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{c.type} · {c.genre || c.rep}</p>
                      {c.responseTime && (
                        <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                          <ClockIcon /> Guaranteed review in {c.responseTime}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {c.followers && (
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{c.followers}</p>
                        <p className="text-xs text-gray-500">Followers</p>
                      </div>
                    )}
                    {c.credits === 2 && (
                      <div className="text-right">
                        <span className="inline-block bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-full">PREMIUM PITCH</span>
                      </div>
                    )}
                    <button 
                      onClick={() => handlePitch(c)} 
                      className={`${
                        c.credits === 2 
                          ? "bg-purple-600 hover:bg-purple-700" 
                          : "bg-emerald-600 hover:bg-emerald-700"
                      } text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors shadow-sm`}
                    >
                      Pitch ({c.credits} {c.credits === 1 ? "Credit" : "Credits"})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* INFO BANNER */}
          {activeTab === "A&R" && (
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-5">
              <p className="text-sm font-bold text-purple-900 dark:text-purple-400 mb-2 flex items-center gap-2">
                <BuildingIcon className="w-4 h-4" /> Why Labels &amp; A&amp;Rs?
              </p>
              <p className="text-xs text-purple-700 dark:text-purple-500">
                Labels can sign you, fund your next release, and add you to major playlists. A direct pitch to an A&R is worth 10x a playlist pitch. That's why it costs 2 credits.
              </p>
            </div>
          )}

        </main>
      </div>

      {/* PITCH MODAL */}
      {showPitchModal && selectedTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-800 w-full max-w-md p-6">
            {pitchSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckIcon className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Pitch Sent!</h2>
                <p className="text-sm text-gray-500">Your track has been delivered to {selectedTarget.name}. You'll hear back within {selectedTarget.responseTime || "24-48h"}.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-zinc-800">
                  <div className={`w-12 h-12 rounded-full ${selectedTarget.color} text-white grid place-items-center font-bold text-lg flex-shrink-0`}>
                    {selectedTarget.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-base">{selectedTarget.name}</p>
                    <p className="text-xs text-gray-500">{selectedTarget.type}</p>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Submit Your Track</h2>
                <p className="text-sm text-gray-500 mb-6">Select a track from your library to pitch.</p>
                
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Select Track</label>
                <select className="w-full bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 mb-4 focus:outline-none focus:border-emerald-500 text-sm">
                  <option>Midnight City (Original Mix)</option>
                  <option>Neon Lights (Demo)</option>
                  <option>Untitled Beat #4</option>
                </select>

                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Personal Message</label>
                <textarea
                  rows={3}
                  value={pitchMessage}
                  onChange={(e) => setPitchMessage(e.target.value)}
                  placeholder="Why does this track fit their sound?"
                  className="w-full bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:border-emerald-500 text-sm resize-none"
                />
                
                <div className={`p-3 rounded-lg mb-4 flex items-center gap-2 text-xs font-semibold ${
                  selectedTarget.credits === 2 
                    ? "bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400" 
                    : "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400"
                }`}>
                  <StarIcon className="w-4 h-4" /> This pitch costs {selectedTarget.credits} credits. You have {credits}.
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setShowPitchModal(false)} className="flex-1 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                  <button onClick={handlePitchSubmit} className={`${
                    selectedTarget.credits === 2 
                      ? "bg-purple-600 hover:bg-purple-700" 
                      : "bg-emerald-600 hover:bg-emerald-700"
                  } text-white font-semibold py-2 rounded-lg transition-colors flex-1`}>
                    Send Pitch
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}