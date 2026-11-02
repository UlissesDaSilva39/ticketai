"use client";
import { useEffect, useRef, useState } from "react";
import { StudioTrack } from "@/lib/studio";

export default function MixerStrip({
  track,
  selected,
  onSelect,
  onVolume,
  onPan,
  onMute,
  onSolo,
  analyser,
}: {
  track: StudioTrack;
  selected: boolean;
  onSelect: () => void;
  onVolume: (v: number) => void;
  onPan: (v: number) => void;
  onMute: () => void;
  onSolo: () => void;
  analyser?: AnalyserNode;
}) {
  const [level, setLevel] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    if (!analyser) return;
    const buf = new Float32Array(analyser.fftSize);
    const tick = () => {
      analyser.getFloatTimeDomainData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
      const rms = Math.sqrt(sum / buf.length);
      const db = 20 * Math.log10(rms + 1e-9);
      const pct = Math.max(0, Math.min(1, (db + 60) / 60));
      setLevel(prev => Math.max(pct, prev * 0.95));
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [analyser]);

  return (
    <div className={`studio-strip ${selected ? "selected" : ""}`} onClick={onSelect}>
      <div className="studio-strip-name">{track.name}</div>
      <div className="studio-strip-meter">
        <div className="studio-strip-meter-fill" style={{ height: `${level * 100}%` }} />
      </div>
      <input
        type="range" min={0} max={1} step={0.01} value={track.volume}
        className="studio-strip-fader"
        onChange={e => onVolume(Number(e.target.value))}
        title={`Volume ${Math.round(track.volume * 100)}`}
      />
      <div className="studio-strip-pan">
        <input
          type="range" min={-1} max={1} step={0.01} value={track.pan}
          onChange={e => onPan(Number(e.target.value))}
          title={`Pan ${track.pan > 0 ? "R" : track.pan < 0 ? "L" : "C"}`}
        />
      </div>
      <div className="studio-strip-buttons">
        <button className={`studio-strip-btn ${track.muted ? "mute-on" : ""}`} onClick={onMute}>M</button>
        <button className={`studio-strip-btn ${track.soloed ? "solo-on" : ""}`} onClick={onSolo}>S</button>
      </div>
      <div className="studio-strip-inserts">
        {track.plugins.map(p => (
          <span key={p.id} className="studio-strip-insert">{p.type.slice(0, 3).toUpperCase()}</span>
        ))}
      </div>
    </div>
  );
}
