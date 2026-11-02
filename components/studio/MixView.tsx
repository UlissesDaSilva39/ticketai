"use client";
import { useStudio } from "./StudioContext";
import MixerStrip from "./MixerStrip";

export default function MixView() {
  const { project, selectedTrackId, setSelectedTrackId, setVolume, setPan, toggleMute, toggleSolo, getAnalyser } = useStudio() as any;
  return (
    <div className="studio-mix-view">
      <div className="studio-mix-strips">
        {project.tracks.map((t: any) => (
          <MixerStrip
            key={t.id}
            track={t}
            selected={selectedTrackId === t.id}
            onSelect={() => setSelectedTrackId(t.id)}
            onVolume={v => setVolume(t.id, v)}
            onPan={v => setPan(t.id, v)}
            onMute={() => toggleMute(t.id)}
            onSolo={() => toggleSolo(t.id)}
            analyser={getAnalyser?.(t.id)}
          />
        ))}
        <div className="studio-strip master">
          <div className="studio-strip-name">MASTER</div>
          <div className="studio-strip-meter">
            <div className="studio-strip-meter-fill" style={{ height: "40%" }} />
          </div>
          <input type="range" min={0} max={1} step={0.01} defaultValue={0.8} className="studio-strip-fader" />
        </div>
      </div>
    </div>
  );
}
