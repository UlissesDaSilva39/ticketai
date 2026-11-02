"use client";
import { useRef } from "react";
import { useStudio } from "./StudioContext";

export default function UploadBar() {
  const { importAudioToTrack, importAudioAuto, uploadProgress, uploadError, clearUploadError, selectedTrackId } = useStudio() as any;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("audio/") && !/\.(mp3|wav|m4a|ogg|flac|aac|opus|webm)$/i.test(file.name)) {
        alert(`Unsupported file: ${file.name}`);
        continue;
      }
      if (selectedTrackId) {
        await importAudioToTrack(selectedTrackId, file);
      } else {
        await importAudioAuto(file);
      }
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.m4a,.ogg,.flac,.aac,.opus"
        multiple
        style={{ display: "none" }}
        onChange={e => handleFiles(e.target.files)}
      />
      <button
        className="studio-btn import-btn"
        onClick={() => fileInputRef.current?.click()}
        title="Import audio files"
      >
        + Import audio
      </button>

      {uploadProgress && (
        <div className="studio-upload-toast">
          <span className="studio-upload-name">{uploadProgress.name}</span>
          <div className="studio-upload-bar">
            <div className="studio-upload-fill" style={{ width: `${uploadProgress.pct}%` }} />
          </div>
          <span className="studio-upload-pct">{uploadProgress.pct}%</span>
        </div>
      )}

      {uploadError && (
        <div className="studio-upload-error" onClick={clearUploadError}>
          <span>⚠ {uploadError}</span>
          <button className="studio-upload-error-close">×</button>
        </div>
      )}
    </>
  );
}
