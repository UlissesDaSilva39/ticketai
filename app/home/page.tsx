"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlayIcon, MicIcon, SlidersIcon, NoteIcon, CalendarSVG, MarketIcon, BookmarkIcon, UsersIcon, HypeIcon, ReplyIcon } from "@/components/MusicIcons";
import OfferBanner from "@/components/home/OfferBanner";
import ProTrialCard from "@/components/home/ProTrialCard";
import InviteCard from "@/components/home/InviteCard";
import TrustStrip from "@/components/home/TrustStrip";
import CtaTracker from "@/components/home/CtaTracker";
import MobileProBar from "@/components/home/MobileProBar";
import MatchedForYou from "@/components/home/MatchedForYou";
import PostCollabButton from "@/components/home/PostCollabButton";
import ProfileStrength from "@/components/home/ProfileStrength";
import GridStories from "@/components/grid/GridStories";
import GridComposer from "@/components/grid/GridComposer";

const VerifiedIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
  </svg>
);
const SparkleIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"/></svg>
);

export default function HomePage() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [hypeCount, setHypeCount] = useState(0);
  const [hasHyped, setHasHyped] = useState(false);
  const [followed, setFollowed] = useState<{[key: string]: boolean}>({});
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [postToast, setPostToast] = useState(false);

  // Algorithmic Matches
  const [matches, setMatches] = useState([
    { id: 1, type: "COLLAB", title: "House Vocalist needed", poster: "Sarah J.", match: "98% match", reason: "Same genre (House) + 3 mutual collabs", color: "bg-pink-500" },
    { id: 2, type: "BOOKING", title: "Opening slot at Ministry of Sound", poster: "The O2 Academy", match: "95% match", reason: "Your genre + London based", color: "bg-emerald-600" },
    { id: 3, type: "COLLAB", title: "Techno remix swap", poster: "Alex Rivera", match: "89% match", reason: "Same BPM range + techno focus", color: "bg-indigo-500" },
  ]);
  const [dismissedMatches, setDismissedMatches] = useState<number[]>([]);

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

  const dismissMatch = (id: number) => {
    setDismissedMatches([...dismissedMatches, id]);
  };

  const visibleMatches = matches.filter(m => !dismissedMatches.includes(m.id));

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
              <ProfileStrength />
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
          <CtaTracker />
          <MobileProBar />
          <OfferBanner />
          
          {/* STORIES */}
          <GridStories />

          {/* ALGORITHMIC MATCHES */}
          {visibleMatches.length > 0 && (
            <MatchedForYou />
          )}

          {/* Composer (photo/video upload + posts) */}
          <GridComposer
            audioIcon={<NoteIcon className="w-4 h-4" />}
            eventIcon={<CalendarSVG className="w-4 h-4" />}
            onAudioClick={() => alert("Audio upload coming soon!")}
            onEventClick={() => alert("Event creation coming soon!")}
            onPublished={() => {
              setPostToast(true);
              setTimeout(() => setPostToast(false), 3000);
            }}
          />

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
                  <button className="text-gray-400 hover:text-gray-600 font-bold tracking-widest px-2">•••</button>
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
                </div>
              </div>
            </div>
          </div>

        </main>

        {/* RIGHT COLUMN */}
        <aside className="col-span-12 lg:col-span-3 space-y-4">
          <ProTrialCard />
          <InviteCard />
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
            <PostCollabButton />
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