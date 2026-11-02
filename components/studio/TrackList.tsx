"use client";
import { useRef } from "react";
import { useStudio } from "./StudioContext";
import { TRACK_COLORS } from "@/lib/studio";

export default function TrackList() {
  const { project, addTrack, selectedTrackId, setSelectedTrackId, renameTrack, deleteTrack, importAudioToTrack } = useStudio() as any;
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  return (
    <div className="studio-tracks">
      <div className="studio-tracks-header">TRACKS</div>
      {project.tracks.map((t: any) => (
        <div
          key={t.id}
          className={`studio-track-row ${selectedTrackId === t.id ? "selected" : ""}`}
          onClick={() => setSelectedTrackId(t.id)}
        >
          <span className="studio-track-color" style={{ background: t.color }} />
          <input
            className="studio-track-name"
            value={t.name}
            onChange={e => renameTrack(t.id, e.target.value)}
            onClick={e => e.stopPropagation()}
          />
          <input
            ref={el => { fileInputs.current[t.id] = el; }}
            type="file"
            accept="audio/*,.mp3,.wav,.m4a,.ogg,.flac,.aac"
            style={{ display: "none" }}
            onChange={async e => {
              const file = e.target.files?.[0];
              if (file) await importAudioToTrack(t.id, file);
              e.target.value = "";
            }}
          />
          <button
            className="studio-icon-btn upload"
            onClick={e => { e.stopPropagation(); fileInputs.current[t.id]?.click(); }}
            title="Upload audio to this track"
          >↑</button>
          <button
            className="studio-icon-btn"
            onClick={e => { e.stopPropagation(); deleteTrack(t.id); }}
            title="Delete track"
          >×</button>
        </div>
      ))}
      <button
        className="studio-add-track"
        onClick={() => addTrack(`Track ${project.tracks.length + 1}`, TRACK_COLORS[project.tracks.length % TRACK_COLORS.length])}
      >
        + Add track
      </button>
    </div>
  );
}
