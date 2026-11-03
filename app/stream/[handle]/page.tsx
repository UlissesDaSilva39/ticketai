"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getChannel, getItemsByChannel, CATEGORY_LABELS, StreamChannel, StreamItem } from "@/lib/stream";

export default function ChannelPage() {
  const params = useParams();
  const handle = params?.handle as string;
  const [channel, setChannel] = useState<StreamChannel | null>(null);
  const [items, setItems] = useState<StreamItem[]>([]);

  useEffect(() => {
    if (!handle) return;
    setChannel(getChannel(handle));
    setItems(getItemsByChannel(handle));
  }, [handle]);

  if (!channel) return <div className="stream-page stream-container" style={{ padding: 48 }}>Channel not found.</div>;

  return (
    <div className="stream-page">
      <header className="stream-channel-hero">
        <div className="stream-container stream-channel-hero-inner">
          <div className="stream-channel-avatar large">{channel.name[0]}</div>
          <div className="stream-channel-hero-info">
            <div className="stream-channel-name large">{channel.name}{channel.verified && <span className="stream-verified">V</span>}</div>
            <div className="stream-channel-meta">{channel.followers.toLocaleString()} followers · {channel.videos} videos</div>
            <p className="stream-channel-desc">{channel.description}</p>
            <div className="stream-channel-actions">
              <button className="btn btn-primary">Follow</button>
              <Link href={`/meet/new?with=${channel.handle}`} className="btn">Meet {channel.name.split(" ")[0]}</Link>
            </div>
          </div>
        </div>
      </header>
      <section className="stream-section">
        <div className="stream-container">
          <h2 className="stream-h2">Videos</h2>
          <div className="stream-video-grid">
            {items.map(item => (
              <Link key={item.id} href={`/stream/watch/${item.id}`} className="stream-video-card">
                <div className="stream-video-thumb">
                  {item.kind === "live" && <span className="stream-live-badge">LIVE</span>}
                  {item.isExclusive && <span className="stream-exclusive">EXCLUSIVE</span>}
                  <div className="stream-video-placeholder">{channel.name}</div>
                </div>
                <div className="stream-video-title">{item.title}</div>
                <div className="stream-video-meta">{CATEGORY_LABELS[item.category]}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
