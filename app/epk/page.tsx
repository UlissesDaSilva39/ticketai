"use client";
import { useState } from "react";
import Link from "next/link";

const VerifiedIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
);
const StarIcon = ({ className = "w-4 h-4", filled = true }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={filled ? 0 : 2} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
);
const ShareIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
);
const PlayIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
);
const MapPinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const RadioIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>
);
const TicketIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
);
const ChatIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
);

export default function EPKPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [showPartyModal, setShowPartyModal] = useState(false);
  const [hasJoinedParty, setHasJoinedParty] = useState(false);

  const tabs = ["Overview", "Reviews", "Credits", "Tech Rider"];

  const reviews = [
    { id: 1, name: "Sarah Jenkins", role: "Vocalist · Verified Buyer", rating: 5, date: "Nov 2026", text: "Ulisses delivered the stems ahead of schedule and the mix was flawless. The royalty split was handled professionally via Escrow.", color: "bg-pink-500", verified: true },
    { id: 2, name: "David Chen", role: "Producer · Verified Buyer", rating: 5, date: "Oct 2026", text: "Incredible ear for House music. He turned my rough demo into a club-ready track in 3 days.", color: "bg-indigo-500", verified: true },
    { id: 3, name: "The Midnight Collective", role: "Indie Band · Verified Buyer", rating: 4, date: "Sep 2026", text: "Great communication, delivered exactly what we asked for. Would recommend for any techno/house project.", color: "bg-amber-500", verified: true },
  ];

  const credits = [
    { label: "Toolroom Records", type: "Label", year: "2024-2026" },
    { label: "Defected Records", type: "Label", year: "2023" },
    { label: "BBC Radio 1", type: "Radio", year: "2025" },
    { label: "Ministry of Sound", type: "Venue", year: "2026" },
    { label: "Beatport Top 100", type: "Chart", year: "2024-2026" },
    { label: "ADE Amsterdam", type: "Festival", year: "2025" },
  ];

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + "/artists/ulisses-silva");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinParty = () => {
    setHasJoinedParty(true);
  };

  // The listening party details
  const party = {
    title: "Midnight City — Live Listening Party",
    date: "Friday, Nov 15 · 8:00 PM GMT",
    tracks: 4,
    exclusive: "2 unreleased tracks",
    attendees: 247,
    ticketPrice: 5.00,
  };

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen relative">
      <div className="mx-auto max-w-[1280px] px-4 py-6">
        
        {/* HERO */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden mb-6">
          <div className="h-40 bg-gradient-to-r from-zinc-900 via-emerald-900 to-emerald-600 relative">
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <VerifiedIcon className="w-4 h-4 text-emerald-400" /> Verified Artist
            </div>
            <div className="absolute top-4 left-4">
              <button
                onClick={() => setShowPartyModal(true)}
                className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg transition-colors animate-pulse"
              >
                <RadioIcon className="w-4 h-4" /> Live Listening Party
              </button>
            </div>
          </div>
          <div className="p-6 md:p-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 -mt-20 md:-mt-24 mb-6">
              <div className="flex items-end gap-5">
                <div className="w-32 h-32 rounded-2xl bg-emerald-800 text-white grid place-items-center font-bold text-5xl ring-4 ring-white dark:ring-zinc-900 shadow-xl">U</div>
                <div className="mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    Ulisses Silva
                  </h1>
                  <p className="text-emerald-600 font-semibold text-lg">House / Techno Producer &amp; DJ</p>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mt-1"><MapPinIcon /> London, UK</div>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button onClick={handleShare} className="flex-1 md:flex-none border-2 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-bold px-6 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2">
                  <ShareIcon /> {copied ? "Copied!" : "Share EPK"}
                </button>
                <button onClick={() => setShowPartyModal(true)} className="flex-1 md:flex-none bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm">
                  <RadioIcon /> Listening Party
                </button>
                <Link href="/verify" className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-lg transition-colors shadow-sm text-center">Book Now</Link>
              </div>
            </div>

            {/* Rating Summary */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <StarIcon key={i} className={`w-5 h-5 ${i <= Math.round(Number(avgRating)) ? "text-amber-400" : "text-gray-300 dark:text-zinc-700"}`} />
                ))}
              </div>
              <p className="font-bold text-gray-900 dark:text-white">{avgRating}</p>
              <p className="text-sm text-gray-500">({reviews.length} verified reviews)</p>
            </div>

            {/* LISTENING PARTY BANNER */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 border-2 border-red-200 dark:border-red-800 rounded-xl p-5 mb-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center flex-shrink-0 animate-pulse">
                    <RadioIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-red-900 dark:text-red-400 text-base flex items-center gap-2">
                      {party.title}
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">LIVE SOON</span>
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-500 mt-1">{party.date}</p>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-2">
                      <TicketIcon className="w-3 h-3" /> £{party.ticketPrice.toFixed(2)} ticket · {party.tracks} tracks ({party.exclusive}) · {party.attendees} attending
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowPartyModal(true)} className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex-shrink-0">
                  Get Ticket →
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-gray-100 dark:border-zinc-800 mb-6 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === tab 
                      ? "text-emerald-600 border-emerald-600" 
                      : "text-gray-500 border-transparent hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Overview */}
            {activeTab === "Overview" && (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
                  <div><p className="text-xs text-gray-500 uppercase font-semibold">Ticket Draw</p><p className="text-2xl font-bold text-gray-900 dark:text-white">1,250</p></div>
                  <div><p className="text-xs text-gray-500 uppercase font-semibold">Listeners</p><p className="text-2xl font-bold text-gray-900 dark:text-white">45.2K</p></div>
                  <div><p className="text-xs text-gray-500 uppercase font-semibold">Past Shows</p><p className="text-2xl font-bold text-gray-900 dark:text-white">34</p></div>
                  <div><p className="text-xs text-gray-500 uppercase font-semibold">Match</p><p className="text-2xl font-bold text-emerald-600">98%</p></div>
                </div>
                <div className="mt-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Biography</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Ulisses Silva is an up-and-coming House and Techno producer based in London. Known for his energetic sets blending classic Tech House grooves with modern melodic elements.</p>
                </div>
                <div className="mt-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Genres</h2>
                  <div className="flex flex-wrap gap-2">
                    {["Tech House", "Melodic Techno", "Deep House", "DJ Set", "Live Act"].map(tag => (
                      <span key={tag} className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 text-xs font-bold px-3 py-1.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews */}
            {activeTab === "Reviews" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Client Reviews</h2>
                {reviews.map(review => (
                  <div key={review.id} className="bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <div className={`w-11 h-11 rounded-full ${review.color} text-white grid place-items-center font-bold flex-shrink-0`}>{review.name[0]}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-900 dark:text-white text-sm">{review.name}</p>
                            {review.verified && <VerifiedIcon className="w-4 h-4 text-emerald-500" />}
                          </div>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{review.role}</p>
                        <div className="flex items-center gap-0.5 mb-2">
                          {[1,2,3,4,5].map(i => (
                            <StarIcon key={i} className={`w-4 h-4 ${i <= review.rating ? "text-amber-400" : "text-gray-300"}`} />
                          ))}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">"{review.text}"</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Credits */}
            {activeTab === "Credits" && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Credits &amp; Placements</h2>
                <p className="text-sm text-gray-500 mb-6">Work history with verified labels, venues, and festivals.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {credits.map((credit, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 flex-shrink-0">
                          <span className="text-xs font-bold">{credit.label[0]}</span>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-sm">{credit.label}</p>
                          <p className="text-xs text-gray-500">{credit.type}</p>
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-emerald-600">{credit.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Rider */}
            {activeTab === "Tech Rider" && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Tech Rider</h2>
                <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-5 border border-gray-100 dark:border-zinc-800">
                  <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2"><span className="text-emerald-600">▸</span> 2x CDJ-3000</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-600">▸</span> 1x DJM-900 NXS2</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-600">▸</span> Stage Monitor required</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-600">▸</span> Set length: 60-120 mins</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FEATURED MIX */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Featured Mix</h2>
          <div className="bg-gray-100 dark:bg-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center border border-gray-200 dark:border-zinc-700">
            <button onClick={() => setIsPlaying(!isPlaying)} className="w-16 h-16 rounded-full bg-emerald-600 text-white grid place-items-center hover:bg-emerald-700 transition-transform hover:scale-105 shadow-lg mb-3">
              <PlayIcon className="w-8 h-8 ml-1" />
            </button>
            <p className="font-bold text-gray-900 dark:text-white">Live at Ministry of Sound (2026)</p>
            <p className="text-xs text-gray-500 mt-1">1:02:45 • 45.2K plays</p>
          </div>
        </div>
      </div>

      {/* LISTENING PARTY MODAL */}
      {showPartyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 w-full max-w-md overflow-hidden">
            {hasJoinedParty ? (
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">LIVE NOW</p>
                  </div>
                  <button onClick={() => setShowPartyModal(false)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">&times;</button>
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{party.title}</h2>
                <p className="text-xs text-gray-500 mb-4">{party.attendees + 1} people in the room</p>
                
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">U</div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">Track 1: Midnight City</p>
                      <div className="h-1 bg-gray-200 dark:bg-zinc-700 rounded mt-1">
                        <div className="h-1 bg-emerald-600 rounded" style={{width: "35%"}}></div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">1:45</span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-3 mb-4 max-h-32 overflow-y-auto space-y-2">
                  <div className="flex items-start gap-2 text-xs">
                    <div className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">S</div>
                    <div><p className="font-bold text-gray-900 dark:text-white">Sarah J.</p><p className="text-gray-600 dark:text-gray-400">This beat is 🔥🔥🔥</p></div>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">D</div>
                    <div><p className="font-bold text-gray-900 dark:text-white">David C.</p><p className="text-gray-600 dark:text-gray-400">When's the drop?</p></div>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">M</div>
                    <div><p className="font-bold text-gray-900 dark:text-white">Midnight</p><p className="text-gray-600 dark:text-gray-400">2 more unreleased tracks tonight 👀</p></div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2.5 rounded-lg transition-colors">Buy Track — £5</button>
                  <button onClick={() => setShowPartyModal(false)} className="border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 text-sm font-semibold px-4 py-2.5 rounded-lg">Leave</button>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-red-500 text-white flex items-center justify-center mb-4 animate-pulse">
                  <RadioIcon className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">{party.title}</h2>
                <p className="text-sm text-gray-500 text-center mb-6">Join Ulisses for an exclusive listening party of his new EP.</p>
                
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 mb-6 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Date</span><span className="font-semibold text-gray-900 dark:text-white">{party.date}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Tracks</span><span className="font-semibold text-gray-900 dark:text-white">{party.tracks} ({party.exclusive})</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Attending</span><span className="font-semibold text-gray-900 dark:text-white">{party.attendees} fans</span></div>
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-zinc-700"><span className="font-bold text-gray-900 dark:text-white">Ticket</span><span className="font-bold text-emerald-600">£{party.ticketPrice.toFixed(2)}</span></div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setShowPartyModal(false)} className="flex-1 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-semibold py-2.5 rounded-lg">Cancel</button>
                  <button onClick={handleJoinParty} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                    <TicketIcon className="w-4 h-4" /> Buy Ticket
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}