"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateMeetId, saveMeet, PURPOSE_LABELS, MeetPurpose, MeetKind } from "@/lib/meet";

export default function NewMeet() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [hostName, setHostName] = useState("");
  const [purpose, setPurpose] = useState<MeetPurpose>("general");
  const [kind, setKind] = useState<MeetKind>("group");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !hostName) return;
    const id = generateMeetId();
    saveMeet({ id, title, purpose, kind, hostName, isPrivate: false, createdAt: Date.now(), participants: [{ id: "host", name: hostName, role: "host", joined: false }], chat: [] });
    router.push(`/meet/${id}`);
  };

  return (
    <div className="meet-page">
      <div className="meet-container" style={{ maxWidth: 640, padding: "48px 24px" }}>
        <h1 className="meet-h2">New meeting</h1>
        <form onSubmit={handleCreate} className="meet-form">
          <label className="meet-field"><span>Meeting title</span><input required value={title} onChange={e => setTitle(e.target.value)} /></label>
          <label className="meet-field"><span>Your name</span><input required value={hostName} onChange={e => setHostName(e.target.value)} /></label>
          <label className="meet-field"><span>Purpose</span>
            <select value={purpose} onChange={e => setPurpose(e.target.value as MeetPurpose)}>
              {(Object.keys(PURPOSE_LABELS) as MeetPurpose[]).map(p => <option key={p} value={p}>{PURPOSE_LABELS[p]}</option>)}
            </select>
          </label>
          <label className="meet-field"><span>Type</span>
            <select value={kind} onChange={e => setKind(e.target.value as MeetKind)}>
              <option value="group">Group</option>
              <option value="one-to-one">One-to-one</option>
              <option value="audio-only">Audio only</option>
            </select>
          </label>
          <button type="submit" className="btn btn-primary">Create meeting</button>
        </form>
      </div>
    </div>
  );
}
