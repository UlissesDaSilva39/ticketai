// ============================================================
// GRID Studio — full type system
// ============================================================

export type PluginType =
  | "eq" | "compressor" | "reverb" | "delay" | "distortion"
  | "chorus" | "flanger" | "phaser" | "tremolo"
  | "autofilter" | "bitcrusher" | "limiter" | "gate"
  | "stereo-widener" | "pitch-shift";

export type PluginConfig = {
  id: string;
  type: PluginType;
  enabled: boolean;
  params: Record<string, number>;
};

export type StudioClip = {
  id: string;
  name: string;
  start: number;
  duration: number;
  offset: number;
  buffer?: AudioBuffer;
  fadeIn: number;
  fadeOut: number;
  gain: number;
};

export type MIDINote = {
  id: string;
  pitch: number;    // 0-127
  start: number;    // seconds
  duration: number; // seconds
  velocity: number; // 0-127
};

export type StudioTrack = {
  id: string;
  name: string;
  color: string;
  volume: number;
  pan: number;
  muted: boolean;
  soloed: boolean;
  type: "audio" | "midi";
  plugins: PluginConfig[];
  clips: StudioClip[];
  notes: MIDINote[];
};

export type StudioProject = {
  id: string;
  name: string;
  bpm: number;
  timeSignature: [number, number];
  tracks: StudioTrack[];
  masterVolume: number;
  duration: number;
  loopStart: number;
  loopEnd: number;
  loopEnabled: boolean;
  createdAt: number;
  updatedAt: number;
};

export type StudioView = "edit" | "mix";
export type StudioTool = "select" | "split" | "trim" | "zoom";
export type GridSnap = "off" | "1/4" | "1/8" | "1/16" | "1bar";

export const TRACK_COLORS = [
  "#4f8cff", "#00FF87", "#FFB800", "#FF3B30",
  "#A855F7", "#00D4FF", "#EC4899", "#84CC16",
];

export const PLUGIN_DEFAULTS: Record<PluginType, Record<string, number>> = {
  eq:         { low: 0, mid: 0, high: 0 },
  compressor: { threshold: -24, ratio: 4, attack: 0.01, release: 0.25 },
  reverb:     { mix: 0.3, decay: 2.0 },
  delay:      { time: 0.25, feedback: 0.4, mix: 0.25 },
  distortion: { drive: 0.3 },
  chorus:     { rate: 1.5, depth: 0.5, mix: 0.4 },
  flanger:    { rate: 0.5, depth: 0.7, feedback: 0.5, mix: 0.5 },
  phaser:     { rate: 0.5, depth: 0.5, feedback: 0.5 },
  tremolo:    { rate: 4, depth: 0.5 },
  autofilter: { rate: 2, cutoff: 800, resonance: 5 },
  bitcrusher: { bits: 8, sampleRate: 0.5, mix: 1 },
  limiter:    { threshold: -1, release: 0.05 },
  gate:       { threshold: -40, attack: 0.001, release: 0.1 },
  "stereo-widener": { width: 1.2 },
  "pitch-shift":    { semitones: 0 },
};

export type PluginParam = {
  key: string; label: string;
  min: number; max: number; step: number; unit?: string;
};
export type PluginMeta = {
  type: PluginType; label: string; color: string;
  params: PluginParam[];
  presets: Record<string, Record<string, number>>;
};

export const PLUGIN_METADATA: Record<PluginType, PluginMeta> = {
  eq: { type: "eq", label: "EQ", color: "#4f8cff", params: [
    { key: "low", label: "Low", min: -15, max: 15, step: 0.1, unit: "dB" },
    { key: "mid", label: "Mid", min: -15, max: 15, step: 0.1, unit: "dB" },
    { key: "high", label: "High", min: -15, max: 15, step: 0.1, unit: "dB" },
  ], presets: { "Flat": { low: 0, mid: 0, high: 0 }, "Vocal": { low: -2, mid: 4, high: 3 }, "Warm": { low: 3, mid: 0, high: -2 } } },
  compressor: { type: "compressor", label: "Compressor", color: "#ff8b3d", params: [
    { key: "threshold", label: "Threshold", min: -60, max: 0, step: 1, unit: "dB" },
    { key: "ratio", label: "Ratio", min: 1, max: 20, step: 0.1, unit: ":1" },
    { key: "attack", label: "Attack", min: 0.001, max: 0.5, step: 0.001, unit: "s" },
    { key: "release", label: "Release", min: 0.01, max: 1, step: 0.01, unit: "s" },
  ], presets: { "Gentle": { threshold: -18, ratio: 2, attack: 0.02, release: 0.3 }, "Punchy": { threshold: -24, ratio: 6, attack: 0.005, release: 0.1 } } },
  reverb: { type: "reverb", label: "Reverb", color: "#a855f7", params: [
    { key: "mix", label: "Mix", min: 0, max: 1, step: 0.01 },
    { key: "decay", label: "Decay", min: 0.1, max: 8, step: 0.1, unit: "s" },
  ], presets: { "Room": { mix: 0.2, decay: 1 }, "Hall": { mix: 0.35, decay: 3 }, "Cathedral": { mix: 0.5, decay: 6 } } },
  delay: { type: "delay", label: "Delay", color: "#00d4ff", params: [
    { key: "time", label: "Time", min: 0.01, max: 2, step: 0.01, unit: "s" },
    { key: "feedback", label: "Feedback", min: 0, max: 0.9, step: 0.01 },
    { key: "mix", label: "Mix", min: 0, max: 1, step: 0.01 },
  ], presets: { "Slapback": { time: 0.08, feedback: 0.1, mix: 0.3 }, "Quarter": { time: 0.5, feedback: 0.4, mix: 0.25 } } },
  distortion: { type: "distortion", label: "Distortion", color: "#ef4444", params: [
    { key: "drive", label: "Drive", min: 0, max: 1, step: 0.01 },
  ], presets: { "Warm": { drive: 0.2 }, "Crunch": { drive: 0.5 }, "Fuzz": { drive: 0.8 } } },
  chorus: { type: "chorus", label: "Chorus", color: "#22c55e", params: [
    { key: "rate", label: "Rate", min: 0.1, max: 10, step: 0.1, unit: "Hz" },
    { key: "depth", label: "Depth", min: 0, max: 1, step: 0.01 },
    { key: "mix", label: "Mix", min: 0, max: 1, step: 0.01 },
  ], presets: { "Subtle": { rate: 0.8, depth: 0.3, mix: 0.3 }, "Wide": { rate: 0.5, depth: 0.8, mix: 0.5 } } },
  flanger: { type: "flanger", label: "Flanger", color: "#06b6d4", params: [
    { key: "rate", label: "Rate", min: 0.05, max: 5, step: 0.01, unit: "Hz" },
    { key: "depth", label: "Depth", min: 0, max: 1, step: 0.01 },
    { key: "feedback", label: "Feedback", min: 0, max: 0.9, step: 0.01 },
    { key: "mix", label: "Mix", min: 0, max: 1, step: 0.01 },
  ], presets: { "Classic": { rate: 0.5, depth: 0.7, feedback: 0.5, mix: 0.5 }, "Jet": { rate: 0.2, depth: 0.9, feedback: 0.8, mix: 0.7 } } },
  phaser: { type: "phaser", label: "Phaser", color: "#8b5cf6", params: [
    { key: "rate", label: "Rate", min: 0.05, max: 5, step: 0.01, unit: "Hz" },
    { key: "depth", label: "Depth", min: 0, max: 1, step: 0.01 },
    { key: "feedback", label: "Feedback", min: 0, max: 0.9, step: 0.01 },
  ], presets: { "Slow": { rate: 0.2, depth: 0.5, feedback: 0.3 }, "Swirl": { rate: 0.8, depth: 0.8, feedback: 0.6 } } },
  tremolo: { type: "tremolo", label: "Tremolo", color: "#eab308", params: [
    { key: "rate", label: "Rate", min: 0.1, max: 20, step: 0.1, unit: "Hz" },
    { key: "depth", label: "Depth", min: 0, max: 1, step: 0.01 },
  ], presets: { "Slow": { rate: 2, depth: 0.4 }, "Fast": { rate: 8, depth: 0.6 } } },
  autofilter: { type: "autofilter", label: "AutoFilter", color: "#f97316", params: [
    { key: "rate", label: "Rate", min: 0.05, max: 10, step: 0.01, unit: "Hz" },
    { key: "cutoff", label: "Cutoff", min: 100, max: 8000, step: 10, unit: "Hz" },
    { key: "resonance", label: "Resonance", min: 0.1, max: 20, step: 0.1 },
  ], presets: { "Slow": { rate: 0.3, cutoff: 800, resonance: 5 }, "Wobble": { rate: 4, cutoff: 1200, resonance: 10 } } },
  bitcrusher: { type: "bitcrusher", label: "Bitcrusher", color: "#dc2626", params: [
    { key: "bits", label: "Bits", min: 1, max: 16, step: 1 },
    { key: "sampleRate", label: "SampleRate", min: 0.05, max: 1, step: 0.01 },
    { key: "mix", label: "Mix", min: 0, max: 1, step: 0.01 },
  ], presets: { "Lo-fi": { bits: 8, sampleRate: 0.5, mix: 1 }, "Crushed": { bits: 4, sampleRate: 0.25, mix: 1 } } },
  limiter: { type: "limiter", label: "Limiter", color: "#10b981", params: [
    { key: "threshold", label: "Threshold", min: -24, max: 0, step: 0.1, unit: "dB" },
    { key: "release", label: "Release", min: 0.001, max: 0.5, step: 0.001, unit: "s" },
  ], presets: { "Mastering": { threshold: -1, release: 0.05 } } },
  gate: { type: "gate", label: "Gate", color: "#84cc16", params: [
    { key: "threshold", label: "Threshold", min: -80, max: 0, step: 1, unit: "dB" },
    { key: "attack", label: "Attack", min: 0.001, max: 0.1, step: 0.001, unit: "s" },
    { key: "release", label: "Release", min: 0.01, max: 1, step: 0.01, unit: "s" },
  ], presets: { "Vocal": { threshold: -40, attack: 0.001, release: 0.1 } } },
  "stereo-widener": { type: "stereo-widener", label: "Stereo Width", color: "#ec4899", params: [
    { key: "width", label: "Width", min: 0, max: 2, step: 0.01 },
  ], presets: { "Normal": { width: 1 }, "Wide": { width: 1.5 } } },
  "pitch-shift": { type: "pitch-shift", label: "Pitch Shift", color: "#06b6d4", params: [
    { key: "semitones", label: "Semitones", min: -12, max: 12, step: 1 },
  ], presets: { "Octave Up": { semitones: 12 }, "Octave Down": { semitones: -12 } } },
};

export const PLUGIN_ORDER: PluginType[] = [
  "eq", "compressor", "reverb", "delay", "distortion",
  "chorus", "flanger", "phaser", "tremolo",
  "autofilter", "bitcrusher", "limiter", "gate",
  "stereo-widener", "pitch-shift",
];

export function createTrack(name: string, color: string, type: "audio" | "midi" = "audio"): StudioTrack {
  return {
    id: crypto.randomUUID(),
    name, color, type,
    volume: 0.8, pan: 0, muted: false, soloed: false,
    plugins: [], clips: [], notes: [],
  };
}

export function createProject(): StudioProject {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    name: "Untitled Project",
    bpm: 120, timeSignature: [4, 4],
    tracks: [], masterVolume: 0.8, duration: 60,
    loopStart: 0, loopEnd: 8, loopEnabled: false,
    createdAt: now, updatedAt: now,
  };
}

export function createPlugin(type: PluginType): PluginConfig {
  return {
    id: crypto.randomUUID(),
    type, enabled: true,
    params: { ...PLUGIN_DEFAULTS[type] },
  };
}

// Snap time to grid based on BPM
export function snapTime(seconds: number, bpm: number, snap: GridSnap): number {
  if (snap === "off") return seconds;
  const beatDur = 60 / bpm;
  const divisions: Record<string, number> = {
    "1/4": beatDur,
    "1/8": beatDur / 2,
    "1/16": beatDur / 4,
    "1bar": beatDur * 4,
  };
  const div = divisions[snap] ?? beatDur;
  return Math.round(seconds / div) * div;
}

// Project serialization (strips AudioBuffer, keeps metadata)
export function serializeProject(p: StudioProject): string {
  const stripped = {
    ...p,
    tracks: p.tracks.map(t => ({
      ...t,
      clips: t.clips.map(c => ({ ...c, buffer: undefined })),
    })),
  };
  return JSON.stringify(stripped);
}


// ============================================================
// Mixer types & utilities
// ============================================================
export type MixerViewMode = "strip" | "wide";

export function gainToDb(gain: number): number {
  if (gain <= 0) return -Infinity;
  return 20 * Math.log10(gain);
}

export function dbToGain(db: number): number {
  if (db === -Infinity) return 0;
  return Math.pow(10, db / 20);
}

export function formatDb(db: number): string {
  if (db === -Infinity) return "-∞";
  if (db > 0) return `+${db.toFixed(1)}`;
  return db.toFixed(1);
}

export function dbToFader(db: number): number {
  if (db <= -60) return 0;
  if (db >= 6) return 1;
  return (db + 60) / 66;
}

export function faderToDb(pos: number): number {
  if (pos <= 0) return -Infinity;
  if (pos >= 1) return 6;
  return (pos * 66) - 60;
}
