"use client";
import { StudioProvider, useStudio } from "@/components/studio/StudioContext";
import Transport from "@/components/studio/Transport";
import TrackList from "@/components/studio/TrackList";
import Timeline from "@/components/studio/Timeline";
import Mixer from "@/components/studio/Mixer";
import MixView from "@/components/studio/MixView";
import PluginPanel from "@/components/studio/PluginPanel";
import UploadBar from "@/components/studio/UploadBar";
import InstrumentsBar from "@/components/studio/InstrumentsBar";
import ToolPalette from "@/components/studio/ToolPalette";
import ShortcutsOverlay from "@/components/studio/ShortcutsOverlay";
import "@/app/styles/studio.css";

function StudioShell() {
  const {
    project, setProjectName, exportWav, save, view, setView,
    undo, redo, canUndo, canRedo, clipboard,
  } = useStudio() as any;

  return (
    <div className="studio-shell">
      <header className="studio-topbar">
        <span className="studio-brand">GRID STUDIO</span>
        <input
          className="studio-project-name"
          value={project.name}
          onChange={e => setProjectName(e.target.value)}
          placeholder="Untitled Project"
        />
        <div className="studio-view-toggle">
          <button className={view === "edit" ? "active" : ""} onClick={() => setView("edit")}>Edit</button>
          <button className={view === "mix" ? "active" : ""} onClick={() => setView("mix")}>Mix</button>
        </div>
        <div className="studio-spacer" />
        <button className="studio-btn" onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">↶</button>
        <button className="studio-btn" onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)">↷</button>
        {clipboard && (
          <div className="studio-clipboard-badge" title="Clipboard">📋 {clipboard.name}</div>
        )}
        <UploadBar />
        <InstrumentsBar />
        <button className="studio-btn primary" onClick={save}>Save</button>
        <button className="studio-btn" onClick={exportWav}>Export WAV</button>
      </header>
      <Transport />
      <ToolPalette />
      {view === "edit" ? (
        <div className="studio-main">
          <div className="studio-left"><TrackList /></div>
          <div className="studio-center"><Timeline /><Mixer /></div>
          <div className="studio-right"><PluginPanel /></div>
        </div>
      ) : (
        <MixView />
      )}
      <ShortcutsOverlay />
    </div>
  );
}

export default function StudioPage() {
  return (
    <StudioProvider>
      <StudioShell />
    </StudioProvider>
  );
}

