"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BadgeCheck, CheckCircle2, ShieldCheck, Mail, Link as LinkIcon, FileText, Upload } from "lucide-react";

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
      <main className="min-h-screen bg-gray-50 text-black flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 p-10 text-center shadow-xl shadow-gray-200/50">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black mb-3">Application Received</h1>
          <p className="text-gray-500 mb-8 leading-relaxed text-sm">
            Thank you for applying for verification. Our team will review your profile and get back to you within 5-7 business days.
          </p>
          <button
            onClick={() => router.push("/epk")}
            className="w-full rounded-full bg-black text-white px-6 py-4 font-bold hover:bg-gray-900 transition-colors"
          >
            Back to your EPK
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

        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <BadgeCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">Get Verified</h1>
            <p className="text-gray-500 text-sm mt-1">Apply for the official GRID verification badge.</p>
          </div>
        </div>
        
        <p className="text-gray-500 text-lg leading-relaxed mb-10">
          Verified badges are granted to notable artists, producers, and curators who have a significant presence in the music industry. Please provide accurate information to help us review your application.
        </p>

        {/* Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { title: "Authentic Identity", desc: "Prove you are who you say you are." },
            { title: "Notable Presence", desc: "Show your impact in the music scene." },
            { title: "Active Account", desc: "Maintain an active and complete profile." }
          ].map((req, i) => (
            <div key={i} className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
              <ShieldCheck className="w-5 h-5 text-gray-400 mb-3" />
              <h3 className="font-bold text-sm mb-1">{req.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{req.desc}</p>
            </div>
          ))}
        </div>

        {/* The Form */}
        <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 bg-white p-8 md:p-10 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Verification Application</h2>
          
          <div className="space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Legal Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-4 w-4 text-gray-400" />
                  </div>
                  <input required type="text" className="w-full pl-10 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-black focus:outline-none" placeholder="John Doe" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Stage Name / Artist Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BadgeCheck className="h-4 w-4 text-gray-400" />
                  </div>
                  <input required type="text" className="w-full pl-10 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-black focus:outline-none" placeholder="DJ Sonic" />
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">Official Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input required type="email" className="w-full pl-10 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-black focus:outline-none" placeholder="contact@domain.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Official Website</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input type="url" className="w-full pl-10 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-black focus:outline-none" placeholder="https://" />
                </div>
              </div>
            </div>

            {/* Links */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Links to prove notability</label>
              <p className="text-xs text-gray-500 mb-2">Provide links to Spotify, Beatport, Instagram, or articles (one per line).</p>
              <textarea required className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-black focus:outline-none h-28" placeholder="https://open.spotify.com/artist/...&#10;https://www.instagram.com/..."></textarea>
            </div>

            {/* ID Upload */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Government ID Upload (Optional)</label>
              <p className="text-xs text-gray-500 mb-2">To speed up the process, you can upload a redacted copy of your ID.</p>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, or PDF (max. 5MB)</p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-black text-white px-6 py-4 font-bold hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
            <p className="text-center text-xs text-gray-400 mt-4 max-w-md mx-auto">
              Applications are reviewed manually by the GRID Trust & Safety team. Submitting false information will result in a permanent ban.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}