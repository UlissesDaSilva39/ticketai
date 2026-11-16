"use client";
import { useState } from "react";
import Link from "next/link";
import { LICENSING_CONTACTS, LICENCE_REQUIREMENTS, PROGRAMME_STEPS, PRS_DIGITAL_LICENCE } from "@/lib/data/licensingInfo";
import { useLicensing } from "@/lib/hooks/useLicensing";

const CheckIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default function LicensingPage() {
  const { submitApplication, applications, hydrated } = useLicensing();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    artistName: "",
    email: "",
    trackTitle: "",
    isrc: "",
    masterOwner: "",
    composer: "",
    publisher: "",
    message: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.artistName.trim() || !form.email.includes("@") || !form.trackTitle.trim() || !form.masterOwner.trim() || !form.composer.trim()) {
      setError("Please fill in all required fields");
      return;
    }
    submitApplication(form);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-xs font-semibold text-gray-500 hover:text-emerald-600 mb-6 inline-block">
          ← Back to GRID
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-4 py-1.5 rounded-full text-xs font-bold mb-4">
            GRID Music Licensing Programme
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Licence your music to GRID
          </h1>
          <p className="text-lg text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Get paid when your tracks are streamed on GRID Billboard. We accept independent artists, labels, and producers with master ownership.
          </p>
        </div>

        {/* Requirements */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What each feature requires</h2>
          <div className="space-y-3">
            {LICENCE_REQUIREMENTS.map((r) => (
              <div key={r.feature} className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 pb-3 border-b border-gray-100 dark:border-zinc-800 last:border-0 last:pb-0">
                <span className="font-semibold text-sm text-gray-900 dark:text-white md:w-48 flex-shrink-0">{r.feature}</span>
                <span className="text-sm text-gray-600 dark:text-zinc-400">{r.permissions}</span>
              </div>
            ))}
          </div>
        </div>

        {/* The programme */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How the licensing programme works</h2>
          <div className="space-y-3">
            {PROGRAMME_STEPS.map((s) => (
              <div key={s.step} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {s.step}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{s.title}</p>
                  <p className="text-xs text-gray-600 dark:text-zinc-400">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PRS digital licence */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{PRS_DIGITAL_LICENCE.name}</h2>
          <div className="space-y-2 text-sm text-gray-700 dark:text-zinc-300">
            <p><strong>Eligibility:</strong> {PRS_DIGITAL_LICENCE.eligibility}</p>
            <p><strong>Coverage:</strong> {PRS_DIGITAL_LICENCE.coverage}</p>
            <p className="text-amber-800 dark:text-amber-300"><strong>Limitation:</strong> {PRS_DIGITAL_LICENCE.limitation}</p>
          </div>
        </div>

        {/* Contacts */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Who to contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LICENSING_CONTACTS.map((c) => (
              <div key={c.id} className="border border-gray-200 dark:border-zinc-800 rounded-xl p-4">
                <p className="font-bold text-gray-900 dark:text-white text-sm">{c.name}</p>
                <p className="text-[10px] uppercase font-bold text-emerald-600 mt-0.5">{c.role}</p>
                <p className="text-xs text-gray-600 dark:text-zinc-400 mt-2">{c.description}</p>
                <div className="mt-2 flex gap-3 text-xs">
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-semibold hover:underline">
                    Website →
                  </a>
                  {c.email && (
                    <a href={`mailto:${c.email}`} className="text-emerald-600 font-semibold hover:underline">
                      {c.email}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application form */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Submit your catalogue</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4">
            We'll review your submission within 5 business days.
          </p>

          {submitted ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckIcon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Application received</h3>
              <p className="text-sm text-gray-500 mb-4">
                We'll review "{form.trackTitle}" by {form.artistName} and reply within 5 business days.
              </p>
              <p className="text-xs text-gray-400">
                Or email us directly: <a href="mailto:licensing@grid.app" className="text-emerald-600 font-semibold">licensing@grid.app</a>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Artist / label name *</label>
                  <input type="text" value={form.artistName} onChange={(e) => setForm({...form, artistName: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Track title *</label>
                <input type="text" value={form.trackTitle} onChange={(e) => setForm({...form, trackTitle: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">ISRC (if known)</label>
                  <input type="text" value={form.isrc} onChange={(e) => setForm({...form, isrc: e.target.value})} placeholder="GB-AYE-26-00001" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Master owner *</label>
                  <input type="text" value={form.masterOwner} onChange={(e) => setForm({...form, masterOwner: e.target.value})} placeholder="Your label or yourself" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Composer *</label>
                  <input type="text" value={form.composer} onChange={(e) => setForm({...form, composer: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Publisher</label>
                  <input type="text" value={form.publisher} onChange={(e) => setForm({...form, publisher: e.target.value})} placeholder="PRS member or publisher name" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Anything else we should know?</label>
                <textarea rows={3} value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm resize-none" />
              </div>
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-xs text-red-800 dark:text-red-300">{error}</p>
                </div>
              )}
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors">
                Submit for review →
              </button>
              <p className="text-[10px] text-gray-400 text-center">
                Or email licensing@grid.app directly with your details.
              </p>
            </form>
          )}
        </div>

        {hydrated && applications.length > 0 && (
          <p className="text-center text-xs text-gray-500">
            {applications.length} application{applications.length === 1 ? "" : "s"} submitted from this browser.
          </p>
        )}
      </div>
    </div>
  );
}