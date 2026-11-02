// ============================================================
// GRID Studio — procedurally synthesized instrument samples
// Everything rendered via OfflineAudioContext
// ============================================================

export type SampleCategory = "drums" | "bass" | "keys" | "guitar" | "vocals" | "fx";

export type SampleDef = {
  id: string;
  name: string;
  category: SampleCategory;
  duration: number;
  render: (ctx: OfflineAudioContext) => Promise<void> | void;
};

function makeNoiseBuffer(ctx: BaseAudioContext, seconds: number): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

function renderKick(ctx: OfflineAudioContext) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(150, 0);
  osc.frequency.exponentialRampToValueAtTime(50, 0.15);
  g.gain.setValueAtTime(1, 0);
  g.gain.exponentialRampToValueAtTime(0.001, 0.35);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(0);
  osc.stop(0.4);
}

function renderSnare(ctx: OfflineAudioContext) {
  const osc = ctx.createOscillator();
  const oscG = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.value = 180;
  oscG.gain.setValueAtTime(0.4, 0);
  oscG.gain.exponentialRampToValueAtTime(0.001, 0.12);
  osc.connect(oscG);
  oscG.connect(ctx.destination);
  osc.start(0);
  osc.stop(0.15);

  const noise = ctx.createBufferSource();
  noise.buffer = makeNoiseBuffer(ctx, 0.2);
  const ng = ctx.createGain();
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 1200;
  ng.gain.setValueAtTime(0.7, 0);
  ng.gain.exponentialRampToValueAtTime(0.001, 0.18);
  noise.connect(hp);
  hp.connect(ng);
  ng.connect(ctx.destination);
  noise.start(0);
  noise.stop(0.2);
}

function renderHiHat(ctx: OfflineAudioContext) {
  const noise = ctx.createBufferSource();
  noise.buffer = makeNoiseBuffer(ctx, 0.1);
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 8000;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.3, 0);
  g.gain.exponentialRampToValueAtTime(0.001, 0.05);
  noise.connect(hp);
  hp.connect(g);
  g.connect(ctx.destination);
  noise.start(0);
  noise.stop(0.08);
}

function renderClap(ctx: OfflineAudioContext) {
  const noise = ctx.createBufferSource();
  noise.buffer = makeNoiseBuffer(ctx, 0.3);
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 1500;
  bp.Q.value = 1.5;
  const g = ctx.createGain();
  const t = 0;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.8, t + 0.005);
  g.gain.linearRampToValueAtTime(0.2, t + 0.015);
  g.gain.linearRampToValueAtTime(0.8, t + 0.025);
  g.gain.linearRampToValueAtTime(0.2, t + 0.035);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
  noise.connect(bp);
  bp.connect(g);
  g.connect(ctx.destination);
  noise.start(t);
  noise.stop(t + 0.25);
}

function render808(ctx: OfflineAudioContext) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(80, 0);
  osc.frequency.exponentialRampToValueAtTime(40, 0.4);
  g.gain.setValueAtTime(1, 0);
  g.gain.exponentialRampToValueAtTime(0.001, 0.8);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(0);
  osc.stop(0.9);
}

function renderBass(ctx: OfflineAudioContext, freq = 55, duration = 1) {
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.value = freq;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 400;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, 0);
  g.gain.linearRampToValueAtTime(0.6, 0.02);
  g.gain.linearRampToValueAtTime(0.4, 0.3);
  g.gain.exponentialRampToValueAtTime(0.001, duration);
  osc.connect(lp);
  lp.connect(g);
  g.connect(ctx.destination);
  osc.start(0);
  osc.stop(duration);
}

function renderChord(ctx: OfflineAudioContext, freqs: number[], duration = 1.5) {
  freqs.forEach(f => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = f;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, 0);
    g.gain.linearRampToValueAtTime(0.25, 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, duration);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(0);
    osc.stop(duration);
  });
}

function renderPad(ctx: OfflineAudioContext, freqs: number[], duration = 2) {
  freqs.forEach(f => {
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = f;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, 0);
    g.gain.linearRampToValueAtTime(0.15, 0.5);
    g.gain.linearRampToValueAtTime(0.15, duration - 0.5);
    g.gain.linearRampToValueAtTime(0, duration);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(0);
    osc.stop(duration);
  });
}

function renderPowerChord(ctx: OfflineAudioContext, root = 82, duration = 1) {
  [root, root * 1.5, root * 2].forEach(f => {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = f;
    const dist = ctx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1;
      curve[i] = Math.tanh(x * 3);
    }
    dist.curve = curve;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 3000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.2, 0);
    g.gain.exponentialRampToValueAtTime(0.001, duration);
    osc.connect(dist);
    dist.connect(lp);
    lp.connect(g);
    g.connect(ctx.destination);
    osc.start(0);
    osc.stop(duration);
  });
}

function renderVocal(ctx: OfflineAudioContext, vowel: "ahh" | "ohh" | "lah", duration = 1.2) {
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.value = 220;

  const formants = { ahh: [800, 1150], ohh: [450, 800], lah: [600, 1000] }[vowel];

  formants.forEach((f, i) => {
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = f;
    bp.Q.value = 8;
    const g = ctx.createGain();
    g.gain.value = i === 0 ? 0.8 : 0.5;
    osc.connect(bp);
    bp.connect(g);
    g.connect(ctx.destination);
  });

  const env = ctx.createGain();
  env.gain.setValueAtTime(0, 0);
  env.gain.linearRampToValueAtTime(0.3, 0.1);
  env.gain.linearRampToValueAtTime(0.3, duration - 0.2);
  env.gain.linearRampToValueAtTime(0, duration);
  osc.connect(env);
  env.connect(ctx.destination);

  osc.start(0);
  osc.stop(duration);
}

function renderRiser(ctx: OfflineAudioContext) {
  const noise = ctx.createBufferSource();
  noise.buffer = makeNoiseBuffer(ctx, 2);
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.setValueAtTime(200, 0);
  bp.frequency.exponentialRampToValueAtTime(8000, 1.8);
  bp.Q.value = 5;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, 0);
  g.gain.linearRampToValueAtTime(0.4, 1.8);
  g.gain.linearRampToValueAtTime(0, 2);
  noise.connect(bp);
  bp.connect(g);
  g.connect(ctx.destination);
  noise.start(0);
  noise.stop(2);
}

function renderWhiteNoise(ctx: OfflineAudioContext) {
  const noise = ctx.createBufferSource();
  noise.buffer = makeNoiseBuffer(ctx, 1);
  const g = ctx.createGain();
  g.gain.value = 0.15;
  noise.connect(g);
  g.connect(ctx.destination);
  noise.start(0);
}

export const SAMPLES: SampleDef[] = [
  { id: "kick",      name: "Kick 4/4",       category: "drums",  duration: 0.5,  render: renderKick },
  { id: "snare",     name: "Snare Backbeat", category: "drums",  duration: 0.3,  render: renderSnare },
  { id: "hihat",     name: "Hi-Hat 8ths",    category: "drums",  duration: 0.15, render: renderHiHat },
  { id: "clap",      name: "Hand Clap",      category: "drums",  duration: 0.3,  render: renderClap },
  { id: "808",       name: "808 Kick",       category: "drums",  duration: 1,    render: render808 },

  { id: "bass-root", name: "Root Note",      category: "bass",   duration: 1,    render: ctx => renderBass(ctx, 55, 1) },
  { id: "bass-sub",  name: "Sub Bass",       category: "bass",   duration: 1.5,  render: ctx => renderBass(ctx, 40, 1.5) },
  { id: "bass-high", name: "High Bass",      category: "bass",   duration: 1,    render: ctx => renderBass(ctx, 82, 1) },

  { id: "cmaj",      name: "C Major Chord",  category: "keys",   duration: 1.5,  render: ctx => renderChord(ctx, [261.63, 329.63, 392.00], 1.5) },
  { id: "amin",      name: "A Minor Chord",  category: "keys",   duration: 1.5,  render: ctx => renderChord(ctx, [220.00, 261.63, 329.63], 1.5) },
  { id: "fmaj",      name: "F Major Chord",  category: "keys",   duration: 1.5,  render: ctx => renderChord(ctx, [174.61, 220.00, 261.63], 1.5) },
  { id: "pad-cmaj",  name: "Pad Sustain",    category: "keys",   duration: 2,    render: ctx => renderPad(ctx, [261.63, 329.63, 392.00, 523.25], 2) },

  { id: "guitar-power", name: "Power Chord E", category: "guitar", duration: 1, render: ctx => renderPowerChord(ctx, 82.41, 1) },
  { id: "guitar-a",     name: "Power Chord A", category: "guitar", duration: 1, render: ctx => renderPowerChord(ctx, 110.00, 1) },

  { id: "vocal-ahh",  name: "Vocal Ahh",     category: "vocals", duration: 1.2,  render: ctx => renderVocal(ctx, "ahh", 1.2) },
  { id: "vocal-ohh",  name: "Vocal Ohh",     category: "vocals", duration: 1.2,  render: ctx => renderVocal(ctx, "ohh", 1.2) },
  { id: "vocal-lah",  name: "Vocal La-La",   category: "vocals", duration: 1.2,  render: ctx => renderVocal(ctx, "lah", 1.2) },

  { id: "riser",      name: "Riser",         category: "fx",     duration: 2,    render: renderRiser },
  { id: "white-noise", name: "White Noise",  category: "fx",     duration: 1,    render: renderWhiteNoise },
];

export const CATEGORY_LABELS: Record<SampleCategory, string> = {
  drums: "DRUMS",
  bass: "BASS",
  keys: "KEYS",
  guitar: "GUITAR",
  vocals: "VOCALS",
  fx: "FX",
};

export async function renderSample(def: SampleDef): Promise<AudioBuffer> {
  const sr = 44100;
  const offline = new OfflineAudioContext(1, Math.ceil(sr * def.duration), sr);
  await def.render(offline);
  return await offline.startRendering();
}
