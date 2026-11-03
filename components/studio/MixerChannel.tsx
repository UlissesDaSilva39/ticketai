"use client";
import { useStudio } from "./StudioContext";
import Meter from "./Meter";
import {
  StudioTrack, gainToDb, formatDb, dbToFader, faderToDb,
  PLUGIN_METADATA, PluginType, dbToGain,
} from "@/lib/studio";

export default function MixerChannel({
  track, selected, onSelect, analyser, isMaster = false,
}: {
  track: StudioTrack;
  selected: boolean;
  onSelect: () => void;
  analyser?: AnalyserNode;
  isMaster?: boolean;
}) {
  const {
    setVolume, setPan, toggleMute, toggleSolo, togglePhase, toggleMono,
    setSelectedTrackId,
  } = useStudio() as any;

  const db = gainToDb(track.volume);
  const faderPos = dbToFader(db);

  const handleFaderChange = (pos: number) => {
    const newDb = faderToDb(pos);
    setVolume(track.id, dbToGain(newDb));
  };

  const hasPlugins = track.plugins.length > 0;

  return (
    <div className={`studio-channel ${selected ? "selected" : ""}`} onClick={onSelect}>
      <div className="studio-channel-color" style={{ background: track.color }} />

      <div className="studio-channel-name" title={track.name}>{track.name}</div>

      <div className="studio-channel-inserts">
        {track.plugins.slice(0, 4).map(p => {
          const meta = PLUGIN_METADATA[p.type as PluginType];
          if (!meta) return null;
          return (
            <button
              key={p.id}
              className={`studio-channel-insert ${p.enabled ? "" : "bypassed"}`}
              style={{ borderLeftColor: meta.color }}
              title={`${meta.label} ${p.enabled ? "ON" : "OFF"}`}
              onClick={e => { e.stopPropagation(); setSelectedTrackId(track.id); }}
            >
              {meta.label.slice(0, 4).toUpperCase()}
            </button>
          );
        })}
        {track.plugins.length > 4 && (
          <div className="studio-channel-insert more">+{track.plugins.length - 4}</div>
        )}
        {!hasPlugins && <div className="studio-channel-insert empty">+</div>}
      </div>

      <div className="studio-channel-meter-row">
        <Meter analyser={analyser} height={120} width={18} />
      </div>

      <div className="studio-channel-db">{formatDb(db)}<small>dB</small></div>

      <div className="studio-channel-fader-wrap">
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={faderPos}
          onChange={e => handleFaderChange(Number(e.target.value))}
          className="studio-channel-fader"
          title={`Volume ${formatDb(db)} dB`}
          onClick={e => e.stopPropagation()}
          style={{ accentColor: track.color }}
        />
        <div className="studio-channel-unity" style={{ bottom: `${dbToFader(0) * 100}%` }} />
      </div>

      <div className="studio-channel-pan-row">
        <input
          type="range"
          min={-1}
          max={1}
          step={0.01}
          value={track.pan}
          onChange={e => setPan(track.id, Number(e.target.value))}
          className="studio-channel-pan"
          onClick={e => e.stopPropagation()}
        />
        <div className="studio-channel-pan-labels">
          <span>L</span><span>C</span><span>R</span>
        </div>
      </div>

      <div className="studio-channel-buttons">
        <button
          className={`studio-channel-btn mute ${track.muted ? "active" : ""}`}
          onClick={e => { e.stopPropagation(); toggleMute(track.id); }}
          title="Mute"
        >M</button>
        <button
          className={`studio-channel-btn solo ${track.soloed ? "active" : ""}`}
          onClick={e => { e.stopPropagation(); toggleSolo(track.id); }}
          title="Solo"
        >S</button>
      </div>
      {!isMaster && (
        <div className="studio-channel-buttons secondary">
          <button
            className={`studio-channel-btn phase ${(track as any).phaseInverted ? "active" : ""}`}
            onClick={e => { e.stopPropagation(); togglePhase(track.id); }}
            title="Phase invert"
          >∅</button>
          <button
            className={`studio-channel-btn mono ${(track as any).mono ? "active" : ""}`}
            onClick={e => { e.stopPropagation(); toggleMono(track.id); }}
            title="Mono"
          >◐</button>
        </div>
      )}
    </div>
  );
}

