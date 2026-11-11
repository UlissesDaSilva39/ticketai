"use client";
import { useState } from "react";
import Link from "next/link";

const CheckIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
);
const ShieldIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
);
const UploadIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
);

export default function VerifyPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen py-12 px-4">
      <div className="max-w-[900px] mx-auto">
        <div className="mb-6">
          <Link href="/home" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-emerald-600 transition-colors">
            &larr; Back
          </Link>
        </div>

        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto bg-emerald-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg">
            <ShieldIcon className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Get Verified on GRID</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-3 max-w-xl mx-auto">Verified badges are granted to notable artists, producers, and curators who have a significant presence in the music industry.</p>
        </div>

        {!submitted ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              {[
                { title: "Authentic Identity", desc: "Prove you are who you say you are." },
                { title: "Notable Presence", desc: "Show your impact in the music scene." },
                { title: "Active Account", desc: "Maintain an active and complete profile." },
              ].map((b, i) => (
                <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 mb-3"><CheckIcon /></div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">{b.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{b.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm p-6 mb-6">
              <div className="border-b border-gray-100 dark:border-zinc-800 pb-4 mb-4">
                <h2 className="font-bold text-gray-900 dark:text-white">Verification Application</h2>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Legal Name</label>
                    <input type="text" placeholder="John Doe" className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stage Name / Artist Name</label>
                    <input type="text" placeholder="DJ Sonic" className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Official Website</label>
                  <input type="url" placeholder="https://" className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Links to prove notability</label>
                  <p className="text-xs text-gray-500 mb-2">Provide links to Spotify, Beatport, Instagram, or articles (one per line).</p>
                  <textarea rows={4} placeholder="https://open.spotify.com/artist/..." className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 resize-none" />
                </div>
                <button onClick={() => setSubmitted(true)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors">Submit Application</button>
                <p className="text-center text-xs text-gray-500">Applications are reviewed manually. Submitting false information will result in a permanent ban.</p>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm p-12 text-center">
            <div className="w-20 h-20 mx-auto bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 mb-6">
              <CheckIcon className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Application Submitted!</h2>
            <p className="text-gray-500 mb-8">We'll notify you within 24-48 hours.</p>
            <Link href="/home" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-lg inline-block transition-colors">Back to Feed</Link>
          </div>
        )}
      </div>
    </div>
  );
}