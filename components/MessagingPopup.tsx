'use client';
import { useState } from 'react';
import { NoteIcon, AudioIcon, EpkIcon, AttachIcon } from "@/components/MusicIcons";

export default function MessagingPopup() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="fixed bottom-0 right-8 z-40 bg-emerald-600 hover:bg-emerald-700 text-white rounded-t-lg px-4 py-2.5 flex items-center gap-2 shadow-lg font-semibold text-sm transition-colors">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
        Messaging
      </button>
    );
  }

  const threads = [
    { name: "Beatport", preview: "Your Tech House Top 100 weekly drop is live", time: "4:08 PM", color: "bg-purple-600", icon: true },
    { name: "Sellick Records (A&R)", preview: "Loved your latest track — open to a call?", time: "Nov 3", color: "bg-emerald-600" },
    { name: "Sarah J.", preview: "Re: Vocalist for House track — here's my demo", time: "Oct 30", color: "bg-blue-600" },
  ];

  return (
    <div className="fixed bottom-0 right-8 z-40 w-[340px] bg-white dark:bg-zinc-900 rounded-t-lg shadow-2xl border border-gray-200 dark:border-zinc-800 flex flex-col overflow-hidden h-[500px]">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-2">
           <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold">U</div>
           <span className="font-semibold text-gray-900 dark:text-white text-sm">Messaging</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <button className="hover:bg-gray-100 dark:hover:bg-zinc-800 p-1 rounded font-bold">···</button>
          <button onClick={() => setIsOpen(false)} className="hover:bg-gray-100 dark:hover:bg-zinc-800 p-1 rounded text-xl leading-none">&times;</button>
        </div>
      </div>

      <div className="p-2 border-b border-gray-200 dark:border-zinc-800">
        <div className="relative">
          <svg className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" placeholder="Search messages" className="w-full bg-gray-100 dark:bg-zinc-800 text-xs rounded-full px-8 py-2 focus:outline-none" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {threads.map((t, i) => (
          <div key={i} className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer border-b border-gray-100 dark:border-zinc-800/50">
            <div className={`w-10 h-10 ${t.color} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
              {t.icon ? <NoteIcon /> : t.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{t.name}</p>
                <span className="text-[10px] text-gray-500 ml-2 whitespace-nowrap">{t.time}</span>
              </div>
              <p className="text-xs text-gray-500 truncate mt-0.5">{t.preview}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2">
        <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-2 border border-gray-200 dark:border-zinc-700">
          <textarea placeholder="Write a message..." className="w-full bg-transparent text-sm focus:outline-none resize-none h-10" />
          <div className="flex items-center justify-between mt-1">
            <div className="flex gap-1 text-gray-500">
              <button className="hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 p-1.5 rounded transition-colors" title="Upload Track">
                <AudioIcon className="w-5 h-5" />
              </button>
              <button className="hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 p-1.5 rounded transition-colors" title="Share EPK">
                <EpkIcon className="w-5 h-5" />
              </button>
              <button className="hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 p-1.5 rounded transition-colors" title="Attach File">
                <AttachIcon className="w-5 h-5" />
              </button>
            </div>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}