"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getSmartLink, trackClick, SmartLink } from "@/lib/smartLinks";
import { PLATFORMS, PLATFORM_ORDER, detectPreferredPlatform } from "@/lib/platforms";

export default function SmartLinkPage() {
  const params = useParams();
  const id = params?.id as string;
  const [link, setLink] = useState<SmartLink | null>(null);
  const [preferred, setPreferred] = useState<any>("spotify");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) setLink(getSmartLink(id));
    setPreferred(detectPreferredPlatform());
  }, [id]);

  if (!link) return <div className="meta-page meta-container" style={{ padding: 48 }}>Link not found.</div>;

  const handlePlatformClick = (platform: any) => {
    trackClick(link.id, platform);
    const url = link.platforms[platform];
    if (url) window.open(url, "_blank");
  };

  const copyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const platformsToShow = PLATFORM_ORDER.filter(p => link.platforms[p]);

  return (
    <div className="meta-page">
      <div className="meta-container" style={{ maxWidth: 520, padding: "48px 24px" }}>
        <div className="smart-card">
          <div className="smart-cover" style={{ background: link.coverColor }}>
            <div className="smart-cover-title">{link.title}</div>
            <div className="smart-cover-artist">{link.artistName}</div>
          </div>
          <h1 className="smart-title">{link.title}</h1>
          <p className="smart-artist">{link.artistName}</p>

          <div className="smart-platforms">
            {platformsToShow.map(p => {
              const meta = PLATFORMS[p];
              const isPreferred = p === preferred;
              return (
                <button
                  key={p}
                  className={"smart-platform-btn" + (isPreferred ? " preferred" : "")}
                  onClick={() => handlePlatformClick(p)}
                  style={{ borderColor: meta.color }}
                >
                  <span className="smart-platform-dot" style={{ background: meta.color }} />
                  <span className="smart-platform-name">
                    {meta.name}
                    {isPreferred && <span className="smart-recommended"> · recommended</span>}
                  </span>
                  <span className="smart-arrow">→</span>
                </button>
              );
            })}
          </div>

          {(link.grdcTrackId || link.grdcStreamId) && (
            <div className="smart-grid-actions">
              {link.grdcTrackId && (
                <Link href={`/tracks/${link.grdcTrackId}`} className="btn btn-primary">
                  Buy on GRID Tracks
                </Link>
              )}
              {link.grdcStreamId && (
                <Link href={`/stream/watch/${link.grdcStreamId}`} className="btn">
                  Watch on GRID Stream
                </Link>
              )}
            </div>
          )}

          <button className="smart-copy" onClick={copyLink}>
            {copied ? "Copied!" : "Copy link"}
          </button>

          <div className="smart-clicks">
            <div className="smart-clicks-title">Click breakdown</div>
            {platformsToShow.map(p => (
              <div key={p} className="smart-click-row">
                <span>{PLATFORMS[p].name}</span>
                <span>{link.clicks[p] ?? 0} clicks</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
