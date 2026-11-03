"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateMeetId, saveMeet, PURPOSE_LABELS, MeetPurpose } from "@/lib/meet";

export default function SchedulePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [hostName, setHostName] = useState("");
  const [purpose, setPurpose] = useState<MeetPurpose>("general");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !hostName || !date) return;
    const scheduledFor = new Date(`${date}T${time || "10:00"}`).getTime();
    const id = generateMeetId();
    saveMeet({ id, title, purpose, kind: "group", hostName, scheduledFor, isPrivate: false, createdAt: Date.now(), participants: [{ id: "host", name: hostName, role: "host", joined: false }], chat: [] });
    router.push("/meet");
  };

  return (
    <div className="meet-page">
      <div className="meet-container" style={{ maxWidth: 640, padding: "48px 24px" }}>
        <h1 className="meet-h2">Schedule a meeting</h1>
        <form onSubmit={handleSubmit} className="meet-form">
          <label className="meet-field"><span>Title</span><input required value={title} onChange={e => setTitle(e.target.value)} /></label>
          <label className="meet-field"><span>Your name</span><input required value={hostName} onChange={e => setHostName(e.target.value)} /></label>
          <label className="meet-field"><span>Purpose</span>
            <select value={purpose} onChange={e => setPurpose(e.target.value as MeetPurpose)}>
              {(Object.keys(PURPOSE_LABELS) as MeetPurpose[]).map(p => <option key={p} value={p}>{PURPOSE_LABELS[p]}</option>)}
            </select>
          </label>
          <label className="meet-field"><span>Date</span><input required type="date" value={date} onChange={e => setDate(e.target.value)} /></label>
          <label className="meet-field"><span>Time</span><input type="time" value={time} onChange={e => setTime(e.target.value)} /></label>
          <button type="submit" className="btn btn-primary">Schedule</button>
        </form>
      </div>
    </div>
  );
}
