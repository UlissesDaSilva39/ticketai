"use client";

import { useState } from "react";

// Deterministic hash → hue
function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

type Props = {
  coverImage?: string | null;
  slug: string;
  name: string;
  className?: string;
  height?: string; // e.g. "h-48", "h-64"
};

export default function ArtistCoverBanner({
  coverImage,
  slug,
  name,
  className = "",
  height = "h-48",
}: Props) {
  const [imgFailed, setImgFailed] = useState(false);

  const h1 = hashCode(slug) % 360;
  const h2 = (hashCode(slug) * 47) % 360;
  const gradient = `linear-gradient(135deg, hsl(${h1} 70% 45%), hsl(${h2} 70% 25%))`;

  const showImage = coverImage && !imgFailed;

  return (
    <div
      className={`relative w-full overflow-hidden ${height} ${className}`}
      style={{ background: gradient }}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverImage}
          alt={`${name} cover`}
          className="h-full w-full object-cover"
          onError={() => setImgFailed(true)}
        />
      ) : (
        // Fallback: large initial + subtle pattern
        <div className="flex h-full w-full items-center justify-center">
          <span
            className="select-none font-black tracking-tighter text-white/20"
            style={{ fontSize: "clamp(4rem, 12vw, 10rem)" }}
          >
            {name.slice(0, 1).toUpperCase()}
          </span>
        </div>
      )}

      {/* Bottom fade for legibility of overlaid content */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    </div>
  );
}
