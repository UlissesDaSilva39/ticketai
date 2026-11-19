"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const dev = process.env.NODE_ENV !== "production";

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center text-neutral-900">
      <h1 className="text-2xl font-bold">This page couldn&apos;t load</h1>
      <p className="max-w-md text-sm text-neutral-600">Something went wrong. Try again, or go back.</p>
      {dev && (
        <pre className="max-w-3xl overflow-auto rounded-lg bg-red-50 p-4 text-left text-xs text-red-800">
          {error.message}
          {error.stack ? "\n\n" + error.stack.split("\n").slice(0, 8).join("\n") : ""}
        </pre>
      )}
      <div className="flex gap-3">
        <button type="button" onClick={reset} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
          Try again
        </button>
        <Link href="/home" className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold hover:bg-neutral-50">
          Back to home
        </Link>
      </div>
    </main>
  );
}