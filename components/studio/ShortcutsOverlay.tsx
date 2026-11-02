"use client";
import { useState, useEffect } from "react";

const SHORTCUTS = [
  { section: "Transport", items: [
    ["Space", "Play / Pause"],
    ["Enter", "Stop"],
    ["R", "Record"],
  ]},
  { section: "Editing", items: [
    ["Ctrl+C", "Copy clip"],
    ["Ctrl+X", "Cut clip"],
    ["Ctrl+V", "Paste"],
    ["Ctrl+D", "Duplicate"],
    ["Del", "Delete"],
    ["S", "Split at playhead"],
    ["Ctrl+Z", "Undo"],
    ["Ctrl+Shift+Z", "Redo"],
  ]},
  { section: "View", items: [
    ["V", "Select tool"],
    ["T", "Trim tool"],
    ["Z", "Zoom tool"],
    ["Ctrl+Wheel", "Zoom timeline"],
    ["?", "This overlay"],
  ]},
  { section: "Track", items: [
    ["Ctrl+Shift+D", "Duplicate track"],
    ["M", "Mute selected"],
    ["Alt+S", "Solo selected"],
  ]},
];

export default function ShortcutsOverlay() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "?") { e.preventDefault(); setOpen(o => !o); }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return (
    <button className="studio-shortcuts-btn" onClick={() => setOpen(true)} title="Keyboard shortcuts (?)">?</button>
  );

  return (
    <>
      <div className="studio-shortcuts-backdrop" onClick={() => setOpen(false)} />
      <div className="studio-shortcuts-panel">
        <div className="studio-shortcuts-header">
          <span>KEYBOARD SHORTCUTS</span>
          <button onClick={() => setOpen(false)}>×</button>
        </div>
        <div className="studio-shortcuts-body">
          {SHORTCUTS.map(s => (
            <div key={s.section} className="studio-shortcuts-section">
              <div className="studio-shortcuts-section-label">{s.section}</div>
              {s.items.map(([k, v]) => (
                <div key={k} className="studio-shortcut-row">
                  <kbd>{k}</kbd>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

