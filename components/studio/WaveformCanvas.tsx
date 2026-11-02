"use client";
import { useEffect, useRef } from "react";

export default function WaveformCanvas({
  buffer, width, height, color = "#fff",
}: { buffer: AudioBuffer; width: number; height: number; color?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !buffer) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const data = buffer.getChannelData(0);
    const step = Math.max(1, Math.floor(data.length / width));
    ctx.fillStyle = color;
    const mid = height / 2;
    for (let x = 0; x < width; x++) {
      let min = 1, max = -1;
      for (let i = 0; i < step; i++) {
        const v = data[x * step + i] ?? 0;
        if (v < min) min = v;
        if (v > max) max = v;
      }
      const y1 = mid - max * mid * 0.9;
      const y2 = mid - min * mid * 0.9;
      ctx.fillRect(x, y1, 1, Math.max(1, y2 - y1));
    }
  }, [buffer, width, height, color]);

  return (
    <canvas
      ref={ref}
      style={{ width: `${width}px`, height: `${height}px`, display: "block" }}
    />
  );
}

