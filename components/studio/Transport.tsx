"use client";
import { useStudio } from "./StudioContext";

function fmt(t: number) {
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = Math.floor(t % 60);
  const ms = Math.floor((t % 1) * 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
}

export default function Transport() {
  const { playing, position, play, stop, record, isRecording, bpm, setBpm, metronome, setMetronome } = useStudio();
  return (
    <div className="studio-transport">
      <button className="studio-btn" onClick={() => { stop(); play(0); }} title="Play from start">⏮</button>
      <button className="studio-btn" onClick={() => play(position)} title="Play">▶</button>
      <button className="studio-btn" onClick={stop} title="Stop">⏹</button>
      <button className={`studio-btn ${isRecording ? "rec-active" : ""}`} onClick={record} title="Record">⏺</button>
      <div className="studio-time">{fmt(position)}</div>
      <label className="studio-field">BPM
        <input type="number" min={40} max={240} value={bpm} onChange={e => setBpm(Number(e.target.value))} />
      </label>
      <span className="studio-signature">4/4</span>
      <label className="studio-checkbox">
        <input type="checkbox" checked={metronome} onChange={e => setMetronome(e.target.checked)} /> Metronome
      </label>
      <div className="studio-spacer" />
      <span className={`studio-status ${playing ? "playing" : ""}`}>{playing ? "Playing" : "Stopped"}</span>
    </div>
  );
}

