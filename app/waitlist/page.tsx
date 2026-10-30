"use client";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";

export default function WaitlistPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setStatus("unauthenticated"); return; }
      setEmail(user.email || "");
      const { data } = await supabase
        .from("waitlist")
        .select("status")
        .eq("user_id", user.id)
        .maybeSingle();
      setStatus(data?.status || "none");
    })();
  }, []);

  const joinWaitlist = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("waitlist").insert({
      user_id: user.id,
      email: user.email || "",
      status: "pending",
    });
    setStatus("pending");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="max-w-lg w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Waitlist</h1>

        {status === null && <p className="text-gray-500 dark:text-gray-400">Loading...</p>}

        {status === "unauthenticated" && (
          <p className="text-gray-600 dark:text-gray-400">
            Please <Link href="/login" className="underline font-semibold">log in</Link> to join the waitlist.
          </p>
        )}

        {status === "none" && (
          <>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Discovery is open to everyone. To unlock messaging, wallet, and networking, join the waitlist.
            </p>
            <button onClick={joinWaitlist} className="bg-black text-white px-6 py-3 rounded-lg font-semibold">
              Join waitlist
            </button>
          </>
        )}

        {status === "pending" && (
          <>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Thanks - we have your request for <strong>{email}</strong>. We review applications weekly.
            </p>
            <Link href="/discover" className="text-black dark:text-white font-semibold underline">
              Keep browsing Discovery
            </Link>
          </>
        )}

        {status === "approved" && (
          <>
            <p className="text-gray-600 dark:text-gray-400 mb-6">You are approved. Everything is unlocked.</p>
            <Link href="/discover" className="text-black dark:text-white font-semibold underline">
              Go to Discover
            </Link>
          </>
        )}

        {status === "rejected" && (
          <p className="text-gray-600 dark:text-gray-400">
            Your application was not approved this time. You can keep using Discovery.
          </p>
        )}
      </div>
    </div>
  );
}
