"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveApplication, Application } from "@/lib/records";

export default function ApplyPage() {
  const router = useRouter();
  const [artistName, setArtistName] = useState("");
  const [artistHandle, setArtistHandle] = useState("");
  const [email, setEmail] = useState("");
  const [genres, setGenres] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artistName || !email) return;
    const app: Application = {
      id: `app-${Date.now()}`,
      artistName,
      artistHandle: artistHandle || artistName.toLowerCase().replace(/\s+/g, ""),
      email,
      genres: genres.split(",").map(s => s.trim()).filter(Boolean),
      demoUrl,
      message,
      status: "submitted",
      submittedAt: Date.now(),
    };
    saveApplication(app);
    setSubmitted(true);
    setTimeout(() => router.push("/records/roster"), 2000);
  };

  if (submitted) {
    return (
      <div className="records-page">
        <div className="records-container" style={{ maxWidth: 640, padding: "64px 24px", textAlign: "center" }}>
          <h1 className="records-h2">Application submitted</h1>
          <p className="records-subtitle" style={{ margin: "0 auto 32px" }}>
            We'll listen within 7 days. Check your email for updates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="records-page">
      <div className="records-container" style={{ maxWidth: 640, padding: "48px 24px" }}>
        <h1 className="records-h2">Apply to GRID Records</h1>
        <p className="records-subtitle" style={{ fontSize: 14, marginBottom: 32 }}>
          We sign artists, producers, DJs and bands. 50/50 standard split. No fees.
        </p>

        <form onSubmit={handleSubmit} className="records-form">
          <label className="records-field"><span>Artist / band name</span><input required value={artistName} onChange={e => setArtistName(e.target.value)} /></label>
          <label className="records-field"><span>Handle (optional)</span><input value={artistHandle} onChange={e => setArtistHandle(e.target.value)} placeholder="e.g. djpoxy" /></label>
          <label className="records-field"><span>Email</span><input required type="email" value={email} onChange={e => setEmail(e.target.value)} /></label>
          <label className="records-field"><span>Genres (comma-separated)</span><input value={genres} onChange={e => setGenres(e.target.value)} placeholder="House, Disco, Funk" /></label>
          <label className="records-field"><span>Demo link</span><input value={demoUrl} onChange={e => setDemoUrl(e.target.value)} placeholder="Spotify, SoundCloud, YouTube" /></label>
          <label className="records-field"><span>Tell us about yourself</span><textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} placeholder="What have you released? What's your audience? What do you need from a label?" /></label>
          <button type="submit" className="btn btn-primary">Submit application</button>
        </form>
      </div>
    </div>
  );
}
