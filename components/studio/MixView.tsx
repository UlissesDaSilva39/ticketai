"use client";
import { useStudio } from "./StudioContext";
import MixerChannel from "./MixerChannel";

export default function MixView() {
  const { project, getAnalyser, selectedTrackId, setSelectedTrackId } = useStudio() as any;

  return (
    <div className="studio-mix-view">
      <div className="studio-mix-strips">
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

