"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlayIcon, MicIcon, SlidersIcon, NoteIcon, CalendarSVG, MarketIcon, BookmarkIcon, UsersIcon, HypeIcon, ReplyIcon } from "@/components/MusicIcons";

const VerifiedIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
  </svg>
);
const SparkleIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"/></svg>
);
const RocketIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

export default function HomePage() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [hypeCount, setHypeCount] = useState(0);
  const [hasHyped, setHasHyped] = useState(false);
  const [followed, setFollowed] = useState<{[key: string]: boolean}>({});
  const [postText, setPostText] = useState("");
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [postToast, setPostToast] = useState(false);
  
  // Boost state
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [boostSuccess, setBoostSuccess] = useState(false);
  const [selectedTier, setSelectedTier] = useState(0);

  const handlePublish = () => {
    if (!postText.trim()) return;
    setPostToast(true);
    setPostText("");
    setTimeout(() => setPostToast(false), 3000);
  };

  const handleHype = () => {
    if (!hasHyped) {
      setHypeCount(hypeCount + 1);
      setHasHyped(true);
    } else {
      setHypeCount(hypeCount - 1);
      setHasHyped(false);
    }
  };

  const handleReply = () => {
    setShowReplyModal(false);
    setReplyText("");
    setPostToast(true);
    setTimeout(() => setPostToast(false), 2000);
  };

  const handleFollow = (name: string) => {
    setFollowed(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleBoostSubmit = () => {
    setBoostSuccess(true);
    setTimeout(() => {
      setBoostSuccess(false);
      setShowBoostModal(false);
    }, 2500);
  };

  const boostTiers = [
    { id: 0, price: 5, duration: "24 hours", reach: "10,000+ artists", badge: "" },
    { id: 1, price: 15, duration: "3 days", reach: "30,000+ artists", badge: "Popular" },
    { id: 2, price: 30, duration: "7 days", reach: "70,000+ artists", badge: "Best Value" },
  ];

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen relative">
      <div className="mx-auto max-w-[1280px] px-4 py-6 grid grid-cols-12 gap-6">

        {/* LEFT COLUMN */}
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
                <Link href="/epk" className="w-full border-2 border-emerald-600 text-emerald-700 dark:text-emerald-400 text-sm font-bold py-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors block text-center">View EPK</Link>
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

        {/* CENTER COLUMN */}
        <main className="col-span-12 lg:col-span-6 space-y-4">
          
          {/* Algorithmic Matches */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 rounded-xl border border-emerald-200 dark:border-emerald-800/50 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
                <SparkleIcon className="w-5 h-5 text-emerald-600" /> Matched For You
              </h2>
              <Link href="/network" className="text-xs font-bold text-emerald-600 hover:underline">See all →</Link>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">Based on your genre (Tech House), role (Producer), and mutual collaborators.</p>
            <div className="space-y-3">
              {[
                { title: "House Vocalist needed", poster: "Sarah J.", match: "98%", color: "bg-pink-500", reason: "Same genre (House) + 3 mutual collabs" },
                { title: "Opening slot at Ministry of Sound", poster: "The O2 Academy", match: "95%", color: "bg-emerald-600", reason: "Your genre + London based" },
              ].map((m, i) => (
                <div key={i} className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-3 flex items-start gap-3 group">
                  <div className={`w-10 h-10 rounded-lg ${m.color} text-white grid place-items-center font-bold text-sm flex-shrink-0`}>
                    {m.title[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{m.title}</p>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.5 rounded ml-2 flex-shrink-0">{m.match}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">by {m.poster}</p>
                    <p className="text-[10px] text-emerald-600 mt-1 font-medium">{m.reason}</p>
                  </div>
                  <button onClick={() => router.push('/jobs')} className="text-xs font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-2 py-1 rounded transition-colors">
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Composer */}
          {/* RECENTLY VIEWED RAIL */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Recently Viewed
              </h3>
              <button className="text-xs font-semibold text-gray-500 hover:text-red-500 transition-colors">Clear history</button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {[
                { name: "Sarah Jenkins", role: "Vocalist · London", color: "bg-pink-500", type: "Artist" },
                { name: "Dark Techno Pack", role: "£24.99 · Sample Pack", color: "bg-purple-600", type: "Product" },
                { name: "Vocalist for House", role: "Gig · 2h ago", color: "bg-emerald-600", type: "Gig" },
                { name: "Toolroom Records", role: "Label · Verified", color: "bg-zinc-700", type: "Label" },
                { name: "Mixing engineer", role: "Service · £400", color: "bg-amber-600", type: "Service" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center flex-shrink-0 w-24 group cursor-pointer">
                  <div className={`w-16 h-16 rounded-full ${item.color} text-white flex items-center justify-center font-bold text-xl mb-2 ring-2 ring-transparent group-hover:ring-emerald-500 transition-all`}>
                    {item.name[0]}
                  </div>
                  <p className="text-[11px] font-bold text-gray-900 dark:text-white text-center leading-tight truncate w-full">{item.name}</p>
                  <p className="text-[9px] text-gray-500 text-center truncate w-full">{item.type}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white grid place-items-center font-bold flex-shrink-0">U</div>
              <div className="flex-1">
                <input 
                  type="text" 
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="Share a track, an event, or an update..." 
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
                <div className="flex justify-between items-center mt-3">
                  <div className="flex gap-2">
                    <button onClick={() => alert("Audio upload coming soon!")} className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors">
                      <NoteIcon className="w-4 h-4" /> Audio
                    </button>
                    <button onClick={() => alert("Event creation coming soon!")} className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors">
                      <CalendarSVG className="w-4 h-4" /> Event
                    </button>
                  </div>
                  <button 
                    onClick={handlePublish}
                    disabled={!postText.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-2 rounded-md transition-colors"
                  >
                    Publish
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* REFER & EARN BANNER */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white flex-shrink-0 backdrop-blur-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-white text-base">Refer &amp; Earn</p>
                  <p className="text-sm text-emerald-100">Invite a friend → Get 1 month of GRID Pro free</p>
                </div>
              </div>
              <button 
                onClick={() => alert("Referral link: grid.com/join?ref=ulisses")} 
                className="bg-white text-emerald-700 font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-emerald-50 transition-colors whitespace-nowrap shadow-sm"
              >
                Invite Friends →
              </button>
            </div>
          </div>

          {/* Feed Post */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white grid place-items-center font-bold flex-shrink-0 text-lg">D</div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-1.5">
                      Demo Producer <VerifiedIcon className="text-emerald-500" />
                    </p>
                    <p className="text-xs text-gray-500">Music Producer · 2h</p>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setShowBoostModal(true)}
                      className="text-gray-400 hover:text-gray-600 font-bold tracking-widest px-2"
                    >
                      •••
                    </button>
                  </div>
                </div>
                
                <p className="text-[15px] text-gray-800 dark:text-gray-200 mt-4 mb-4">Just dropped a new beat. Let me know what you think!</p>
                
                <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-3 flex items-center gap-3 border border-gray-100 dark:border-zinc-800">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="w-10 h-10 rounded-full bg-emerald-600 text-white grid place-items-center hover:bg-emerald-700 transition-colors flex-shrink-0 shadow-sm">
                    <PlayIcon className="w-5 h-5 ml-1" />
                  </button>
                  <div className="flex-1 h-8 flex items-center gap-1 opacity-80">
                    {[10, 30, 50, 80, 60, 40, 20, 70, 90, 50, 30, 60, 80, 40, 20, 60, 90, 70, 50, 30, 60, 80, 40, 20, 70, 90, 50, 30, 60, 80, 40, 20, 60, 90, 70, 50, 30, 60, 80, 40].map((h, i) => (
                      <div key={i} className="flex-1 bg-emerald-500 rounded-full" style={{height: `${h}%`}}></div>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-gray-500">3:45</span>
                </div>

                <div className="flex gap-8 mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                  <button 
                    onClick={handleHype} 
                    className={`flex items-center gap-2 text-sm font-semibold transition-colors ${hasHyped ? "text-emerald-600" : "text-gray-600 dark:text-gray-400 hover:text-emerald-600"}`}
                  >
                    <HypeIcon className="w-5 h-5" /> {hypeCount > 0 ? `Hype (${hypeCount})` : "Hype"}
                  </button>
                  <button onClick={() => setShowReplyModal(true)} className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-emerald-600 transition-colors">
                    <ReplyIcon className="w-5 h-5" /> Reply
                  </button>
                  <button onClick={() => setShowBoostModal(true)} className="flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors ml-auto">
                    <RocketIcon className="w-4 h-4" /> Boost
                  </button>
                </div>
              </div>
            </div>
          </div>

        </main>

        {/* RIGHT COLUMN */}
        <aside className="col-span-12 lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white text-base mb-4">Open Collabs</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 group cursor-pointer" onClick={() => router.push('/jobs')}>
                <MicIcon className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">Vocalist needed for House track</p>
                  <p className="text-xs text-gray-500 mt-0.5">Posted by Sarah J. · 2h ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 group cursor-pointer" onClick={() => router.push('/jobs')}>
                <SlidersIcon className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">Mixing &amp; Mastering Engineer</p>
                  <p className="text-xs text-gray-500 mt-0.5">Posted by Studio X · 5h ago</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white text-base mb-4">Artists to Follow</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-500 text-white grid place-items-center font-bold text-sm">SJ</div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">Sarah Jenkins <VerifiedIcon className="text-emerald-500" /></p>
                    <p className="text-xs text-gray-500">Vocalist</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleFollow("sarah")}
                  className={`text-xs font-bold px-4 py-1.5 rounded-full transition-colors ${
                    followed["sarah"] 
                      ? "bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-gray-300" 
                      : "border border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  }`}
                >
                  {followed["sarah"] ? "Following" : "Follow"}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500 text-white grid place-items-center font-bold text-sm">DC</div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">David Chen</p>
                    <p className="text-xs text-gray-500">DJ / Producer</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleFollow("david")}
                  className={`text-xs font-bold px-4 py-1.5 rounded-full transition-colors ${
                    followed["david"] 
                      ? "bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-gray-300" 
                      : "border border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  }`}
                >
                  {followed["david"] ? "Following" : "Follow"}
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* REPLY MODAL */}
      {showReplyModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Reply to Demo Producer</h2>
            <textarea 
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..." 
              className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 resize-none mb-4" 
            />
            <div className="flex gap-3">
              <button onClick={() => setShowReplyModal(false)} className="flex-1 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleReply} disabled={!replyText.trim()} className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-colors">Send Reply</button>
            </div>
          </div>
        </div>
      )}

      {/* BOOST MODAL */}
      {showBoostModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {boostSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RocketIcon className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Post Boosted!</h2>
                <p className="text-sm text-gray-500">Your post is now reaching artists in your genre. Check analytics in 24h.</p>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-6 text-center text-white">
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                    <RocketIcon className="w-7 h-7" />
                  </div>
                  <h2 className="text-xl font-bold mb-1">Boost Your Post</h2>
                  <p className="text-xs text-amber-100">Reach more artists and industry professionals.</p>
                </div>
                <div className="p-6">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Choose your reach</p>
                  <div className="space-y-2 mb-6">
                    {boostTiers.map((tier) => (
                      <button
                        key={tier.id}
                        onClick={() => setSelectedTier(tier.id)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all relative ${
                          selectedTier === tier.id
                            ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                            : "border-gray-200 dark:border-zinc-700 hover:border-amber-300"
                        }`}
                      >
                        {tier.badge && (
                          <span className="absolute -top-2 right-3 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">{tier.badge}</span>
                        )}
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white text-sm">{tier.reach}</p>
                            <p className="text-xs text-gray-500">{tier.duration} · in your genre</p>
                          </div>
                          <p className="font-bold text-amber-600 text-xl">£{tier.price}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 mb-4">
                    <p className="text-xs text-emerald-800 dark:text-emerald-400">
                      <strong>Why boost?</strong> Boosted posts get 5x more views and 3x more hypes.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setShowBoostModal(false)} className="flex-1 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                    <button onClick={handleBoostSubmit} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-lg transition-colors">
                      Boost for £{boostTiers[selectedTier].price}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* PUBLISH TOAST */}
      {postToast && (
        <div className="fixed bottom-8 right-8 z-50 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl">
          <p className="font-bold">✓ Success!</p>
          <p className="text-xs text-gray-400">Your update has been posted.</p>
        </div>
      )}

    </div>
  );
}