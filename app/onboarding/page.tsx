"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CheckIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
);
const MicIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 003-3V6a3 3 0 00-6 0v6a3 3 0 003 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 01-14 0v-2M12 19v3m-4 0h8" /></svg>
);
const BuildingIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
);
const MusicIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
);

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [genre, setGenre] = useState("");
  const [links, setLinks] = useState({ spotify: "", beatport: "" });

  const handleFinish = () => {
    // In a real app, you would save this to the database here.
    // For now, we redirect to the appropriate dashboard.
    if (role === "venue") {
      router.push("/business");
    } else {
      router.push("/home");
    }
  };

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-zinc-800 w-full max-w-2xl overflow-hidden">
        
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-gray-100 dark:bg-zinc-800">
          <div className="h-full bg-emerald-600 transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} />
        </div>

        <div className="p-8 md:p-12">
          
          {/* STEP 1: ROLE */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome to GRID</h1>
              <p className="text-gray-500 mb-8">Tell us who you are so we can customize your experience.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <button onClick={() => setRole("artist")} className={`p-6 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${role === "artist" ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" : "border-gray-200 dark:border-zinc-700 hover:border-emerald-300"}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${role === "artist" ? "bg-emerald-600 text-white" : "bg-gray-100 dark:bg-zinc-800 text-gray-500"}`}><MicIcon /></div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Artist / Producer</h3>
                  <p className="text-xs text-gray-500 mt-1">Find gigs, collab, and sell music</p>
                </button>

                <button onClick={() => setRole("venue")} className={`p-6 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${role === "venue" ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" : "border-gray-200 dark:border-zinc-700 hover:border-emerald-300"}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${role === "venue" ? "bg-emerald-600 text-white" : "bg-gray-100 dark:bg-zinc-800 text-gray-500"}`}><BuildingIcon /></div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Venue / Promoter</h3>
                  <p className="text-xs text-gray-500 mt-1">Book talent and manage events</p>
                </button>

                <button onClick={() => setRole("curator")} className={`p-6 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${role === "curator" ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" : "border-gray-200 dark:border-zinc-700 hover:border-emerald-300"}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${role === "curator" ? "bg-emerald-600 text-white" : "bg-gray-100 dark:bg-zinc-800 text-gray-500"}`}><MusicIcon /></div>
                  <h3 className="font-bold text-gray-900 dark:text-white">A&R / Curator</h3>
                  <p className="text-xs text-gray-500 mt-1">Discover new talent and pitch</p>
                </button>
              </div>

              <button onClick={() => setStep(2)} disabled={!role} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors">
                Continue
              </button>
            </div>
          )}

          {/* STEP 2: GENRE */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">What's your sound?</h1>
              <p className="text-gray-500 mb-8">Select your primary genres to get matched with the right people.</p>
              
              <div className="flex flex-wrap gap-3 mb-8">
                {["House", "Techno", "Pop", "R&B", "Hip-Hop", "Indie", "Rock", "Jazz", "Classical", "EDM"].map((g) => (
                  <button key={g} onClick={() => setGenre(g)} className={`px-5 py-2.5 rounded-full text-sm font-bold border-2 transition-all ${genre === g ? "border-emerald-600 bg-emerald-600 text-white" : "border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 hover:border-emerald-300"}`}>
                    {g}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="w-1/3 border-2 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-bold py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">Back</button>
                <button onClick={() => setStep(3)} disabled={!genre} className="w-2/3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors">Continue</button>
              </div>
            </div>
          )}

          {/* STEP 3: LINKS */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Build your EPK</h1>
              <p className="text-gray-500 mb-8">Link your streaming profiles so collaborators know you're the real deal.</p>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Spotify Artist URL</label>
                  <input type="url" value={links.spotify} onChange={(e) => setLinks({...links, spotify: e.target.value})} placeholder="https://open.spotify.com/artist/..." className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Beatport Profile (Optional)</label>
                  <input type="url" value={links.beatport} onChange={(e) => setLinks({...links, beatport: e.target.value})} placeholder="https://www.beatport.com/artist/..." className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-emerald-500" />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="w-1/3 border-2 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-bold py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">Back</button>
                <button onClick={handleFinish} className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <CheckIcon /> Finish & Enter GRID
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}