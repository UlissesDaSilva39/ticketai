import type { Metadata } from "next";
import Link from "next/link";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create account",
  description: "Join GRID — the network for live music.",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-md px-6 py-16">
        <Link href="/" className="inline-block mb-10">
          <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-antonio)" }}>GRID</span>
        </Link>

        <h1 className="text-4xl font-bold uppercase mb-2" style={{ fontFamily: "var(--font-antonio)" }}>
          Create account
        </h1>
        <p className="text-gray-600 mb-8">
          Join the network for live music.
        </p>

        <SignupForm />
      </div>
    </div>
  );
}
