"use client";
import { useState } from "react";
import { useRevenue, PLATFORM_COMMISSION } from "@/lib/hooks/useRevenue";

interface Props {
  open: boolean;
  onClose: () => void;
  artist: {
    id: string;
    name: string;
    ratePence: number;
    role: string;
  } | null;
}

export default function BookArtistModal({ open, onClose, artist }: Props) {
  const { recordBooking } = useRevenue();
  const [success, setSuccess] = useState(false);
  const [brief, setBrief] = useState("");
  const [date, setDate] = useState("");

  if (!open || !artist) return null;

  const commissionPence = Math.round(artist.ratePence * PLATFORM_COMMISSION.booking);
  const artistPence = artist.ratePence - commissionPence;
  const priceStr = (artist.ratePence / 100).toFixed(0);

  const handleBook = () => {
    if (!brief.trim()) return;
    recordBooking({
      artistId: artist.id,
      artistName: artist.name,
      bookerId: "ulisses",
      bookerName: "Ulisses Silva",
      pricePence: artist.ratePence,
    });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Booking sent</h2>
            <p className="text-sm text-gray-500">{artist.name} will confirm within 24 hours. You'll get an email when confirmed.</p>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Book {artist.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{artist.role} · £{priceStr}/session</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Preferred date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">What do you need?</label>
                <textarea
                  rows={4}
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  placeholder="Session vocals for a House track, 2 hours, London studio..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>
              <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3 text-xs">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600 dark:text-zinc-400">Session rate</span>
                  <span className="font-bold text-gray-900 dark:text-white">£{priceStr}</span>
                </div>
                <div className="flex justify-between mb-1 text-gray-500">
                  <span>{artist.name} receives</span>
                  <span>£{(artistPence / 100).toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>GRID fee (15%)</span>
                  <span>£{(commissionPence / 100).toFixed(0)}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 font-semibold py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBook}
                  disabled={!brief.trim()}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg transition-colors"
                >
                  Send booking request
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}