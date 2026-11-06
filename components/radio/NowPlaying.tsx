"use client";
import Link from "next/link";
import { RadioNowPlaying } from "@/lib/radio";

export default function NowPlaying({ data }: { data: RadioNowPlaying }) {
  const progress = data.duration > 0 ? (data.elapsed / data.duration) * 100 : 0;

  return (
    <div className="radio-now-playing">
      <div className="radio-now-header">
        <span className={"radio-live-badge" + (data.isOnline ? " live" : "")}>
          {data.isOnline ? "LIVE" : "OFFLINE"}
        </span>
        {data.isLive && data.streamerName && (
          <span className="radio-streamer">
            Live with <strong>{data.streamerName}</strong>
          </span>
        )}
        <span className="radio-listeners">{data.listeners} listeners</span>
      </div>

      <div className="radio-now-body">
        {data.artworkUrl ? (
          <img src={data.artworkUrl} alt="" className="radio-artwork" />
        ) : (
          <div className="radio-artwork-placeholder">R</div>
        )}
        <div className="radio-now-info">
          <div className="radio-now-title">{data.title}</div>
          <div className="radio-now-artist">{data.artist || "Unknown artist"}</div>
          {data.duration > 0 && (
            <div className="radio-now-progress">
              <div className="radio-now-progress-bar" style={{ width: `${progress}%` }} />
            </div>
          )}
          {data.nextSong && (
            <div className="radio-next">
              <span className="radio-next-label">Next up</span>
              <span className="radio-next-title">{data.nextSong}</span>
            </div>
          )}
        </div>
      </div>

      {data.artist && (
        <div className="radio-now-actions">
          <Link
            href={`/stream/${data.artist.toLowerCase().replace(/\s+/g, "")}`}
            className="btn btn-sm"
          >
            View artist
          </Link>
          <Link href="/tracks" className="btn btn-sm">
            Find on Tracks
          </Link>
          <Link href="/records" className="btn btn-sm">
            GRID Records
          </Link>
        </div>
      )}
    </div>
  );
}
