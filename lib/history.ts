import { StudioProject } from "./studio";

export type Snapshot = { project: StudioProject; timestamp: number };

export class HistoryStack {
  private stack: Snapshot[] = [];
  private index = -1;
  private maxSize = 100;

  push(project: StudioProject) {
    // Truncate redo path
    this.stack = this.stack.slice(0, this.index + 1);
    this.stack.push({ project: JSON.parse(JSON.stringify(project, (k, v) => k === "buffer" ? undefined : v)), timestamp: Date.now() });
    if (this.stack.length > this.maxSize) this.stack.shift();
    this.index = this.stack.length - 1;
  }

  undo(): StudioProject | null {
    if (this.index <= 0) return null;
    this.index--;
    return this.stack[this.index].project;
  }

  redo(): StudioProject | null {
    if (this.index >= this.stack.length - 1) return null;
    this.index++;
    return this.stack[this.index].project;
  }

  canUndo(): boolean { return this.index > 0; }
  canRedo(): boolean { return this.index < this.stack.length - 1; }
  size(): number { return this.stack.length; }
}

export const history = new HistoryStack();

