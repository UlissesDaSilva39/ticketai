"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CheckIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
);
const GoogleIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
);

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<"artist" | "venue" | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !email || !password) return;
    setIsLoading(true);
    
    // Simulate signup (no database yet)
    setTimeout(() => {
      // Route to onboarding wizard
      router.push("/onboarding");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      
      {/* LEFT PANEL: Branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-emerald-600 to-emerald-900 p-12 flex-col justify-between text-white">
        <Link href="/" className="text-3xl font-bold tracking-tight">GRID</Link>
        
        <div>
          <h1 className="text-4xl font-bold mb-4">Join the industry's #1 music network.</h1>
          <p className="text-emerald-100 text-lg mb-8">
            Get booked. Get paid. Build your career on GRID.
          </p>
          
          <ul className="space-y-3">
            {[
              "Access to 10,000+ artists and venues",
              "Secure Escrow payments on every deal",
              "Verified badges to build trust",
              "Free to start. No credit card required.",
            ].map((benefit, i) => (
              <li key={i} className="flex items-start gap-2 text-emerald-50">
                <CheckIcon className="w-5 h-5 mt-0.5 text-emerald-300 flex-shrink-0" />
                <span className="text-sm">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-emerald-300 text-xs">© 2026 GRID Corporation. All rights reserved.</p>
      </div>

      {/* RIGHT PANEL: Signup Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-[#f4f2ee] dark:bg-black">
        <div className="w-full max-w-md">
          
          {/* Mobile Logo */}
          <Link href="/" className="md:hidden block text-2xl font-bold text-emerald-600 mb-8">GRID</Link>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create your account</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              Already have an account? <Link href="/login" className="text-emerald-600 font-semibold hover:underline">Log in</Link>
            </p>
          </div>

          {/* Google OAuth Button */}
          <button
            onClick={() => router.push("/onboarding")}
            className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors mb-6"
          >
            <GoogleIcon /> Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-zinc-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#f4f2ee] dark:bg-black px-3 text-gray-500">Or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            
            {/* Role Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("artist")}
                  className={`py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                    role === "artist"
                      ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                      : "border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:border-emerald-300"
                  }`}
                >
                  Artist / Producer
                </button>
                <button
                  type="button"
                  onClick={() => setRole("venue")}
                  className={`py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                    role === "venue"
                      ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                      : "border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:border-emerald-300"
                  }`}
                >
                  Venue / A&R
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!role || !email || !password || isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? "Creating account..." : "Create Free Account →"}
            </button>

            <p className="text-center text-xs text-gray-500 mt-4">
              By signing up, you agree to our <Link href="/legal" className="text-emerald-600 hover:underline">Terms of Service</Link> and <Link href="/legal" className="text-emerald-600 hover:underline">Privacy Policy</Link>.
            </p>
          </form>

        </div>
      </div>
    </div>
  );
}