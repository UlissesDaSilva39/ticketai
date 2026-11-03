"use client";
import { useStudio } from "./StudioContext";
import MixerChannel from "./MixerChannel";

export default function Mixer() {
  const { project, getAnalyser, selectedTrackId, setSelectedTrackId, mixerView, setMixerView } = useStudio() as any;

  return (
    <div className="studio-mixer">
      <div className="studio-mixer-header">
        <span className="studio-mixer-title">MIXER</span>
        <div className="studio-mixer-controls">
          <button
            className={`studio-mixer-toggle ${mixerView === "strip" ? "active" : ""}`}
            onClick={() => setMixerView("strip")}
          >Strip</button>
          <button
            className={`studio-mixer-toggle ${mixerView === "wide" ? "active" : ""}`}
            onClick={() => setMixerView("wide")}
          >Wide</button>
        </div>
      </div>
      <div className="studio-mixer-strips">
        {project.tracks.map((t: any) => (
          <MixerChannel
            key={t.id}
            track={t}
            selected={selectedTrackId === t.id}
            onSelect={() => setSelectedTrackId(t.id)}
            analyser={getAnalyser?.(t.id)}
          />
        ))}
        <div className="studio-mixer-master">
          <MixerChannel
            track={{
              id: "master",
              name: "MASTER",
              color: "#00d4ff",
              volume: project.masterVolume,
              pan: 0,
              muted: false,
              soloed: false,
              type: "audio",
              plugins: [],
              clips: [],
              notes: [],
            }}
            selected={false}
            onSelect={() => {}}
            analyser={undefined}
            isMaster={true}
          />
        </div>
      </div>
    </div>
  );
}

