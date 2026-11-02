"use client";
import { useStudio } from "./StudioContext";

export default function Mixer() {
  const { project, setVolume, setPan, toggleMute, toggleSolo, selectedTrackId, setSelectedTrackId } = useStudio();
  return (
    <div className="studio-mixer">
      <div className="studio-mixer-title">MIXER</div>
      <div className="studio-faders">
        {project.tracks.map(t => (
          <div
            key={t.id}
            className={`studio-fader ${selectedTrackId === t.id ? "selected" : ""}`}
            onClick={() => setSelectedTrackId(t.id)}
          >
            <div className="studio-fader-value">{Math.round(t.volume * 100)}</div>
            <input
              type="range" min={0} max={1} step={0.01} value={t.volume}
              className="studio-fader-slider"
              onChange={e => setVolume(t.id, Number(e.target.value))}
            />
            <input
              type="range" min={-1} max={1} step={0.01} value={t.pan}
              className="studio-pan-slider"
              onChange={e => setPan(t.id, Number(e.target.value))}
              title={`Pan ${t.pan > 0 ? "R" : t.pan < 0 ? "L" : "C"}`}
            />
            <div className="studio-fader-label">{t.name}</div>
            <div className="studio-fader-buttons">
              <button className={`studio-ms ${t.muted ? "on" : ""}`} onClick={() => toggleMute(t.id)}>M</button>
              <button className={`studio-ms ${t.soloed ? "on" : ""}`} onClick={() => toggleSolo(t.id)}>S</button>
            </div>
          </div>
        ))}
        <div className="studio-fader master">
          <div className="studio-fader-label">MASTER</div>
          <div className="studio-fader-value">80</div>
        </div>
      </div>
    </div>
  );
}

