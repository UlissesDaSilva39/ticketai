'use client';

import { useState } from 'react';

export default function WaitlistModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      // API call to save email goes here
    }
  };

  return (
    <>
      {/* PERSISTENT SIDE PANEL (Fixed on desktop, hidden on mobile) */}
      <div className="hidden lg:block fixed right-6 top-24 z-50 w-[340px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-slide-in-right">
        
        {/* Header */}
        <div className="bg-emerald-600 p-4 text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-extrabold tracking-tighter">GRID</span>
                <span className="bg-white text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Pro</span>
              </div>
              <h3 className="text-lg font-bold leading-tight">Join the Waitlist</h3>
            </div>
            <button onClick={onClose} className="text-emerald-200 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <div className="p-5">
          {submitted ? (
             <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">You're on the list!</h3>
              <p className="text-xs text-gray-500">Keep an eye on your inbox. Early access opens in batches.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Your audience is yours. Prove it with Pro. Analytics, audience export, unlimited listings.
              </p>

              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 mb-4">
                <p className="text-emerald-800 text-xs font-bold">
                  First 100 artists lock in £8/month for life.
                </p>
                <p className="text-emerald-600 text-[10px] mt-0.5">
                  After that, it's £12.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-2">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourdomain.com"
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
                <button 
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-2.5 rounded-lg transition-colors shadow-sm"
                >
                  Join waitlist
                </button>
              </form>

              <p className="text-[10px] text-gray-400 text-center mt-3">
                ✓ No card required. ✓ Cancel anytime.
              </p>
            </>
          )}
        </div>
      </div>

      {/* MOBILE ONLY MODAL (Full screen overlay for smaller devices) */}
      <div className="lg:hidden fixed inset-0 z-[100] flex justify-center items-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
        <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
           {/* Mobile Header */}
           <div className="bg-emerald-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tighter">GRID</span>
                <span className="bg-white text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Pro</span>
              </div>
              <button onClick={onClose} className="text-emerald-200 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
           </div>
           
           <div className="p-5">
              {submitted ? (
                <div className="text-center py-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">You're on the list!</h3>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Join the Waitlist</h3>
                  <p className="text-sm text-gray-600 mb-4">Your audience is yours. Prove it with Pro.</p>
                  <form onSubmit={handleSubmit} className="space-y-2">
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@yourdomain.com"
                      required
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button type="submit" className="w-full bg-emerald-600 text-white font-bold text-sm py-2.5 rounded-lg">Join waitlist</button>
                  </form>
                </>
              )}
           </div>
        </div>
      </div>
    </>
  );
}