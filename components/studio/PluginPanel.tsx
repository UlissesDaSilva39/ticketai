"use client";
import { useState } from "react";
import { useStudio } from "./StudioContext";
import {
  PLUGIN_METADATA, PLUGIN_ORDER, PluginType, PluginConfig,
} from "@/lib/studio";

export default function PluginPanel() {
  const {
    project, selectedTrackId,
    addPlugin, updatePluginParam, togglePlugin, removePlugin,
  } = useStudio() as any;

  const [presetMenu, setPresetMenu] = useState<string | null>(null);

  const track = project.tracks.find((t: any) => t.id === selectedTrackId);
  if (!track) {
    return (
      <div className="studio-plugin-panel">
        <div className="studio-plugin-empty">Select a track to add effects</div>
      </div>
    );
  }

  const applyPreset = (pluginId: string, preset: Record<string, number>) => {
    Object.entries(preset).forEach(([k, v]) => {
      updatePluginParam(track.id, pluginId, k, v);
    });
    setPresetMenu(null);
  };

  return (
    <div className="studio-plugin-panel">
      <div className="studio-plugin-header">
        <span>{track.name} — FX Chain</span>
      </div>

      <div className="studio-plugin-add">
        {PLUGIN_ORDER.map((type: PluginType) => {
          const meta = PLUGIN_METADATA[type];
          return (
            <button
              key={type}
              className="studio-btn small"
              onClick={() => addPlugin(track.id, type)}
              title={meta.label}
              style={{ borderColor: meta.color }}
            >
              + {meta.label}
            </button>
          );
        })}
      </div>

      {track.plugins.length === 0 && (
        <div className="studio-plugin-empty">
          No effects yet — click a plugin above to add
        </div>
      )}

      {track.plugins.map((pl: PluginConfig) => {
        const meta = PLUGIN_METADATA[pl.type as PluginType];
        if (!meta) return null;
        const isPresetOpen = presetMenu === pl.id;
        return (
          <div
            key={pl.id}
            className={`studio-plugin-card ${pl.enabled ? "" : "disabled"}`}
            style={{ borderLeft: `3px solid ${meta.color}` }}
          >
            <div className="studio-plugin-card-head">
              <strong style={{ color: meta.color }}>{meta.label}</strong>
              <div className="studio-spacer" />
              <button
                className={`studio-btn small ${pl.enabled ? "primary" : ""}`}
                onClick={() => togglePlugin(track.id, pl.id)}
                title={pl.enabled ? "Bypass" : "Enable"}
              >
                {pl.enabled ? "ON" : "OFF"}
              </button>
              <button
                className="studio-btn small"
                onClick={() => removePlugin(track.id, pl.id)}
                title="Remove"
              >
                ×
              </button>
            </div>

            <div className="studio-plugin-params">
              {meta.params.map(p => {
                const v = pl.params[p.key] ?? 0;
                return (
                  <label key={p.key} className="studio-plugin-param">
                    <span>{p.label}</span>
                    <input
                      type="range"
                      min={p.min}
                      max={p.max}
                      step={p.step}
                      value={v}
                      onChange={e =>
                        updatePluginParam(track.id, pl.id, p.key, Number(e.target.value))
                      }
                    />
                    <em>
                      {v.toFixed(p.step < 1 ? 2 : 0)}
                      {p.unit || ""}
                    </em>
                  </label>
                );
              })}
            </div>

            {Object.keys(meta.presets).length > 0 && (
              <div className="studio-preset-row">
                <button
                  className="studio-preset-toggle"
                  onClick={() => setPresetMenu(isPresetOpen ? null : pl.id)}
                >
                  Preset ▾
                </button>
                {isPresetOpen && (
                  <div className="studio-preset-menu">
                    {Object.entries(meta.presets).map(([name, preset]) => (
                      <button
                        key={name}
                        onClick={() => applyPreset(pl.id, preset)}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
