"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const CheckIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
);
const MailIcon = ({ className = "w-12 h-12" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Request from the browser so the secure link works when opened in this same browser.
    const { error } = await createClient().auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    setIsLoading(false);
    if (error) console.error("[forgot-password]", error.message);
    // Always show "sent" so the page doesn't reveal which emails have accounts.
    setIsSent(true);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      
      {/* LEFT PANEL: Branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-zinc-900 to-emerald-900 p-12 flex-col justify-between text-white">
        <Link href="/" className="text-3xl font-bold tracking-tight">GRID</Link>
        
        <div>
          <h1 className="text-4xl font-bold mb-4">Reset your password.</h1>
          <p className="text-emerald-100 text-lg mb-8">
            We'll send you a secure link to get you back into your account.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-400 text-sm font-bold">1</span>
              </div>
              <div>
                <p className="font-bold text-sm">Enter your email</p>
                <p className="text-xs text-emerald-200 mt-0.5">The email you signed up with.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-400 text-sm font-bold">2</span>
              </div>
              <div>
                <p className="font-bold text-sm">Check your inbox</p>
                <p className="text-xs text-emerald-200 mt-0.5">Click the reset link in the email.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-400 text-sm font-bold">3</span>
              </div>
              <div>
                <p className="font-bold text-sm">Create new password</p>
                <p className="text-xs text-emerald-200 mt-0.5">You'll be back in your account in seconds.</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-emerald-300 text-xs">© 2026 GRID Corporation. All rights reserved.</p>
      </div>

      {/* RIGHT PANEL: Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-[#f4f2ee] dark:bg-black">
        <div className="w-full max-w-md">
          
          {/* Mobile Logo */}
          <Link href="/" className="md:hidden block text-2xl font-bold text-emerald-600 mb-8">GRID</Link>

          {!isSent ? (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Forgot password?</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                  Enter your email and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={!email || isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors"
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <div className="mt-8 text-center">
                <Link href="/login" className="text-sm text-emerald-600 font-semibold hover:underline">
                  ← Back to login
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <MailIcon className="text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Check your inbox</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-2 text-sm">
                We've sent a password reset link to:
              </p>
              <p className="font-bold text-gray-900 dark:text-white text-sm mb-6">{email}</p>
              
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 mb-6 text-left">
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <CheckIcon className="w-4 h-4" /> What to do next
                </p>
                <ul className="text-xs text-emerald-700 dark:text-emerald-500 space-y-1">
                  <li>1. Check your inbox (and spam folder).</li>
                  <li>2. Click the reset link in the email.</li>
                  <li>3. Create your new password.</li>
                </ul>
              </div>

              <p className="text-xs text-gray-500 mb-6">
                Didn't receive the email? Check your spam folder or{" "}
                <button onClick={() => setIsSent(false)} className="text-emerald-600 font-semibold hover:underline">
                  try again
                </button>
              </p>

              <Link href="/login" className="inline-block bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold px-8 py-3 rounded-xl hover:bg-black dark:hover:bg-gray-100 transition-colors">
                Back to Login
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}