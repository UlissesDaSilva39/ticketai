import { StudioProject, serializeProject } from "./studio";

const KEY = "grid:studio:projects";
const ACTIVE = "grid:studio:active";

export type ProjectMeta = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  trackCount: number;
  duration: number;
};

export function listProjects(): ProjectMeta[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const all: Record<string, any> = JSON.parse(raw);
    return Object.values(all).map((p: any) => ({
      id: p.id, name: p.name,
      createdAt: p.createdAt, updatedAt: p.updatedAt,
      trackCount: p.tracks?.length ?? 0,
      duration: p.duration ?? 60,
    })).sort((a, b) => b.updatedAt - a.updatedAt);
  } catch { return []; }
}

export function saveProject(project: StudioProject) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    const all = raw ? JSON.parse(raw) : {};
    all[project.id] = {
      ...project,
      tracks: project.tracks.map(t => ({
        ...t,
        clips: t.clips.map(c => ({ ...c, buffer: undefined })),
      })),
      updatedAt: Date.now(),
    };
    localStorage.setItem(KEY, JSON.stringify(all));
    localStorage.setItem(ACTIVE, project.id);
  } catch (e) { console.error("Save failed", e); }
}

export function loadProject(id: string): StudioProject | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const all = JSON.parse(raw);
    return all[id] ?? null;
  } catch { return null; }
}

export function deleteProject(id: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    const all = JSON.parse(raw);
    delete all[id];
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {}
}

export function getActiveProjectId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE);
}

export function setActiveProjectId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE, id);
}

