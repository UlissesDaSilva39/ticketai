"use client";
import { useEffect, useRef, useState, MouseEvent } from "react";
import { useStudio } from "./StudioContext";
import WaveformCanvas from "./WaveformCanvas";
import { snapTime } from "@/lib/studio";

const LANE_H = 64;

export default function Timeline() {
  const {
    project, position, zoom, snap, tool,
    selectedTrackId, setSelectedTrackId,
    selectedClipId, setSelectedClipId, selectedClipIds, toggleClipSelection, clearSelection,
    importAudioToTrack, deleteClip, moveClip, trimClip, splitClip,
    copyClip, cutClip, pasteClip, duplicateClip,
    setLoop,
  } = useStudio() as any;

  const wrapRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; trackId: string; clipId: string } | null>(null);
  const [loopDrag, setLoopDrag] = useState<{ start: number } | null>(null);
  const [selectBox, setSelectBox] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const [dragging, setDragging] = useState<{ trackId: string; clipId: string; mode: "move" | "trim-l" | "trim-r"; startX: number; origStart: number; origDur: number; origOffset: number } | null>(null);

  useEffect(() => {
    if (!wrapRef.current) return;
    wrapRef.current.scrollLeft = Math.max(0, position * zoom - 200);
  }, [position, zoom]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      const dx = (e.clientX - dragging.startX) / zoom;
      if (dragging.mode === "move") {
        moveClip(dragging.trackId, dragging.clipId, Math.max(0, dragging.origStart + dx));
      } else if (dragging.mode === "trim-r") {
        trimClip(dragging.trackId, dragging.clipId, Math.max(0.05, dragging.origDur + dx), dragging.origOffset);
      } else if (dragging.mode === "trim-l") {
        const newStart = Math.max(0, dragging.origStart + dx);
        const delta = newStart - dragging.origStart;
        trimClip(dragging.trackId, dragging.clipId, Math.max(0.05, dragging.origDur - delta), Math.max(0, dragging.origOffset + delta));
      }
    };
    const onUp = () => setDragging(null);
    window.addEventListener("mousemove", onMove as any);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove as any);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, zoom, moveClip, trimClip]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      const mod = e.ctrlKey || e.metaKey;
      const findClip = () => project.tracks.flatMap((t: any) =>
        t.clips.filter((c: any) => c.id === selectedClipId).map((c: any) => ({ t, c }))
      )[0];

      if (mod && e.key.toLowerCase() === "c") { const f = findClip(); if (f) { e.preventDefault(); copyClip(f.t.id, f.c.id); } }
      if (mod && e.key.toLowerCase() === "x") { const f = findClip(); if (f) { e.preventDefault(); cutClip(f.t.id, f.c.id); } }
      if (mod && e.key.toLowerCase() === "v") { e.preventDefault(); pasteClip(position); }
      if (mod && e.key.toLowerCase() === "d") { const f = findClip(); if (f) { e.preventDefault(); duplicateClip(f.t.id, f.c.id); } }
      if (e.key === "Delete" || e.key === "Backspace") {
        const f = findClip();
        if (f) { e.preventDefault(); deleteClip(f.t.id, f.c.id); }
      }
      if (e.key.toLowerCase() === "s" && !mod && selectedClipId) {
        const f = findClip();
        if (f && position > f.c.start && position < f.c.start + f.c.duration) {
          e.preventDefault();
          splitClip(f.t.id, f.c.id, position);
        }
      }
      if (e.key === "Escape") { setCtxMenu(null); clearSelection(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedClipId, project, position, copyClip, cutClip, pasteClip, duplicateClip, deleteClip, splitClip, clearSelection]);

  useEffect(() => {
    if (!ctxMenu) return;
    const close = () => setCtxMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [ctxMenu]);

  const onRulerMouseDown = (e: MouseEvent) => {
    const rect = timelineRef.current?.getBoundingClientRect();
    if (!rect) return;
    const t = Math.max(0, (e.clientX - rect.left) / zoom);
    setLoopDrag({ start: snapTime(t, project.bpm, snap) });
  };
  useEffect(() => {
    if (!loopDrag) return;
    const onMove = (e: MouseEvent) => {
      const rect = timelineRef.current?.getBoundingClientRect();
      if (!rect) return;
      const t = Math.max(0, (e.clientX - rect.left) / zoom);
      setLoop(loopDrag.start, snapTime(t, project.bpm, snap));
    };
    const onUp = () => setLoopDrag(null);
    window.addEventListener("mousemove", onMove as any);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove as any);
      window.removeEventListener("mouseup", onUp);
    };
  }, [loopDrag, zoom, snap, project.bpm, setLoop]);

  const startDrag = (e: MouseEvent, trackId: string, clip: any, mode: "move" | "trim-l" | "trim-r") => {
    if (tool === "trim") return;
    e.stopPropagation();
    setDragging({ trackId, clipId: clip.id, mode, startX: e.clientX, origStart: clip.start, origDur: clip.duration, origOffset: clip.offset });
  };

  return (
    <div className="studio-timeline-wrap" ref={wrapRef}>
      <div className="studio-timeline" ref={timelineRef} style={{ width: project.duration * zoom }}>
        <div className="studio-ruler" onMouseDown={onRulerMouseDown}>
          {Array.from({ length: Math.ceil(project.duration) }).map((_, i) => (
            <div key={i} className="studio-ruler-tick" style={{ left: i * zoom }}>{i}s</div>
          ))}
          {project.loopEnabled && project.loopEnd > project.loopStart && (
            <div
              className="studio-loop-region"
              style={{ left: project.loopStart * zoom, width: (project.loopEnd - project.loopStart) * zoom }}
            />
          )}
        </div>
        <div className="studio-playhead" style={{ left: position * zoom }} />
        {project.tracks.map((t: any) => (
          <div
            key={t.id}
            className={`studio-lane ${selectedTrackId === t.id ? "selected" : ""} ${dragOver === t.id ? "dragover" : ""}`}
            style={{ height: LANE_H }}
            onClick={() => { setSelectedTrackId(t.id); }}
            onDragOver={e => { e.preventDefault(); setDragOver(t.id); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={async e => {
              e.preventDefault(); setDragOver(null);
              const file = e.dataTransfer.files?.[0];
              if (!file) return;
              if (!file.type.startsWith("audio/") && !/\.(mp3|wav|m4a|ogg|flac|aac)$/i.test(file.name)) {
                alert(`Unsupported: ${file.name}`); return;
              }
              await importAudioToTrack(t.id, file);
            }}
          >
            {t.clips.map((c: any) => {
              const isSelected = selectedClipIds.has(c.id) || selectedClipId === c.id;
              return (
                <div
                  key={c.id}
                  className={`studio-clip ${isSelected ? "selected" : ""}`}
                  style={{
                    left: c.start * zoom,
                    width: c.duration * zoom,
                    background: t.color,
                  }}
                  onClick={e => { e.stopPropagation(); toggleClipSelection(c.id, e.shiftKey); setSelectedTrackId(t.id); }}
                  onContextMenu={e => {
                    e.preventDefault(); e.stopPropagation();
                    setSelectedClipId(c.id);
                    setCtxMenu({ x: e.clientX, y: e.clientY, trackId: t.id, clipId: c.id });
                  }}
                  onMouseDown={e => startDrag(e, t.id, c, "move")}
                >
                  {c.buffer && (
                    <WaveformCanvas buffer={c.buffer} width={Math.max(1, c.duration * zoom)} height={LANE_H - 20} color="rgba(255,255,255,.7)" />
                  )}
                  <span className="studio-clip-label">{c.name}</span>
                  <div
                    className="studio-clip-handle left"
                    onMouseDown={e => { e.stopPropagation(); startDrag(e, t.id, c, "trim-l"); }}
                  />
                  <div
                    className="studio-clip-handle right"
                    onMouseDown={e => { e.stopPropagation(); startDrag(e, t.id, c, "trim-r"); }}
                  />
                </div>
              );
            })}
            {t.clips.length === 0 && (
              <div className="studio-lane-empty">Drag audio here · or paste (Ctrl+V)</div>
            )}
          </div>
        ))}
      </div>

      {ctxMenu && (
        <div className="studio-ctx-menu" style={{ top: ctxMenu.y, left: ctxMenu.x }} onClick={e => e.stopPropagation()}>
          <button onClick={() => { copyClip(ctxMenu.trackId, ctxMenu.clipId); setCtxMenu(null); }}>Copy <span>Ctrl+C</span></button>
          <button onClick={() => { cutClip(ctxMenu.trackId, ctxMenu.clipId); setCtxMenu(null); }}>Cut <span>Ctrl+X</span></button>
          <button onClick={() => { pasteClip(position); setCtxMenu(null); }}>Paste <span>Ctrl+V</span></button>
          <button onClick={() => { duplicateClip(ctxMenu.trackId, ctxMenu.clipId); setCtxMenu(null); }}>Duplicate <span>Ctrl+D</span></button>
          <div className="studio-ctx-sep" />
          <button onClick={() => { splitClip(ctxMenu.trackId, ctxMenu.clipId, position); setCtxMenu(null); }}>Split <span>S</span></button>
          <div className="studio-ctx-sep" />
          <button className="danger" onClick={() => { deleteClip(ctxMenu.trackId, ctxMenu.clipId); setCtxMenu(null); }}>Delete <span>Del</span></button>
        </div>
      )}
    </div>
  );
}

