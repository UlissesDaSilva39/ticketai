'use client';
import { useState } from 'react';

export default function MessagingPopup() {
  const [isOpen, setIsOpen] = useState(false);
  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="fixed bottom-0 right-8 z-40 bg-emerald-700 hover:bg-emerald-800 text-white rounded-t-lg px-4 py-2 flex items-center gap-2 shadow-lg font-semibold text-sm">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
        Messaging
      </button>
    );
  }
  const threads = [
    { name: "Beatport", preview: "Your Tech House Top 100 weekly drop is live", time: "4:08 PM", color: "bg-purple-600", badge: "NEWSLETTER" },
    { name: "Sellick Records (A&R)", preview: "Loved your latest track — open to a call?", time: "Nov 3", color: "bg-emerald-600", badge: "INDUSTRY" },
    { name: "Sarah J.", preview: "Re: Vocalist for House track — here's my demo 🎧", time: "Oct 30", color: "bg-blue-600", badge: "COLLAB" },
  ];
  return (
    <div className="fixed bottom-0 right-8 z-40 w-[340px] bg-white dark:bg-zinc-900 rounded-t-lg shadow-2xl border border-gray-200 dark:border-zinc-800 flex flex-col overflow-hidden h-[450px]">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-zinc-800">
        <span className="font-semibold text-gray-900 dark:text-white text-sm">Messaging</span>
        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 p-1 rounded text-lg leading-none">&times;</button>
      </div>
      <div className="flex gap-1 px-2 pt-2 border-b border-gray-200 dark:border-zinc-800 text-xs">
        {["Inbox","Collabs","Bookings"].map((t,i) => (
          <button key={t} className={`px-2 py-1 rounded-t ${i===0 ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-gray-500"}`}>{t}</button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {threads.map((t, i) => (
          <div key={i} className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer border-b border-gray-100 dark:border-zinc-800/50">
            <div className={`w-10 h-10 ${t.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>{t.name[0]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{t.name}</p>
                <span className="text-xs text-gray-500 ml-2">{t.time}</span>
              </div>
              <span className="inline-block text-[9px] font-bold tracking-wide px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 mt-0.5">{t.badge}</span>
              <p className="text-xs text-gray-500 truncate mt-0.5">{t.preview}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}