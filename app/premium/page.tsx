"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl font-bold mb-4"></h1>
      <p className="text-gray-600 mb-8">
        This page is for <code>/premium</code>. Content coming soon.
      </p>
      <button onClick={() => router.back()} className="rounded-full border px-5 py-3 text-sm">
        Back
      </button>
    </main>
  );
}