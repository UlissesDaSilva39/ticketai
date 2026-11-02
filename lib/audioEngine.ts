import { StudioProject, StudioTrack, PluginConfig } from "./studio";

export type TrackNodes = {
  input: GainNode;
  output: GainNode;
  gain: GainNode;
  panner: StereoPannerNode;
  plugins: Map<string, AudioNode[]>;
  muteGain: GainNode;
};

export class StudioEngine {
  ctx: AudioContext;
  master: GainNode;
  trackNodes: Map<string, TrackNodes> = new Map();
  analyser: AnalyserNode;
  metronomeGain: GainNode;
  startedAt = 0;
  offset = 0;
  playing = false;
  sources: AudioBufferSourceNode[] = [];
  metronomeNodes: OscillatorNode[] = [];

  constructor() {
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.8;
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 1024;
    this.master.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
    this.metronomeGain = this.ctx.createGain();
    this.metronomeGain.gain.value = 0.3;
    this.metronomeGain.connect(this.master);
  }

  ensureTrack(track: StudioTrack): TrackNodes {
    if (this.trackNodes.has(track.id)) return this.trackNodes.get(track.id)!;
    const input = this.ctx.createGain();
    const output = this.ctx.createGain();
    const muteGain = this.ctx.createGain();
    const panner = this.ctx.createStereoPanner();
    const gain = this.ctx.createGain();
    gain.gain.value = track.volume;
    panner.pan.value = track.pan;
    muteGain.gain.value = track.muted ? 0 : 1;

    input.connect(gain);
    gain.connect(panner);
    panner.connect(muteGain);
    muteGain.connect(output);
    output.connect(this.master);

    const nodes: TrackNodes = {
      input, output, gain, panner,
      muteGain,
      plugins: new Map(),
    };
    this.trackNodes.set(track.id, nodes);
    return nodes;
  }

  rebuildPlugins(track: StudioTrack) {
    const nodes = this.ensureTrack(track);
    // Disconnect input from gain, rebuild chain
    nodes.input.disconnect();
    let current: AudioNode = nodes.input;
    for (const plugin of track.plugins) {
      const chain = this.buildPlugin(plugin);
      if (!chain.length) continue;
      chain[0].connect(chain[chain.length - 1]);
      current.connect(chain[0]);
      current = chain[chain.length - 1];
    }
    current.connect(nodes.gain);
  }

  buildPlugin(plugin: PluginConfig): AudioNode[] {
    if (!plugin.enabled) return [];
    switch (plugin.type) {
      case "eq": {
        const low = this.ctx.createBiquadFilter();
        low.type = "lowshelf";
        low.frequency.value = 200;
        low.gain.value = plugin.params.low;
        const mid = this.ctx.createBiquadFilter();
        mid.type = "peaking";
        mid.frequency.value = 1000;
        mid.gain.value = plugin.params.mid;
        const high = this.ctx.createBiquadFilter();
        high.type = "highshelf";
        high.frequency.value = 4000;
        high.gain.value = plugin.params.high;
        low.connect(mid);
        mid.connect(high);
        return [low, high];
      }
      case "compressor": {
        const c = this.ctx.createDynamicsCompressor();
        c.threshold.value = plugin.params.threshold;
        c.ratio.value = plugin.params.ratio;
        c.attack.value = plugin.params.attack;
        c.release.value = plugin.params.release;
        return [c];
      }
      case "reverb": {
        const delay = this.ctx.createDelay(1);
        delay.delayTime.value = 0.05;
        const fb = this.ctx.createGain();
        fb.gain.value = plugin.params.decay * 0.5;
        const mix = this.ctx.createGain();
        mix.gain.value = plugin.params.mix;
        delay.connect(fb);
        fb.connect(delay);
        return [delay];
      }
      case "delay": {
        const d = this.ctx.createDelay(2);
        d.delayTime.value = plugin.params.time;
        const fb = this.ctx.createGain();
        fb.gain.value = plugin.params.feedback;
        d.connect(fb);
        fb.connect(d);
        return [d];
      }
      case "distortion": {
        const ws = this.ctx.createWaveShaper();
        const curve = new Float32Array(1024);
        const k = plugin.params.drive * 100;
        for (let i = 0; i < 1024; i++) {
          const x = (i * 2) / 1024 - 1;
          curve[i] = ((3 + k) * x * 20 * (Math.PI / 180)) / (Math.PI + k * Math.abs(x));
        }
        ws.curve = curve;
        return [ws];
      }
      // --- CHORUS ---
      case "chorus": {
        const dry = this.ctx.createGain();
        const wet = this.ctx.createGain();
        const dl = this.ctx.createDelay(0.1);
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        dry.gain.value = 1 - plugin.params.mix;
        wet.gain.value = plugin.params.mix;
        dl.delayTime.value = 0.025;
        lfo.frequency.value = plugin.params.rate;
        lfoGain.gain.value = plugin.params.depth * 0.005;
        lfo.connect(lfoGain);
        lfoGain.connect(dl.delayTime);
        lfo.start();
        const merge = this.ctx.createGain();
        dry.connect(merge);
        dl.connect(wet);
        wet.connect(merge);
        // note: dry/wet split — caller connects input to dry too
        return [dl];
      }

      // --- FLANGER ---
      case "flanger": {
        const dl = this.ctx.createDelay(0.05);
        const fb = this.ctx.createGain();
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        dl.delayTime.value = 0.005;
        fb.gain.value = plugin.params.feedback;
        lfo.frequency.value = plugin.params.rate;
        lfoGain.gain.value = plugin.params.depth * 0.003;
        lfo.connect(lfoGain);
        lfoGain.connect(dl.delayTime);
        lfo.start();
        dl.connect(fb);
        fb.connect(dl);
        return [dl];
      }

      // --- PHASER ---
      case "phaser": {
        const stages: AudioNode[] = [];
        for (let i = 0; i < 4; i++) {
          const ap = this.ctx.createBiquadFilter();
          ap.type = "allpass";
          ap.frequency.value = 500 + i * 200;
          ap.Q.value = plugin.params.feedback * 10;
          stages.push(ap);
        }
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.value = plugin.params.rate;
        lfoGain.gain.value = plugin.params.depth * 1000;
        lfo.connect(lfoGain);
        stages.forEach(s => lfoGain.connect((s as BiquadFilterNode).frequency));
        lfo.start();
        for (let i = 0; i < stages.length - 1; i++) {
          stages[i].connect(stages[i + 1]);
        }
        return [stages[0], stages[stages.length - 1]];
      }

      // --- TREMOLO ---
      case "tremolo": {
        const amp = this.ctx.createGain();
        amp.gain.value = 1 - plugin.params.depth * 0.5;
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.value = plugin.params.rate;
        lfoGain.gain.value = plugin.params.depth * 0.5;
        lfo.connect(lfoGain);
        lfoGain.connect(amp.gain);
        lfo.start();
        return [amp];
      }

      // --- AUTOFILTER ---
      case "autofilter": {
        const lp = this.ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = plugin.params.cutoff;
        lp.Q.value = plugin.params.resonance;
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.value = plugin.params.rate;
        lfoGain.gain.value = plugin.params.cutoff * 0.8;
        lfo.connect(lfoGain);
        lfoGain.connect(lp.frequency);
        lfo.start();
        return [lp];
      }

      // --- BITCRUSHER (via WaveShaper emulation) ---
      case "bitcrusher": {
        const ws = this.ctx.createWaveShaper();
        const bits = Math.max(1, plugin.params.bits);
        const levels = Math.pow(2, bits);
        const curve = new Float32Array(4096);
        for (let i = 0; i < 4096; i++) {
          const x = (i * 2) / 4096 - 1;
          curve[i] = Math.round(x * levels) / levels;
        }
        ws.curve = curve;
        return [ws];
      }

      // --- LIMITER (via compressor with hard ratio) ---
      case "limiter": {
        const lim = this.ctx.createDynamicsCompressor();
        lim.threshold.value = plugin.params.threshold;
        lim.ratio.value = 20;
        lim.attack.value = 0.001;
        lim.release.value = plugin.params.release;
        return [lim];
      }

      // --- GATE (via compressor with high threshold) ---
      case "gate": {
        const g = this.ctx.createDynamicsCompressor();
        g.threshold.value = plugin.params.threshold;
        g.ratio.value = 20;
        g.attack.value = plugin.params.attack;
        g.release.value = plugin.params.release;
        return [g];
      }

      // --- STEREO WIDENER ---
      case "stereo-widener": {
        const sp = this.ctx.createStereoPanner();
        sp.pan.value = 0;
        const g = this.ctx.createGain();
        g.gain.value = plugin.params.width;
        return [g];
      }

      // --- PITCH SHIFT (via playbackRate trick) ---
      case "pitch-shift": {
        // Simplified — real pitch shift needs phase vocoder
        // We approximate with a delay + gain (no audible pitch change)
        const g = this.ctx.createGain();
        g.gain.value = 1;
        return [g];
      }

      default:
        return [];
    }
  }

  setTrackVolume(track: StudioTrack) {
    const n = this.trackNodes.get(track.id);
    if (n) n.gain.gain.value = track.volume;
  }
  setTrackPan(track: StudioTrack) {
    const n = this.trackNodes.get(track.id);
    if (n) n.panner.pan.value = track.pan;
  }
  setTrackMute(track: StudioTrack) {
    const n = this.trackNodes.get(track.id);
    if (n) n.muteGain.gain.value = track.muted ? 0 : 1;
  }

  play(project: StudioProject, from: number) {
    if (this.playing) this.stop();
    this.playing = true;
    this.offset = from;
    this.startedAt = this.ctx.currentTime;
    this.sources = [];
    const soloed = project.tracks.some(t => t.soloed);
    for (const track of project.tracks) {
      this.ensureTrack(track);
      this.rebuildPlugins(track);
      this.setTrackVolume(track);
      this.setTrackPan(track);
      const effectivelyMuted = track.muted || (soloed && !track.soloed);
      const n = this.trackNodes.get(track.id)!;
      n.muteGain.gain.value = effectivelyMuted ? 0 : 1;
      for (const clip of track.clips) {
        if (!clip.buffer) continue;
        const clipStart = clip.start;
        const clipEnd = clip.start + clip.duration;
        if (clipEnd <= from) continue;
        const when = this.ctx.currentTime + Math.max(0, clipStart - from);
        const src = this.ctx.createBufferSource();
        src.buffer = clip.buffer;
        src.connect(n.input);
        const playOffset = clip.offset + Math.max(0, from - clipStart);
        src.start(when, playOffset);
        this.sources.push(src);
      }
    }
    this.scheduleMetronome(project, from);
  }

  scheduleMetronome(project: StudioProject, from: number) {
    const beat = 60 / project.bpm;
    const startBeat = Math.ceil(from / beat);
    for (let b = startBeat; b * beat < project.duration; b++) {
      const when = this.ctx.currentTime + (b * beat - from);
      if (when < this.ctx.currentTime) continue;
      const osc = this.ctx.createOscillator();
      const env = this.ctx.createGain();
      osc.frequency.value = b % project.timeSignature[0] === 0 ? 1200 : 800;
      env.gain.setValueAtTime(0, when);
      env.gain.linearRampToValueAtTime(0.3, when + 0.001);
      env.gain.exponentialRampToValueAtTime(0.001, when + 0.05);
      osc.connect(env);
      env.connect(this.metronomeGain);
      osc.start(when);
      osc.stop(when + 0.06);
      this.metronomeNodes.push(osc);
      osc.onended = () => {
        const i = this.metronomeNodes.indexOf(osc);
        if (i >= 0) this.metronomeNodes.splice(i, 1);
      };
    }
  }

  stop() {
    this.playing = false;
    for (const s of this.sources) {
      try { s.stop(); } catch {}
    }
    this.sources = [];
    for (const osc of this.metronomeNodes) {
      try { osc.stop(); } catch {}
      try { osc.disconnect(); } catch {}
    }
    this.metronomeNodes = [];
  }

  getPosition(): number {
    if (!this.playing) return this.offset;
    return this.offset + (this.ctx.currentTime - this.startedAt);
  }

  async record(): Promise<MediaRecorder> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const rec = new MediaRecorder(stream);
    return rec;
  }

  async decodeArrayBuffer(buf: ArrayBuffer): Promise<AudioBuffer> {
    return await this.ctx.decodeAudioData(buf.slice(0));
  }

  async exportWav(project: StudioProject): Promise<Blob> {
    const sampleRate = 44100;
    const duration = project.duration;
    const offline = new OfflineAudioContext(
      2,
      Math.ceil(sampleRate * duration),
      sampleRate
    );
    const master = offline.createGain();
    master.gain.value = project.masterVolume;
    master.connect(offline.destination);

    const soloed = project.tracks.some(t => t.soloed);
    for (const track of project.tracks) {
      const effectivelyMuted = track.muted || (soloed && !track.soloed);
      if (effectivelyMuted) continue;
      const gain = offline.createGain();
      gain.gain.value = track.volume;
      const pan = offline.createStereoPanner();
      pan.pan.value = track.pan;
      gain.connect(pan);
      pan.connect(master);
      for (const clip of track.clips) {
        if (!clip.buffer) continue;
        const src = offline.createBufferSource();
        src.buffer = clip.buffer;
        src.connect(gain);
        src.start(clip.start, clip.offset, clip.duration);
      }
    }
    const rendered = await offline.startRendering();
    return encodeWav(rendered);
  }
}

function encodeWav(buffer: AudioBuffer): Blob {
  const numCh = buffer.numberOfChannels;
  const len = buffer.length * numCh * 2 + 44;
  const ab = new ArrayBuffer(len);
  const view = new DataView(ab);
  let o = 0;
  const w = (s: string) => { for (const c of s) view.setUint8(o++, c.charCodeAt(0)); };
  w("RIFF"); view.setUint32(o, len - 8, true); o += 4; w("WAVE");
  w("fmt "); view.setUint32(o, 16, true); o += 4;
  view.setUint16(o, 1, true); o += 2;
  view.setUint16(o, numCh, true); o += 2;
  view.setUint32(o, buffer.sampleRate, true); o += 4;
  view.setUint32(o, buffer.sampleRate * numCh * 2, true); o += 4;
  view.setUint16(o, numCh * 2, true); o += 2;
  view.setUint16(o, 16, true); o += 2;
  w("data"); view.setUint32(o, len - 44, true); o += 4;
  const chans: Float32Array[] = [];
  for (let i = 0; i < numCh; i++) chans.push(buffer.getChannelData(i));
  for (let i = 0; i < buffer.length; i++) {
    for (let c = 0; c < numCh; c++) {
      const s = Math.max(-1, Math.min(1, chans[c][i]));
      view.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      o += 2;
    }
  }
  return new Blob([ab], { type: "audio/wav" });
}

export const engine = typeof window !== "undefined" ? new StudioEngine() : null;
