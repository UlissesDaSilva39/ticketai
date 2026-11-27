"use client";

import { useEffect, useRef, useState } from "react";

/** Stream snapshot that removes itself if YouTube/Twitch has no frame, revealing the fallback underneath. */
export default function LiveThumb({ src, className = "" }: { src: string | null; className?: string }) {
  const [ok, setOk] = useState(true);
  const ref = useRef<HTMLImageElement>(null);
  // The image can fail before React attaches onError (server-rendered), so check once on mount too.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setOk(false);
  }, []);
  if (!src || !ok) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={ref} src={src} alt="" loading="lazy" onError={() => setOk(false)} className={`absolute inset-0 w-full h-full object-cover ${className}`} />;
}
