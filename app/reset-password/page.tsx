"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Reached from the password-reset email (via /auth/callback, which signs the user in).
export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        setEmail(data.user?.email ?? null);
        setChecked(true);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("The two passwords don't match.");

    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setSaving(false);
      return setError(error.message);
    }
    // End the reset-link session so the user logs in again with the new password.
    await supabase.auth.signOut();
    setSaving(false);
    setDone(true);
    setTimeout(() => {
      router.push("/login?reset=1");
      router.refresh();
    }, 1500);
  };

  const inputClass =
    "w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f4f2ee] dark:bg-black">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-2xl font-bold text-emerald-600 mb-8">GRID</Link>

        {!checked ? (
          <p className="text-sm text-gray-500">Checking your reset link…</p>
        ) : !email ? (
          <>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Link expired</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This reset link is no longer valid. Request a new one and open it in this same browser.
            </p>
            <Link href="/forgot-password" className="inline-block mt-6 text-emerald-600 font-semibold hover:underline">
              Send a new link →
            </Link>
          </>
        ) : done ? (
          <>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Password updated</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Taking you to log in with your new password…</p>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Choose a new password</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 mb-8 text-sm">
              For <span className="font-semibold text-gray-900 dark:text-white">{email}</span>
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New password</label>
                <input type="password" autoComplete="new-password" value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Confirm password</label>
                <input type="password" autoComplete="new-password" value={confirm}
                  onChange={(e) => setConfirm(e.target.value)} className={inputClass} />
              </div>
              {error && (
                <p role="alert" className="text-sm text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}
              <button type="submit" disabled={saving}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors">
                {saving ? "Saving…" : "Save new password →"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
