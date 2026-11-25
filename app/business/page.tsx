"use client";
import { useState } from "react";
import Link from "next/link";
import { PlayIcon, MarketIcon, BookmarkIcon, UsersIcon, CalendarSVG, MicIcon, NoteIcon } from "@/components/MusicIcons";

const ShieldIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
);
const StarIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
);
const WalletIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
);

export default function BusinessDashboard() {
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingFee, setBookingFee] = useState(500);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const artists = [
    { id: 1, name: "Sarah Jenkins", role: "Vocalist · House", location: "London, UK", draw: "1.2K past tickets", match: "98% match", color: "bg-pink-500", verified: true },
    { id: 2, name: "David Chen", role: "DJ / Producer", location: "Berlin, DE", draw: "3.4K past tickets", match: "95% match", color: "bg-indigo-500", verified: true },
    { id: 3, name: "The Midnight Collective", role: "Indie Band", location: "Manchester, UK", draw: "850 past tickets", match: "89% match", color: "bg-amber-500", verified: false },
  ];

  const handleBookNow = (artist: any) => {
    setSelectedArtist(artist);
    setShowBookingModal(true);
    setBookingSuccess(false);
  };

  const handleConfirmBooking = () => {
    setBookingSuccess(true);
    setTimeout(() => {
      setShowBookingModal(false);
      setBookingSuccess(false);
      setBookingDate("");
      setBookingFee(500);
    }, 3000);
  };

  const platformFee = bookingFee * 0.05;
  const totalCost = bookingFee + platformFee;

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen">
      <div className="mx-auto max-w-[1280px] px-4 py-6 grid grid-cols-12 gap-6">

        <aside className="col-span-12 lg:col-span-3 space-y-3">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-zinc-800 dark:to-black" />
            <div className="p-5 -mt-10 text-center relative">
              <div className="w-20 h-20 mx-auto rounded-full bg-gray-900 dark:bg-black border-2 border-emerald-500 text-emerald-500 grid place-items-center font-bold text-2xl ring-4 ring-white dark:ring-zinc-900 mb-3">
                <MarketIcon className="w-8 h-8" />
              </div>
              <p className="font-bold text-gray-900 dark:text-white text-lg">The O2 Academy</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Venue & Promoter</p>
              <p className="text-xs text-gray-500 mt-1">London, UK</p>
              
              <div className="mt-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-lg p-3">
                <div className="flex items-center justify-center gap-1 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <StarIcon className="w-3.5 h-3.5" /> Pro Venue Plan
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Unlimited bookings & full EPK access.</p>
              </div>
            </div>
            <div className="border-t border-gray-100 dark:border-zinc-800 p-4">
              <ul className="space-y-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <li><Link href="/business" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><UsersIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Artist Roster</span></Link></li>
                <li><Link href="/calendar" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><CalendarSVG className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Venue Calendar</span></Link></li>
                <li><Link href="/saved" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><BookmarkIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Saved Artists</span></Link></li>
              </ul>
            </div>
          </div>
        </aside>

        <main className="col-span-12 lg:col-span-9 space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
            <h1 className="font-bold text-gray-900 dark:text-white text-2xl">Talent Discovery</h1>
            <p className="text-sm text-gray-500 mt-1">Find and book the best artists for your venue using real performance data.</p>
            
            <div className="flex flex-wrap gap-3 mt-5">
              <select className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"><option>All Genres</option><option>House / Techno</option><option>Pop / R&B</option><option>Indie / Rock</option></select>
              <select className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"><option>Any Location</option><option>London</option><option>Berlin</option><option>Manchester</option></select>
              <select className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"><option>Min. Ticket Draw: 500+</option><option>Min. Ticket Draw: 1K+</option><option>Min. Ticket Draw: 5K+</option></select>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">Recommended Artists</h2>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">{artists.length} matches found</span>
            </div>
            
            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
              {artists.map((a) => (
                <div key={a.id} className="p-5 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full ${a.color} text-white grid place-items-center font-bold text-xl flex-shrink-0`}>{a.name[0]}</div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-1.5">
                        {a.name}
                        {a.verified && (<svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>)}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{a.role}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{a.location}</p>
                    </div>
                  </div>
                  <div className="flex flex-col md:items-end gap-3">
                    <div className="flex gap-2">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded-md flex items-center gap-1"><ShieldIcon className="w-3.5 h-3.5" /> {a.match}</span>
                      <span className="text-xs font-semibold text-gray-600 bg-gray-100 dark:bg-zinc-800 dark:text-gray-400 px-2 py-1 rounded-md">{a.draw}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link href="/epk" className="border border-emerald-600 text-emerald-700 dark:text-emerald-400 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">View EPK</Link>
                      <button onClick={() => handleBookNow(a)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">Book Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* BOOKING / ESCROW MODAL */}
      {showBookingModal && selectedArtist && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            
            {bookingSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Booking Confirmed!</h2>
                <p className="text-sm text-gray-500">£{totalCost.toFixed(2)} has been locked in Escrow. {selectedArtist.name} has been notified.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">Book {selectedArtist.name}</h3>
                  <button onClick={() => setShowBookingModal(false)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">&times;</button>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-zinc-800">
                    <div className={`w-12 h-12 rounded-full ${selectedArtist.color} text-white grid place-items-center font-bold text-lg`}>{selectedArtist.name[0]}</div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{selectedArtist.name}</p>
                      <p className="text-xs text-gray-500">{selectedArtist.role}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Booking Date</label>
                      <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Artist Fee (£)</label>
                      <input type="number" value={bookingFee} onChange={(e) => setBookingFee(Number(e.target.value))} className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                    </div>
                  </div>

                  {/* Payment Breakdown */}
                  <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-4 mb-6 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400"><span>Artist Fee:</span><span>£{bookingFee.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400"><span>GRID Escrow Fee (5%):</span><span>£{platformFee.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-zinc-700"><span>Total Deposit:</span><span>£{totalCost.toFixed(2)}</span></div>
                  </div>

                  <button onClick={handleConfirmBooking} disabled={!bookingDate || bookingFee <= 0} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <WalletIcon className="w-5 h-5" /> Deposit £{totalCost.toFixed(2)} into Escrow
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-3">Funds are held securely until the performance is complete.</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}