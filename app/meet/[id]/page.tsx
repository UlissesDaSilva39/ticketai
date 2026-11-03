"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getMeet, MeetRoom, PURPOSE_LABELS } from "@/lib/meet";

export default function MeetRoomPage() {
  const params = useParams();
  const id = params?.id as string;
  const [room, setRoom] = useState<MeetRoom | null>(null);

  useEffect(() => { if (id) setRoom(getMeet(id)); }, [id]);

  if (!room) return <div className="meet-page meet-container" style={{ padding: 48 }}>Meeting not found.</div>;

  return (
    <div className="meet-page meet-room">
      <header className="meet-room-header">
        <div>
          <div className="meet-room-title">{room.title}</div>
          <div className="meet-room-meta">{PURPOSE_LABELS[room.purpose]} · {room.id}</div>
        </div>
        <Link href="/meet" className="btn">Leave</Link>
      </header>
      <div className="meet-room-body">
        <div className="meet-room-stage">
          <div className="meet-stage-placeholder">
            <div className="meet-avatar-big">{room.hostName[0]}</div>
            <div>Camera off</div>
          </div>
        </div>
        <aside className="meet-room-side">
          <h3 className="meet-side-title">Chat</h3>
          <div className="meet-chat"><div className="meet-chat-empty">No messages yet</div></div>
        </aside>
      </div>
    </div>
  );
}
