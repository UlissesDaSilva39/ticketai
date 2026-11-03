"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getStreamItem, CATEGORY_LABELS, StreamItem } from "@/lib/stream";

export default function WatchPage() {
  const params = useParams();
  const id = params?.id as string;
  const [item, setItem] = useState<StreamItem | null>(null);

  useEffect(() => { if (id) setItem(getStreamItem(id)); }, [id]);

  if (!item) return <div className="stream-page stream-container" style={{ padding: 48 }}>Video not found.</div>;

  return (
    <div className="stream-page">
      <div className="stream-container">
        <div className="stream-watch-layout">
          <div className="stream-watch-main">
            <div className="stream-player">
              <div className="stream-player-placeholder-large">
                <div className="stream-player-placeholder-title">{item.title}</div>
                <div className="stream-player-message">{item.kind === "live" ? "LIVE" : "Video placeholder"}</div>
              </div>
            </div>
            <h1 className="stream-watch-title">{item.title}</h1>
            <div className="stream-watch-meta">
              <Link href={`/stream/${item.artistHandle}`} className="stream-watch-artist">{item.artistName}</Link>
              <span> · {CATEGORY_LABELS[item.category]}</span>
              <span> · {item.viewerCount?.toLocaleString() ?? 0} views</span>
            </div>
            <p className="stream-watch-desc">{item.description}</p>
          </div>
          <aside className="stream-watch-side">
            <h3 className="stream-side-title">Meet the artist</h3>
            <Link href={`/meet/new?with=${item.artistHandle}`} className="btn btn-primary" style={{ width: "100%" }}>Start a Meet</Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
