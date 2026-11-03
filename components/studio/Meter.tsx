"use client";
import { useEffect, useRef, useState } from "react";

export default function Meter({
  analyser, vertical = true, height = 100, width = 12,
}: {
  analyser?: AnalyserNode;
  vertical?: boolean;
  height?: number;
  width?: number;
}) {
  const [levelL, setLevelL] = useState(0);
  const [levelR, setLevelR] = useState(0);
  const [peakL, setPeakL] = useState(0);
  const [peakR, setPeakR] = useState(0);
  const [holdL, setHoldL] = useState(0);
  const [holdR, setHoldR] = useState(0);
  const [clipL, setClipL] = useState(false);
  const [clipR, setClipR] = useState(false);
  const rafRef = useRef(0);
  const holdTimerRef = useRef<Record<string, number>>({});

  useEffect(() => {
    if (!analyser) return;
    const buf = new Float32Array(analyser.fftSize);
    const tick = () => {
      analyser.getFloatTimeDomainData(buf);
      let maxL = 0, maxR = 0;
      const half = Math.floor(buf.length / 2);
      for (let i = 0; i < half; i++) {
        const aL = Math.abs(buf[i]);
        const aR = Math.abs(buf[i + half]);
        if (aL > maxL) maxL = aL;
        if (aR > maxR) maxR = aR;
      }

      const dbL = 20 * Math.log10(maxL + 1e-9);
      const dbR = 20 * Math.log10(maxR + 1e-9);
      const pctL = Math.max(0, Math.min(1, (dbL + 60) / 60));
      const pctR = Math.max(0, Math.min(1, (dbR + 60) / 60));

      setLevelL(pctL);
      setLevelR(pctR);

      if (dbL > 0) setClipL(true);
      if (dbR > 0) setClipR(true);

      if (pctL > peakL) {
        setPeakL(pctL);
        setHoldL(pctL);
        clearTimeout(holdTimerRef.current.L);
        holdTimerRef.current.L = window.setTimeout(() => setHoldL(0), 1500);
      }
      if (pctR > peakR) {
        setPeakR(pctR);
        setHoldR(pctR);
        clearTimeout(holdTimerRef.current.R);
        holdTimerRef.current.R = window.setTimeout(() => setHoldR(0), 1500);
      }

      setLevelL(l => Math.max(pctL, l - 0.05));
      setLevelR(r => Math.max(pctR, r - 0.05));

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [analyser, peakL, peakR]);

  const color = (pct: number) => pct > 0.95 ? "var(--st-red)" : pct > 0.8 ? "var(--st-amber)" : "var(--st-green)";

  return (
    <div className="studio-meter-wrap" style={{ height, width }} onClick={() => { setClipL(false); setClipR(false); }}>
      <div className="studio-meter-ch">
        <div className="studio-meter-fill" style={{ height: `${levelL * 100}%`, background: color(levelL) }} />
        {holdL > 0 && <div className="studio-meter-hold" style={{ bottom: `${holdL * 100}%`, background: color(holdL) }} />}
        {clipL && <div className="studio-meter-clip" />}
      </div>
      <div className="studio-meter-ch">
        <div className="studio-meter-fill" style={{ height: `${levelR * 100}%`, background: color(levelR) }} />
        {holdR > 0 && <div className="studio-meter-hold" style={{ bottom: `${holdR * 100}%`, background: color(holdR) }} />}
        {clipR && <div className="studio-meter-clip" />}
      </div>
    </div>
  );
}
