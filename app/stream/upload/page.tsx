"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addStreamItem, CATEGORY_LABELS, StreamCategory } from "@/lib/stream";

export default function UploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [category, setCategory] = useState<StreamCategory>("music-video");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !artistName) return;
    addStreamItem({
      id: `s-${Date.now()}`, title, description: "", artistHandle: artistName.toLowerCase().replace(/\s+/g, ""),
      artistName, kind: "video", category, duration: 0, viewerCount: 0, likeCount: 0, createdAt: Date.now(),
    });
    router.push("/stream");
  };

  return (
    <div className="stream-page">
      <div className="stream-container" style={{ maxWidth: 720, padding: "48px 24px" }}>
        <h1 className="stream-h2">Upload a video</h1>
        <form onSubmit={handleSubmit} className="stream-form">
          <label className="stream-field"><span>Title</span><input required value={title} onChange={e => setTitle(e.target.value)} /></label>
          <label className="stream-field"><span>Artist name</span><input required value={artistName} onChange={e => setArtistName(e.target.value)} /></label>
          <label className="stream-field"><span>Category</span>
            <select value={category} onChange={e => setCategory(e.target.value as StreamCategory)}>
              {(Object.keys(CATEGORY_LABELS) as StreamCategory[]).map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
            </select>
          </label>
          <button type="submit" className="btn btn-primary">Publish</button>
        </form>
      </div>
    </div>
  );
}
