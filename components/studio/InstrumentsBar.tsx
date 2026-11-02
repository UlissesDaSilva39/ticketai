"use client";
import { useState } from "react";
import { useStudio } from "./StudioContext";
import { SAMPLES, CATEGORY_LABELS, SampleCategory, SampleDef } from "@/lib/samples";

export default function InstrumentsBar() {
  const { addSample } = useStudio() as any;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const byCategory: Record<SampleCategory, SampleDef[]> = {
    drums: [], bass: [], keys: [], guitar: [], vocals: [], fx: [],
  };
  SAMPLES.forEach(s => byCategory[s.category].push(s));

  const handleClick = async (s: SampleDef) => {
    setLoading(s.id);
    try {
      await addSample(s);
      setOpen(false);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="studio-instruments">
      <button
        className="studio-btn instruments-btn"
        onClick={() => setOpen(!open)}
        title="Add built-in instrument sample"
      >
        + Instruments
      </button>

      {open && (
        <>
          <div className="studio-instruments-backdrop" onClick={() => setOpen(false)} />
          <div className="studio-instruments-panel">
            <div className="studio-instruments-header">
              <span>INSTRUMENT SAMPLES</span>
              <button onClick={() => setOpen(false)}>×</button>
            </div>
            <div className="studio-instruments-body">
              {(Object.keys(CATEGORY_LABELS) as SampleCategory[]).map(cat => (
                <div key={cat} className="studio-instruments-category">
                  <div className="studio-instruments-cat-label">{CATEGORY_LABELS[cat]}</div>
                  <div className="studio-instruments-grid">
                    {byCategory[cat].map(s => (
                      <button
                        key={s.id}
                        className={"studio-sample-btn" + (loading === s.id ? " loading" : "")}
                        onClick={() => handleClick(s)}
                        disabled={!!loading}
                        title={`Add ${s.name} (${s.duration}s)`}
                      >
                        {loading === s.id ? "…" : s.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="studio-instruments-footer">
              All samples are synthesized in your browser · no external files
            </div>
          </div>
        </>
      )}
    </div>
  );
}
