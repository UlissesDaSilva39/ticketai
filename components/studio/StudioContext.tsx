"use client";
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { engine, StudioEngine } from "@/lib/audioEngine";
import {
  createProject, createTrack, createPlugin, snapTime,
  StudioProject, PluginType, StudioTrack, StudioClip,
  StudioTool, StudioView, GridSnap, TRACK_COLORS,
} from "@/lib/studio";
import { history } from "@/lib/history";
import { saveProject, loadProject, getActiveProjectId } from "@/lib/projectStore";

type Ctx = {
  project: StudioProject;
  setProjectName: (n: string) => void;
  playing: boolean;
  position: number;
  bpm: number;
  setBpm: (n: number) => void;
  metronome: boolean;
  setMetronome: (b: boolean) => void;
  isRecording: boolean;
  record: () => Promise<void>;
  play: (from: number) => void;
  stop: () => void;

  view: StudioView;
  setView: (v: StudioView) => void;
  tool: StudioTool;
  setTool: (t: StudioTool) => void;
  zoom: number;
  setZoom: (z: number) => void;
  snap: GridSnap;
  setSnap: (s: GridSnap) => void;

  addTrack: (name: string, color: string, type?: "audio" | "midi") => void;
  renameTrack: (id: string, name: string) => void;
  deleteTrack: (id: string) => void;
  reorderTrack: (id: string, newIndex: number) => void;
  duplicateTrack: (id: string) => void;

  selectedTrackId: string | null;
  setSelectedTrackId: (id: string | null) => void;
  selectedClipId: string | null;
  setSelectedClipId: (id: string | null) => void;
  selectedClipIds: Set<string>;
  toggleClipSelection: (id: string, additive: boolean) => void;
  clearSelection: () => void;

  importFile: (trackId: string, file: File) => Promise<void>;
  importAudioToTrack: (trackId: string, file: File) => Promise<void>;
  importAudioAuto: (file: File) => Promise<void>;
  addSample: (def: any) => Promise<void>;
  removeClip: (trackId: string, clipId: string) => void;
  deleteClip: (trackId: string, clipId: string) => void;
  moveClip: (trackId: string, clipId: string, newStart: number) => void;
  trimClip: (trackId: string, clipId: string, newDur: number, newOffset: number) => void;
  splitClip: (trackId: string, clipId: string, atTime: number) => void;
  copyClip: (trackId: string, clipId: string) => void;
  cutClip: (trackId: string, clipId: string) => void;
  pasteClip: (atTime?: number) => void;
  duplicateClip: (trackId: string, clipId: string) => void;
  clipboard: StudioClip | null;

  addMIDINote: (trackId: string, note: any) => void;
  updateMIDINote: (trackId: string, noteId: string, patch: any) => void;
  deleteMIDINote: (trackId: string, noteId: string) => void;

  setVolume: (trackId: string, v: number) => void;
  setPan: (trackId: string, v: number) => void;
  toggleMute: (trackId: string) => void;
  toggleSolo: (trackId: string) => void;

  addPlugin: (trackId: string, type: PluginType) => void;
  updatePluginParam: (trackId: string, pluginId: string, key: string, v: number) => void;
  togglePlugin: (trackId: string, pluginId: string) => void;
  removePlugin: (trackId: string, pluginId: string) => void;

  exportWav: () => Promise<void>;
  save: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  setLoop: (start: number, end: number) => void;
  toggleLoop: () => void;

  uploadProgress: { name: string; pct: number } | null;
  uploadError: string | null;
  clearUploadError: () => void;
  getAnalyser: (trackId: string) => AnalyserNode | undefined;
};

const StudioCtx = createContext<Ctx | null>(null);
export function useStudio() {
  const v = useContext(StudioCtx);
  if (!v) throw new Error("useStudio must be inside StudioProvider");
  return v;
}

export function StudioProvider({ children }: { children: ReactNode }) {
  const [project, setProjectState] = useState<StudioProject>(() => {
    if (typeof window === "undefined") return createProject();
    const id = getActiveProjectId();
    if (id) { const p = loadProject(id); if (p) return p; }
    return createProject();
  });
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(project.tracks[0]?.id ?? null);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [selectedClipIds, setSelectedClipIds] = useState<Set<string>>(new Set());
  const [clipboard, setClipboard] = useState<StudioClip | null>(null);
  const [metronome, setMetronome] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [view, setView] = useState<StudioView>("edit");
  const [tool, setTool] = useState<StudioTool>("select");
  const [zoom, setZoom] = useState(80);
  const [snap, setSnap] = useState<GridSnap>("1/4");
  const [uploadProgress, setUploadProgress] = useState<{ name: string; pct: number } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [undoCount, setUndoCount] = useState(0);
  const recRef = useRef<MediaRecorder | null>(null);
  const rafRef = useRef<number>(0);
  const engineRef = useRef<StudioEngine | null>(engine);
  const projectRef = useRef(project);
  projectRef.current = project;

  // Wrap setProject to auto-push history
  const setProject = (updater: StudioProject | ((p: StudioProject) => StudioProject)) => {
    setProjectState(prev => {
      const next = typeof updater === "function" ? (updater as any)(prev) : updater;
      history.push(next);
      setUndoCount(history.size());
      return next;
    });
  };

  // Seed tracks
  useEffect(() => {
    if (project.tracks.length === 0) {
      const v = createTrack("Vocals", TRACK_COLORS[0]);
      const d = createTrack("Drums", TRACK_COLORS[1]);
      setProjectState(p => ({ ...p, tracks: [v, d] }));
      setSelectedTrackId(v.id);
      history.push({ ...project, tracks: [v, d] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Playhead ticker
  useEffect(() => {
    const e = engineRef.current;
    if (!e) return;
    if (!playing) { setPosition(e.getPosition()); return; }
    const tick = () => {
      setPosition(e.getPosition());
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  const play = (from: number) => {
    const e = engineRef.current;
    if (!e) return;
    e.ctx.resume();
    e.play(projectRef.current, from);
    setPlaying(true);
  };
  const stop = () => { engineRef.current?.stop(); setPlaying(false); };

  const record = async () => {
    const e = engineRef.current;
    if (!e) return;
    if (isRecording) { recRef.current?.stop(); setIsRecording(false); return; }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const rec = new MediaRecorder(stream);
    recRef.current = rec;
    const chunks: BlobPart[] = [];
    rec.ondataavailable = ev => chunks.push(ev.data);
    rec.onstop = async () => {
      const blob = new Blob(chunks, { type: rec.mimeType });
      const buf = await blob.arrayBuffer();
      const audioBuf = await e.decodeArrayBuffer(buf);
      const target = projectRef.current.tracks.find(t => t.id === selectedTrackId) ?? projectRef.current.tracks[0];
      if (!target) return;
      const newClip: StudioClip = {
        id: crypto.randomUUID(), name: "Recording",
        start: position, duration: audioBuf.duration, offset: 0,
        buffer: audioBuf, fadeIn: 0, fadeOut: 0, gain: 1,
      };
      setProject(p => ({ ...p, tracks: p.tracks.map(t => t.id === target.id ? { ...t, clips: [...t.clips, newClip] } : t) }));
    };
    rec.start();
    setIsRecording(true);
    play(position);
  };

  // Tracks
  const addTrack = (name: string, color: string, type: "audio" | "midi" = "audio") => {
    const t = createTrack(name, color, type);
    setProject(p => ({ ...p, tracks: [...p.tracks, t] }));
    setSelectedTrackId(t.id);
  };
  const renameTrack = (id: string, name: string) =>
    setProject(p => ({ ...p, tracks: p.tracks.map(t => t.id === id ? { ...t, name } : t) }));
  const deleteTrack = (id: string) =>
    setProject(p => ({ ...p, tracks: p.tracks.filter(t => t.id !== id) }));
  const reorderTrack = (id: string, newIndex: number) =>
    setProject(p => {
      const idx = p.tracks.findIndex(t => t.id === id);
      if (idx < 0) return p;
      const arr = [...p.tracks];
      const [moved] = arr.splice(idx, 1);
      arr.splice(Math.max(0, Math.min(newIndex, arr.length)), 0, moved);
      return { ...p, tracks: arr };
    });
  const duplicateTrack = (id: string) =>
    setProject(p => {
      const t = p.tracks.find(x => x.id === id);
      if (!t) return p;
      const copy = { ...t, id: crypto.randomUUID(), name: t.name + " copy", clips: t.clips.map(c => ({ ...c, id: crypto.randomUUID() })) };
      return { ...p, tracks: [...p.tracks, copy] };
    });

  // Selection
  const toggleClipSelection = (id: string, additive: boolean) => {
    setSelectedClipIds(prev => {
      const next = additive ? new Set(prev) : new Set<string>();
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    setSelectedClipId(id);
  };
  const clearSelection = () => { setSelectedClipIds(new Set()); setSelectedClipId(null); };

  // Clips
  const addClipToTrack = (trackId: string, clip: StudioClip) => {
    setProject(p => ({
      ...p,
      tracks: p.tracks.map(t => t.id === trackId ? { ...t, clips: [...t.clips, clip] } : t),
      duration: Math.max(p.duration, clip.start + clip.duration + 2),
    }));
  };

  const importFile = async (trackId: string, file: File) => {
    const e = engineRef.current;
    if (!e) return;
    const buf = await file.arrayBuffer();
    const audioBuf = await e.decodeArrayBuffer(buf);
    const track = projectRef.current.tracks.find(t => t.id === trackId);
    if (!track) return;
    const start = track.clips.reduce((m, c) => Math.max(m, c.start + c.duration), 0);
    const clip: StudioClip = {
      id: crypto.randomUUID(),
      name: file.name.replace(/\.[^.]+$/, ""),
      start: snapTime(start, projectRef.current.bpm, snap),
      duration: audioBuf.duration,
      offset: 0, buffer: audioBuf, fadeIn: 0, fadeOut: 0, gain: 1,
    };
    addClipToTrack(trackId, clip);
  };
  const importAudioToTrack = importFile;

  const importAudioAuto = async (file: File) => {
    const e = engineRef.current;
    if (!e) return;
    const buf = await file.arrayBuffer();
    const audioBuf = await e.decodeArrayBuffer(buf);
    const name = file.name.replace(/\.[^.]+$/, "");
    const newTrack = createTrack(name, TRACK_COLORS[project.tracks.length % TRACK_COLORS.length]);
    const clip: StudioClip = {
      id: crypto.randomUUID(), name, start: 0, duration: audioBuf.duration,
      offset: 0, buffer: audioBuf, fadeIn: 0, fadeOut: 0, gain: 1,
    };
    newTrack.clips = [clip];
    setProject(p => ({ ...p, tracks: [...p.tracks, newTrack], duration: Math.max(p.duration, audioBuf.duration + 2) }));
    setSelectedTrackId(newTrack.id);
  };

  const addSample = async (def: any) => {
    const e = engineRef.current;
    if (!e) return;
    try {
      setUploadProgress({ name: def.name, pct: 30 });
      const { renderSample } = await import("@/lib/samples");
      const audioBuf = await renderSample(def);
      setUploadProgress({ name: def.name, pct: 90 });
      const colorIdx = project.tracks.length % TRACK_COLORS.length;
      const newTrack = createTrack(def.name, TRACK_COLORS[colorIdx]);
      const clip: StudioClip = {
        id: crypto.randomUUID(), name: def.name, start: 0, duration: audioBuf.duration,
        offset: 0, buffer: audioBuf, fadeIn: 0, fadeOut: 0, gain: 1,
      };
      newTrack.clips = [clip];
      setProject(p => ({ ...p, tracks: [...p.tracks, newTrack], duration: Math.max(p.duration, audioBuf.duration + 2) }));
      setSelectedTrackId(newTrack.id);
      setUploadProgress({ name: def.name, pct: 100 });
      setTimeout(() => setUploadProgress(null), 600);
    } catch (err: any) {
      setUploadError(err?.message || "Sample failed");
      setUploadProgress(null);
    }
  };

  const removeClip = (trackId: string, clipId: string) => deleteClip(trackId, clipId);
  const deleteClip = (trackId: string, clipId: string) =>
    setProject(p => ({ ...p, tracks: p.tracks.map(t => t.id === trackId ? { ...t, clips: t.clips.filter(c => c.id !== clipId) } : t) }));

  const moveClip = (trackId: string, clipId: string, newStart: number) =>
    setProject(p => ({
      ...p,
      tracks: p.tracks.map(t => t.id === trackId ? {
        ...t, clips: t.clips.map(c => c.id === clipId ? { ...c, start: Math.max(0, snapTime(newStart, p.bpm, snap)) } : c)
      } : t),
    }));

  const trimClip = (trackId: string, clipId: string, newDur: number, newOffset: number) =>
    setProject(p => ({
      ...p,
      tracks: p.tracks.map(t => t.id === trackId ? {
        ...t, clips: t.clips.map(c => c.id === clipId ? { ...c, duration: Math.max(0.05, newDur), offset: Math.max(0, newOffset) } : c)
      } : t),
    }));

  const splitClip = (trackId: string, clipId: string, atTime: number) =>
    setProject(p => ({
      ...p,
      tracks: p.tracks.map(t => {
        if (t.id !== trackId) return t;
        const clip = t.clips.find(c => c.id === clipId);
        if (!clip) return t;
        const rel = atTime - clip.start;
        if (rel <= 0.05 || rel >= clip.duration - 0.05) return t;
        const first: StudioClip = { ...clip, duration: rel };
        const second: StudioClip = {
          ...clip, id: crypto.randomUUID(),
          start: clip.start + rel, duration: clip.duration - rel, offset: clip.offset + rel,
        };
        return { ...t, clips: [...t.clips.filter(c => c.id !== clipId), first, second] };
      }),
    }));

  const copyClip = (trackId: string, clipId: string) => {
    const t = projectRef.current.tracks.find(x => x.id === trackId);
    const c = t?.clips.find(x => x.id === clipId);
    if (c) setClipboard({ ...c });
  };
  const cutClip = (trackId: string, clipId: string) => { copyClip(trackId, clipId); deleteClip(trackId, clipId); };
  const pasteClip = (atTime?: number) => {
    if (!clipboard) return;
    const targetId = selectedTrackId ?? project.tracks[0]?.id;
    if (!targetId) return;
    const start = atTime ?? position;
    const newClip: StudioClip = {
      ...clipboard, id: crypto.randomUUID(),
      start: snapTime(start, project.bpm, snap),
    };
    addClipToTrack(targetId, newClip);
    setSelectedClipId(newClip.id);
  };
  const duplicateClip = (trackId: string, clipId: string) => {
    const t = project.tracks.find(x => x.id === trackId);
    const c = t?.clips.find(x => x.id === clipId);
    if (!c) return;
    const newClip: StudioClip = { ...c, id: crypto.randomUUID(), start: c.start + c.duration };
    addClipToTrack(trackId, newClip);
  };

  // MIDI
  const addMIDINote = (trackId: string, note: any) =>
    setProject(p => ({ ...p, tracks: p.tracks.map(t => t.id === trackId ? { ...t, notes: [...t.notes, { ...note, id: crypto.randomUUID() }] } : t) }));
  const updateMIDINote = (trackId: string, noteId: string, patch: any) =>
    setProject(p => ({ ...p, tracks: p.tracks.map(t => t.id === trackId ? { ...t, notes: t.notes.map(n => n.id === noteId ? { ...n, ...patch } : n) } : t) }));
  const deleteMIDINote = (trackId: string, noteId: string) =>
    setProject(p => ({ ...p, tracks: p.tracks.map(t => t.id === trackId ? { ...t, notes: t.notes.filter(n => n.id !== noteId) } : t) }));

  // Mix
  const setVolume = (trackId: string, v: number) => {
    setProject(p => {
      const tracks = p.tracks.map(t => t.id === trackId ? { ...t, volume: v } : t);
      const u = tracks.find(t => t.id === trackId);
      if (u) engineRef.current?.setTrackVolume(u);
      return { ...p, tracks };
    });
  };
  const setPan = (trackId: string, v: number) => {
    setProject(p => {
      const tracks = p.tracks.map(t => t.id === trackId ? { ...t, pan: v } : t);
      const u = tracks.find(t => t.id === trackId);
      if (u) engineRef.current?.setTrackPan(u);
      return { ...p, tracks };
    });
  };
  const toggleMute = (trackId: string) =>
    setProject(p => ({ ...p, tracks: p.tracks.map(t => t.id === trackId ? { ...t, muted: !t.muted } : t) }));
  const toggleSolo = (trackId: string) =>
    setProject(p => ({ ...p, tracks: p.tracks.map(t => t.id === trackId ? { ...t, soloed: !t.soloed } : t) }));

  // Plugins
  const addPlugin = (trackId: string, type: PluginType) =>
    setProject(p => ({ ...p, tracks: p.tracks.map(t => t.id === trackId ? { ...t, plugins: [...t.plugins, createPlugin(type)] } : t) }));
  const updatePluginParam = (trackId: string, pluginId: string, key: string, v: number) =>
    setProject(p => ({ ...p, tracks: p.tracks.map(t => t.id !== trackId ? t : { ...t, plugins: t.plugins.map(pl => pl.id !== pluginId ? pl : { ...pl, params: { ...pl.params, [key]: v } }) }) }));
  const togglePlugin = (trackId: string, pluginId: string) =>
    setProject(p => ({ ...p, tracks: p.tracks.map(t => t.id !== trackId ? t : { ...t, plugins: t.plugins.map(pl => pl.id !== pluginId ? pl : { ...pl, enabled: !pl.enabled }) }) }));
  const removePlugin = (trackId: string, pluginId: string) =>
    setProject(p => ({ ...p, tracks: p.tracks.map(t => t.id !== trackId ? t : { ...t, plugins: t.plugins.filter(pl => pl.id !== pluginId) }) }));

  // Loop
  const setLoop = (start: number, end: number) => setProject(p => ({ ...p, loopStart: start, loopEnd: end }));
  const toggleLoop = () => setProject(p => ({ ...p, loopEnabled: !p.loopEnabled }));

  // Undo/redo
  const undo = () => {
    const prev = history.undo();
    if (prev) { setProjectState(prev); setUndoCount(history.size()); }
  };
  const redo = () => {
    const next = history.redo();
    if (next) { setProjectState(next); setUndoCount(history.size()); }
  };

  // Save
  const save = () => { saveProject(project); setProject(p => ({ ...p, updatedAt: Date.now() })); };
  const exportWav = async () => {
    const e = engineRef.current;
    if (!e) return;
    const duration = project.duration;
    const offline = new OfflineAudioContext(2, Math.ceil(44100 * duration), 44100);
    const master = offline.createGain();
    master.gain.value = project.masterVolume;
    master.connect(offline.destination);
    const soloed = project.tracks.some(t => t.soloed);
    for (const t of project.tracks) {
      if (t.muted || (soloed && !t.soloed)) continue;
      const g = offline.createGain();
      g.gain.value = t.volume;
      const pan = offline.createStereoPanner();
      pan.pan.value = t.pan;
      g.connect(pan); pan.connect(master);
      for (const c of t.clips) {
        if (!c.buffer) continue;
        const src = offline.createBufferSource();
        src.buffer = c.buffer;
        src.connect(g);
        src.start(c.start, c.offset, c.duration);
      }
    }
    const rendered = await offline.startRendering();
    // WAV encode
    const numCh = rendered.numberOfChannels;
    const len = rendered.length * numCh * 2 + 44;
    const ab = new ArrayBuffer(len);
    const view = new DataView(ab);
    let o = 0;
    const w = (s: string) => { for (const ch of s) view.setUint8(o++, ch.charCodeAt(0)); };
    w("RIFF"); view.setUint32(o, len - 8, true); o += 4; w("WAVE");
    w("fmt "); view.setUint32(o, 16, true); o += 4;
    view.setUint16(o, 1, true); o += 2;
    view.setUint16(o, numCh, true); o += 2;
    view.setUint32(o, rendered.sampleRate, true); o += 4;
    view.setUint32(o, rendered.sampleRate * numCh * 2, true); o += 4;
    view.setUint16(o, numCh * 2, true); o += 2;
    view.setUint16(o, 16, true); o += 2;
    w("data"); view.setUint32(o, len - 44, true); o += 4;
    const chans: Float32Array[] = [];
    for (let i = 0; i < numCh; i++) chans.push(rendered.getChannelData(i));
    for (let i = 0; i < rendered.length; i++) {
      for (let c = 0; c < numCh; c++) {
        const s = Math.max(-1, Math.min(1, chans[c][i]));
        view.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        o += 2;
      }
    }
    const blob = new Blob([ab], { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${project.name || "project"}.wav`; a.click();
    URL.revokeObjectURL(url);
  };

  const setProjectName = (n: string) => setProject(p => ({ ...p, name: n }));
  const setBpm = (n: number) => setProject(p => ({ ...p, bpm: n }));
  const clearUploadError = () => setUploadError(null);
  const getAnalyser = (id: string) => {
    const e = engineRef.current;
    if (!e) return undefined;
    const n = e.trackNodes.get(id);
    if (!n) return undefined;
    const an = new AnalyserNode(e.ctx, { fftSize: 256 });
    n.output.connect(an);
    return an;
  };

  return (
    <StudioCtx.Provider value={{
      project, setProjectName, playing, position,
      bpm: project.bpm, setBpm, metronome, setMetronome, isRecording, record, play, stop,
      view, setView, tool, setTool, zoom, setZoom, snap, setSnap,
      addTrack, renameTrack, deleteTrack, reorderTrack, duplicateTrack,
      selectedTrackId, setSelectedTrackId,
      selectedClipId, setSelectedClipId, selectedClipIds, toggleClipSelection, clearSelection,
      importFile, importAudioToTrack, importAudioAuto, addSample,
      removeClip, deleteClip, moveClip, trimClip, splitClip,
      copyClip, cutClip, pasteClip, duplicateClip, clipboard,
      addMIDINote, updateMIDINote, deleteMIDINote,
      setVolume, setPan, toggleMute, toggleSolo,
      addPlugin, updatePluginParam, togglePlugin, removePlugin,
      exportWav, save, undo, redo,
      canUndo: history.canUndo(), canRedo: history.canRedo(),
      setLoop, toggleLoop,
      uploadProgress, uploadError, clearUploadError,
      getAnalyser,
    }}>
      {children}
    </StudioCtx.Provider>
  );
}

