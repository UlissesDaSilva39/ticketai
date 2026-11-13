"use client";
import { useState } from "react";
import { useRevenue, FEATURED_GIG_PRICE } from "@/lib/hooks/useRevenue";

interface Props {
  open: boolean;
  onClose: () => void;
  gigId: string;
  gigTitle: string;
}

export default function FeatureGigModal({ open, onClose, gigId, gigTitle }: Props) {
  const { featureGig } = useRevenue();
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const handleFeature = () => {
    featureGig(gigId, 7);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Gig is featured</h2>
            <p className="text-sm text-gray-500">Your gig is now at the top of /jobs for 7 days.</p>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-6 text-center text-white">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-1">Feature this gig</h2>
              <p className="text-xs text-amber-100">{gigTitle}</p>
            </div>
            <div className="p-6">
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-zinc-300">
                  <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Top of /jobs for 7 days</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-zinc-300">
                  <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>"Featured" badge on the card</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-zinc-300">
                  <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>~4× more applications</span>
                </li>
              </ul>
              <div className="flex justify-between items-center mb-6 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <span className="text-sm font-bold text-gray-900 dark:text-white">7-day featured</span>
                <span className="text-xl font-bold text-amber-600">£{FEATURED_GIG_PRICE}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 font-semibold py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFeature}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-lg transition-colors"
                >
                  Pay £{FEATURED_GIG_PRICE}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}