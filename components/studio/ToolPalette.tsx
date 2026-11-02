"use client";
import { useStudio } from "./StudioContext";
import { StudioTool, GridSnap } from "@/lib/studio";

const TOOLS: { id: StudioTool; label: string; icon: string; key: string }[] = [
  { id: "select", label: "Select", icon: "↖", key: "V" },
  { id: "split",  label: "Split",  icon: "✂", key: "S" },
  { id: "trim",   label: "Trim",   icon: "⬌", key: "T" },
  { id: "zoom",   label: "Zoom",   icon: "🔍", key: "Z" },
];

const SNAPS: GridSnap[] = ["off", "1/4", "1/8", "1/16", "1bar"];

export default function ToolPalette() {
  const { tool, setTool, snap, setSnap, zoom, setZoom } = useStudio();
  return (
    <div className="studio-tool-palette">
      {TOOLS.map(t => (
        <button
          key={t.id}
          className={"studio-tool-btn" + (tool === t.id ? " active" : "")}
          onClick={() => setTool(t.id)}
          title={`${t.label} (${t.key})`}
        >
          <span>{t.icon}</span>
          <small>{t.label}</small>
        </button>
      ))}
      <div className="studio-tool-sep" />
      <label className="studio-snap-select">
        <span>Snap</span>
        <select value={snap} onChange={e => setSnap(e.target.value as GridSnap)}>
          {SNAPS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>
      <div className="studio-tool-sep" />
      <label className="studio-zoom-label">
        <span>Zoom</span>
        <input
          type="range" min={20} max={300} step={10} value={zoom}
          onChange={e => setZoom(Number(e.target.value))}
        />
        <em>{Math.round(zoom)}px/s</em>
      </label>
    </div>
  );
}

