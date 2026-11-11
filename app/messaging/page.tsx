"use client";
import { useState } from "react";
import Link from "next/link";
import { PlayIcon, NoteIcon, AudioIcon, EpkIcon, SplitIcon, MarketIcon, BookmarkIcon, UsersIcon, CalendarSVG } from "@/components/MusicIcons";

export default function MessagingPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeThread, setActiveThread] = useState("sarah");
  const [activeFilter, setActiveFilter] = useState("Inbox");
  const [message, setMessage] = useState("");

  const [threads, setThreads] = useState([
    { 
      id: "beatport", 
      name: "Beatport", 
      preview: "Your Tech House Top 100 weekly drop is live", 
      time: "4:08 PM", 
      color: "bg-purple-600", 
      badge: "NEWSLETTER", 
      unread: true, 
      messages: [
        { from: "them", text: "Hi Ulisses, your Tech House Top 100 weekly drop is live. This week: Chris Stussy, Mau P, and Interplanetary Criminal.", hasAudio: true, audioName: "techhouse_top100.mp3", duration: "1:20" }
      ]
    },
    { 
      id: "sarah", 
      name: "Sarah J.", 
      preview: "Re: Vocalist for House track — here's my demo", 
      time: "Oct 30", 
      color: "bg-blue-600", 
      badge: "COLLAB", 
      unread: false, 
      messages: [
        { from: "them", text: "Hi Ulisses, loved your beat! I'm a vocalist looking for a House collab. Royalty split 50/50?", hasAudio: true, audioName: "vocal_demo_v2.wav", duration: "0:45" }
      ]
    },
    { 
      id: "sellick", 
      name: "Sellick Records (A&R)", 
      preview: "Loved your latest track — open to a call?", 
      time: "Nov 3", 
      color: "bg-emerald-600", 
      badge: "INDUSTRY", 
      unread: true, 
      messages: [
        { from: "them", text: "Hi Ulisses, I came across your latest track and loved the production. We are scouting Pop & R&B talent for 2027. Open to a quick call?", hasAudio: false }
      ]
    },
  ]);

  const activeData = threads.find(t => t.id === activeThread);

  const handleSend = () => {
    if (!message.trim()) return;
    
    setThreads(prev => prev.map(t => 
      t.id === activeThread 
        ? { ...t, messages: [...t.messages, { from: "me", text: message, hasAudio: false }] }
        : t
    ));
    
    setMessage("");
  };

  const handleAttach = (type: string) => {
    setThreads(prev => prev.map(t => 
      t.id === activeThread 
        ? { ...t, messages: [...t.messages, { from: "me", text: `Attached a ${type} to this conversation.`, hasAudio: false }] }
        : t
    ));
  };

  const filteredThreads = threads.filter(t => {
    if (activeFilter === "Inbox") return true;
    if (activeFilter === "Collabs") return t.badge === "COLLAB";
    if (activeFilter === "Bookings") return t.badge === "BOOKING";
    if (activeFilter === "Unread") return t.unread;
    return true;
  });

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen">
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

        <main className="col-span-12 lg:col-span-9 grid grid-cols-12 gap-3 h-[calc(100vh-120px)]">
          
          <section className="col-span-12 md:col-span-4 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-3 border-b border-gray-100 dark:border-zinc-800">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">Messaging</h2>
              <div className="relative mt-2">
                <input type="text" placeholder="Search messages" className="w-full bg-gray-100 dark:bg-zinc-800 text-xs rounded-full px-3 py-2 focus:outline-none" />
              </div>
            </div>
            <div className="flex gap-2 px-3 py-2 border-b border-gray-100 dark:border-zinc-800 text-[11px] overflow-x-auto no-scrollbar">
              {["Inbox","Collabs","Bookings","Unread"].map(t => (
                <button 
                  key={t} 
                  onClick={() => setActiveFilter(t)}
                  className={`px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors ${
                    activeFilter === t 
                      ? "bg-emerald-600 text-white border-emerald-600 font-semibold" 
                      : "border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-zinc-800">
              {filteredThreads.map(t => (
                <button 
                  key={t.id} 
                  onClick={() => setActiveThread(t.id)}
                  className={`w-full text-left flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors ${activeThread===t.id ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-l-4 border-emerald-600" : "border-l-4 border-transparent"}`}
                >
                  <div className={`w-10 h-10 ${t.color} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {t.badge === "NEWSLETTER" ? <NoteIcon /> : t.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{t.name}</p>
                      <span className="text-[10px] text-gray-500 ml-2 whitespace-nowrap">{t.time}</span>
                    </div>
                    <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded mt-0.5 ${
                      t.badge === "NEWSLETTER" ? "bg-purple-100 text-purple-700" :
                      t.badge === "COLLAB" ? "bg-blue-100 text-blue-700" :
                      "bg-emerald-100 text-emerald-700"
                    }`}>{t.badge}</span>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{t.preview}</p>
                  </div>
                  {t.unread && <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0"></div>}
                </button>
              ))}
            </div>
          </section>

          <section className="col-span-12 md:col-span-8 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full grid place-items-center text-white font-bold ${activeData?.color}`}>
                  {activeData?.badge === "NEWSLETTER" ? <NoteIcon /> : activeData?.name[0]}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-base">{activeData?.name}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{activeData?.badge}</p>
                </div>
              </div>
              <div className="flex gap-3 text-gray-400">
                <button className="hover:text-gray-600 dark:hover:text-gray-200 text-lg font-bold">···</button>
                <button className="hover:text-gray-600 dark:hover:text-gray-200 text-lg">☆</button>
              </div>
            </div>

            <div className="flex-1 p-5 overflow-y-auto bg-gray-50/50 dark:bg-zinc-900/50 space-y-4">
              {activeData?.messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] ${m.from === 'me' ? 'bg-emerald-600 text-white rounded-br-sm' : 'bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-800 dark:text-gray-200 rounded-bl-sm'} rounded-2xl p-3 shadow-sm`}>
                    <p className="text-sm">{m.text}</p>
                    {m.hasAudio && (
                      <div className="mt-3 flex items-center gap-3 bg-gray-50 dark:bg-zinc-900 rounded-lg p-2 border border-gray-100 dark:border-zinc-800">
                        <button onClick={() => setIsPlaying(!isPlaying)} className="w-8 h-8 rounded-full bg-emerald-600 text-white grid place-items-center hover:bg-emerald-700 transition-colors">
                          <PlayIcon className="w-4 h-4 ml-0.5" />
                        </button>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-900 dark:text-white">{m.audioName}</p>
                          <div className="h-1 bg-gray-200 dark:bg-zinc-700 rounded mt-1"><div className="h-1 bg-emerald-600 rounded" style={{width:"45%"}}></div></div>
                        </div>
                        <span className="text-xs text-gray-500 font-medium">{m.duration}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
              <div className="flex items-end gap-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-2 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a message..." 
                  className="w-full bg-transparent text-sm p-2 focus:outline-none resize-none max-h-32" 
                  rows={1} 
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                />
                <button onClick={handleSend} disabled={!message.trim()} className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors">Send</button>
              </div>
              <div className="flex gap-2 mt-2 ml-1">
                <button onClick={() => handleAttach("Audio Track")} className="text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold" title="Upload Track"><AudioIcon className="w-4 h-4" /> Upload Track</button>
                <button onClick={() => handleAttach("EPK")} className="text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold" title="Share EPK"><EpkIcon className="w-4 h-4" /> EPK</button>
                <button onClick={() => handleAttach("Split Sheet")} className="text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold" title="Propose Split"><SplitIcon className="w-4 h-4" /> Split</button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}