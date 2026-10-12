"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function PostComposer({ userId }: { userId: string }) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const submit = async () => {
    if (!body.trim()) return;
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: err } = await supabase.from("posts").insert({
      author_id: userId,
      author_type: "user",
      body: body.trim(),
      like_count: 0,
      comment_count: 0,
      share_count: 0,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setBody("");
    router.refresh();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="What is happening?"
        rows={3}
        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-black focus:outline-none resize-none text-black placeholder-gray-400"
      />
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
      <div className="flex justify-end mt-3">
        <button
          onClick={submit}
          disabled={loading || !body.trim()}
          className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}