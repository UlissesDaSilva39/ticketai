"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/app/signup/actions";

const ROLES: Array<{ value: "artist" | "promoter" | "venue" | "attendee"; label: string }> = [
  { value: "attendee", label: "Fan" },
  { value: "artist", label: "Artist" },
  { value: "promoter", label: "Promoter" },
  { value: "venue", label: "Venue" },
];

export default function SignupForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [role, setRole] = useState<"artist" | "promoter" | "venue" | "attendee">("attendee");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await signUp({
        email: String(form.get("email") || ""),
        password: String(form.get("password") || ""),
        full_name: String(form.get("full_name") || ""),
        username: String(form.get("username") || ""),
        role,
        city: String(form.get("city") || ""),
      });

      if (res.error) {
        setError(res.error);
        return;
      }

      router.push("/home");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-black focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-black focus:outline-none"
        />
        <p className="text-xs text-gray-500 mt-1">At least 8 characters</p>
      </div>

      <div>
        <label htmlFor="full_name" className="block text-sm font-medium mb-1">Full name</label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          required
          autoComplete="name"
          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-black focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          required
          pattern="[A-Za-z0-9_.\\-]+"
          maxLength={30}
          autoComplete="username"
          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-black focus:outline-none"
          placeholder="yourname"
        />
        <p className="text-xs text-gray-500 mt-1">Letters, numbers, dot, dash, underscore</p>
      </div>

      <fieldset>
        <legend className="block text-sm font-medium mb-2">I am a...</legend>
        <div className="grid grid-cols-2 gap-2">
          {ROLES.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRole(r.value)}
              aria-pressed={role === r.value}
              className={
                "px-4 py-2 rounded-xl text-sm font-medium transition border " +
                (role === r.value
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-400")
              }
            >
              {r.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
        <input
          id="city"
          name="city"
          type="text"
          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-black focus:outline-none"
          placeholder="London"
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full px-6 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
      >
        {isPending ? "Creating account..." : "Create account"}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Already have an account?{" "}
        <Link href="/login" className="underline hover:text-black">Sign in</Link>
      </p>
    </form>
  );
}
