"use client";
import { useEffect, useState } from "react";
import { listProjects, deleteProject, setActiveProjectId } from "@/lib/projectStore";
import Link from "next/link";
import "@/app/styles/studio.css";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    setProjects(listProjects());
  }, [refresh]);

  return (
    <div style={{ padding: 32, background: "#0d0d0f", minHeight: "100vh", color: "#e0e0e4" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 24 }}>My Projects</h1>
          <Link href="/studio" className="studio-btn primary">+ New project</Link>
        </div>
        {projects.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "#808088", border: "1px dashed #2a2a30", borderRadius: 8 }}>
            No saved projects yet. Open <Link href="/studio" style={{ color: "#00d4ff" }}>Studio</Link> and hit Save.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
            {projects.map(p => (
              <div key={p.id} style={{ background: "#1a1a1e", border: "1px solid #2a2a30", borderRadius: 8, padding: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "#808088", marginBottom: 12 }}>
                  {p.trackCount} tracks · {Math.round(p.duration)}s
                  <br />
                  {new Date(p.updatedAt).toLocaleString()}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <a href={`/studio?project=${p.id}`} className="studio-btn primary small">Open</a>
                  <button className="studio-btn small" onClick={() => {
                    if (confirm(`Delete "${p.name}"?`)) { deleteProject(p.id); setRefresh(r => r + 1); }
                  }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

