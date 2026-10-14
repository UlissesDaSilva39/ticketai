"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import MediaUploader from "./MediaUploader";

export default function PostComposer({ userId }: { userId: string }) {
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioTitle, setAudioTitle] = useState("");
  const [audioArtist, setAudioArtist] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const canPost = (body.trim().length > 0 || imageUrl || videoUrl || audioUrl) && !loading;

  const submit = async () => {
    if (!canPost) return;
    setLoading(true); setError("");
    const supabase = createClient();
    const { error: err } = await supabase.from("posts").insert({
      author_id: userId, author_type: "user",
      body: body.trim(),
      image_url: imageUrl, video_url: videoUrl, audio_url: audioUrl,
      audio_title: audioTitle.trim() || null,
      audio_artist: audioArtist.trim() || null,
      like_count: 0, comment_count: 0, share_count: 0,
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setBody(""); setImageUrl(null); setVideoUrl(null);
    setAudioUrl(null); setAudioTitle(""); setAudioArtist("");
    router.refresh();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6">
      <textarea
        value={body} onChange={(e) => setBody(e.target.value)}
        placeholder="What is happening?" aria-label="What is happening?" rows={3}
        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-black focus:outline-none resize-none text-black placeholder-gray-400"
      />
      <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        <MediaUploader kind="image" userId={userId} value={imageUrl} onChange={setImageUrl} label="Photo" />
        <MediaUploader kind="video" userId={userId} value={videoUrl} onChange={setVideoUrl} label="Video" />
        <MediaUploader kind="audio" userId={userId} value={audioUrl} onChange={setAudioUrl} label="Audio" />
        <button onClick={submit} disabled={!canPost}
          className="ml-auto px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
      {audioUrl ? (
        <div className="grid grid-cols-2 gap-2 mt-3">
          <input value={audioTitle} onChange={(e) => setAudioTitle(e.target.value)}
            placeholder="Track title"
            className="rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-gray-400" />
          <input value={audioArtist} onChange={(e) => setAudioArtist(e.target.value)}
            placeholder="Artist"
            className="rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-gray-400" />
        </div>
      ) : null}
      {error ? <p className="text-xs text-red-600 mt-2" role="alert">{error}</p> : null}
    </div>
  );
}
