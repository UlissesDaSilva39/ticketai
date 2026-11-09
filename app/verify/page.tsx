"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BadgeCheck, CheckCircle2, ShieldCheck } from "lucide-react";

export default function GetVerifiedPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-white text-black flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black mb-3">Application Received</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Thank you for applying for verification. Our team will review your profile and get back to you within 5-7 business days.
          </p>
          <button
            onClick={() => router.push("/epk")}
            className="w-full rounded-full bg-black text-white px-6 py-4 font-bold hover:bg-gray-900 transition-colors"
          >
            Back to your profile
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100">
            <BadgeCheck className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-black tracking-tight">Get Verified</h1>
        </div>
        
        <p className="text-gray-500 text-lg leading-relaxed mb-10">
          Verified badges are granted to notable artists, producers, and curators who have a significant presence in the music industry. 
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { title: "Authentic Identity", desc: "Prove you are who you say you are." },
            { title: "Notable Presence", desc: "Show your impact in the music scene." },
            { title: "Active Account", desc: "Maintain an active and complete profile." }
          ].map((req, i) => (
            <div key={i} className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
              <ShieldCheck className="w-5 h-5 text-gray-400 mb-3" />
              <h3 className="font-bold text-sm mb-1">{req.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{req.desc}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Verification Application</h2>
          
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Legal Name</label>
                <input required type="text" className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-black focus:outline-none" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Stage Name / Artist Name</label>
                <input required type="text" className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-black focus:outline-none" placeholder="DJ Sonic" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Official Website</label>
              <input type="url" className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-black focus:outline-none" placeholder="https://" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Links to prove notability</label>
              <p className="text-xs text-gray-500 mb-2">Provide links to Spotify, Beatport, Instagram, or articles (one per line).</p>
              <textarea required className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-black focus:outline-none h-24" placeholder="https://open.spotify.com/artist/..."></textarea>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-blue-600 text-white px-6 py-4 font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
            <p className="text-center text-xs text-gray-400 mt-4">
              Applications are reviewed manually. Submitting false information will result in a permanent ban.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}