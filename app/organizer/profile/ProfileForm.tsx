"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ProfileForm({
  userId,
  initial,
}: {
  userId: string;
  initial: {
    full_name: string;
    bio: string;
    city: string;
    website: string;
    instagram: string;
    twitter: string;
  };
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const save = async () => {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("profiles")
        .update(form)
        .eq("id", userId);
      if (updateError) throw updateError;
      setMessage("Profile updated!");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-2">Display Name</label>
        <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="Your name or brand" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Bio</label>
        <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="Tell fans about you and the events you create..." />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">City</label>
          <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="London" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Website</label>
          <input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="https://..." />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Instagram Username</label>
          <input type="text" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="username (no @)" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">X (Twitter) Username</label>
          <input type="text" value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="username (no @)" />
        </div>
      </div>
      {message && <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">{message}</p>}
      {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
      <button onClick={save} disabled={saving} className="w-full py-4 bg-black text-white font-medium rounded-full hover:bg-gray-800 disabled:opacity-50">
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}
