"use client";
import { useState } from "react";
import Link from "next/link";

export default function PublicEPKPage() {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen">
      <header className="bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-50">
        <div className="max-w-[1128px] mx-auto px-4 flex justify-between items-center h-14">
          <Link href="/" className="text-xl font-bold text-emerald-600">GRID</Link>
          <div className="flex gap-3">
            <button onClick={handleShare} className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 px-4 py-1.5 rounded-full text-sm font-semibold">
              {copied ? "Copied!" : "Share"}
            </button>
            <Link href="/home" className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-sm font-bold">Join GRID</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1000px] px-4 py-8">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden mb-6">
          <div className="h-48 bg-gradient-to-r from-zinc-900 to-emerald-900" />
          <div className="p-6 md:p-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 -mt-20 md:-mt-24 mb-6">
              <div className="flex items-end gap-5">
                <div className="w-32 h-32 rounded-2xl bg-emerald-600 text-white grid place-items-center font-bold text-5xl ring-4 ring-white dark:ring-zinc-900 shadow-lg">U</div>
                <div className="mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ulisses Silva</h1>
                  <p className="text-emerald-600 font-semibold text-lg">House / Techno Producer & DJ</p>
                  <p className="text-gray-500 text-sm mt-1">London, UK</p>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button onClick={handleShare} className="flex-1 md:flex-none border-2 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-bold px-6 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  {copied ? "Copied!" : "Share EPK"}
                </button>
                <Link href="/verify" className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-2.5 rounded-lg transition-colors text-center">Book Now</Link>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-gray-100 dark:border-zinc-800">
              <div><p className="text-xs text-gray-500 uppercase">Ticket Draw</p><p className="text-2xl font-bold text-gray-900 dark:text-white">1,250</p></div>
              <div><p className="text-xs text-gray-500 uppercase">Listeners</p><p className="text-2xl font-bold text-gray-900 dark:text-white">45.2K</p></div>
              <div><p className="text-xs text-gray-500 uppercase">Past Shows</p><p className="text-2xl font-bold text-gray-900 dark:text-white">34</p></div>
              <div><p className="text-xs text-gray-500 uppercase">Match</p><p className="text-2xl font-bold text-emerald-600">98%</p></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="md:col-span-2 space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Biography</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Ulisses Silva is an up-and-coming House and Techno producer based in London. Known for his energetic sets blending classic Tech House grooves with modern melodic elements.</p>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-4">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {["Tech House", "Melodic Techno", "Deep House", "DJ Set"].map(tag => (
                    <span key={tag} className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 text-xs font-bold px-3 py-1.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-5 border border-gray-100 dark:border-zinc-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Tech Rider</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-disc list-inside">
                  <li>2x CDJ-3000</li>
                  <li>1x DJM-900 NXS2</li>
                  <li>Stage Monitor required</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Featured Mix</h2>
          <div className="bg-gray-100 dark:bg-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center border border-gray-200 dark:border-zinc-700">
            <button onClick={() => setIsPlaying(!isPlaying)} className="w-16 h-16 rounded-full bg-emerald-600 text-white grid place-items-center hover:bg-emerald-700 shadow-lg mb-3">
              <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </button>
            <p className="font-bold text-gray-900 dark:text-white">Live at Ministry of Sound (2026)</p>
            <p className="text-xs text-gray-500 mt-1">1:02:45 • 45.2K plays</p>
          </div>
        </div>

        <div className="mt-8 bg-emerald-600 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Want to book Ulisses?</h2>
          <p className="text-emerald-100 mb-6">Join GRID to message the artist and secure the booking via Escrow.</p>
          <Link href="/home" className="bg-white text-emerald-700 font-bold px-8 py-3 rounded-lg inline-block">Create Free Account</Link>
        </div>
      </div>
    </div>
  );
}