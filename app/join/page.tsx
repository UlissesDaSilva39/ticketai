"use client";
import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function JoinPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("fan");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
      );
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Please log in first, then join the waitlist.");
        setLoading(false);
        return;
      }
      const { error: insertError } = await supabase.from("waitlist").insert({
        user_id: user.id,
        email: user.email || "",
        full_name: name,
        role,
        city,
      });
      if (insertError) throw insertError;
      router.push("/waitlist");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <form onSubmit={handleSubmit} className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 space-y-4">
        <h1 className="text-2xl font-bold text-center">Join the waitlist</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Discovery is open. For messaging, networking and wallet, join the waitlist.
        </p>

        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />

        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
          <option value="fan">I am a fan</option>
          <option value="artist">I am an artist / DJ</option>
          <option value="promoter">I am a promoter</option>
          <option value="venue">I run a venue</option>
          <option value="label">I run a label</option>
          <option value="industry">I work in the industry</option>
        </select>

        <input
          type="text"
          placeholder="Your city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button type="submit" disabled={loading} className="w-full bg-black text-white py-3 rounded-lg font-semibold disabled:opacity-50">
          {loading ? "Submitting..." : "Join waitlist"}
        </button>
      </form>
    </div>
  );
}
