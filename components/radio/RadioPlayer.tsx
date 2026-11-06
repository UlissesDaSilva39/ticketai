"use client";
import { useEffect, useRef, useState } from "react";
import { RadioStation } from "@/lib/radio";

export default function RadioPlayer({ station }: { station: RadioStation }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;
    }
  }, [volume, muted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(err => {
        console.error("Play failed:", err);
      });
    }
  };

  return (
    <div className="radio-player">
      <audio ref={audioRef} src={station.streamUrl} preload="none" />

      <div className="radio-player-controls">
        <button
          className={"radio-play-btn" + (playing ? " playing" : "")}
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? "II" : ">"}
        </button>

        <div className="radio-player-info">
          <div className="radio-player-station">{station.name}</div>
          <div className="radio-player-desc">{station.description}</div>
        </div>

        <div className="radio-player-volume">
          <button
            className="radio-volume-btn"
            onClick={() => setMuted(!muted)}
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? "M" : "V"}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={e => setVolume(Number(e.target.value))}
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}
